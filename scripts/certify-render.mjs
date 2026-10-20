import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE);
await mkdir("certification-evidence", { recursive: true });
const report = { source: process.env.CERTIFIED_SOURCE_SHA, target: "exact-source production builds on CI localhost; auth network fixture; no live submissions", results: [], failures: [] };
const children = [
  spawn("pnpm", ["--filter", "@quincestone/web", "exec", "vite", "preview", "--host", "127.0.0.1", "--port", "4173"], { stdio: "inherit" }),
  spawn("pnpm", ["--filter", "@quincestone/app", "exec", "next", "start", "--hostname", "127.0.0.1", "--port", "4174"], { stdio: "inherit" }),
];
let browser;
async function ready(url) {
  for (let i=0;i<60;i++) { try { if ((await fetch(url)).ok) return; } catch {} await new Promise(r=>setTimeout(r,1000)); }
  throw new Error("Server did not become ready: "+url);
}
async function record(name, task) {
  try { const detail = await task(); report.results.push({ name, status: "PASS", detail }); console.log("PASS "+name+" "+JSON.stringify(detail ?? {})); }
  catch(error) { report.failures.push({ name, error: error.message }); console.error("FAIL "+name+" "+error.message); }
}
async function capture(page, name) {
  await page.screenshot({ path: "certification-evidence/"+name+".png", fullPage: true, animations: "disabled" });
}
async function geometry(page) {
  return page.evaluate(() => {
    const h=document.querySelector("h1"); const rect=h?.getBoundingClientRect();
    return { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, heading: h?.textContent, headingVisible: !!rect && rect.width>0 && rect.height>0 && getComputedStyle(h).visibility!=="hidden", headingOverflow: h ? h.scrollWidth>h.clientWidth+2 : true };
  });
}
try {
  await Promise.all([ready("http://127.0.0.1:4173"),ready("http://127.0.0.1:4174/sign-up")]);
  browser=await chromium.launch();
  for (const [width,height] of [[375,812],[768,1024],[1440,900]]) {
    const context=await browser.newContext({ viewport: {width,height}, reducedMotion:"reduce" });
    // Deny external requests: this suite never creates accounts or submits production data.
    await context.route("**/*",route => {
      const host=new URL(route.request().url()).hostname;
      return host==="127.0.0.1" ? route.continue() : route.abort();
    });
    const page=await context.newPage();
    const errors=[]; page.on("pageerror",error=>errors.push(error.message));
    for(const path of ["/","/platform","/discover","/build","/operate","/scale","/edge","/business","/commerce","/about","/security","/privacy","/terms","/cookies","/assessment","/demo/experience","/demo/operations","/contact","/outside-the-map"]) {
      await record(width+" route "+path,async()=>{
        await page.goto("http://127.0.0.1:4173"+path);
        await page.locator("h1").first().waitFor();
        await page.evaluate(()=>document.fonts.ready);
        await capture(page,width+"-"+(path.slice(1).replaceAll("/","-")||"home"));
        const g=await geometry(page);
        assert.equal(g.width,width); assert.equal(g.height,height);
        assert.ok(g.scrollWidth<=width+2,"Document overflows horizontally: "+JSON.stringify(g));
        assert.ok(g.headingVisible,"Heading invisible"); assert.ok(!g.headingOverflow,"Heading clipped");
        return g;
      });
    }
    await record(width+" navigation",async()=>{
      await page.goto("http://127.0.0.1:4173/");
      const mark=page.locator(".master-wordmark");
      const box=await mark.boundingBox(); assert.ok(box && box.width>100);
      const svg=await mark.evaluate(el=>({bounds:el.getBBox().x+el.getBBox().width,viewBox:el.viewBox.baseVal.width}));
      assert.ok(svg.bounds<=svg.viewBox,"Wordmark paths clipped by SVG viewBox");
      if(width<=820) {
        const menu=page.getByRole("button",{name:"Open menu",exact:true});
        await menu.click(); await page.getByRole("button",{name:"Close menu",exact:true}).click();
        assert.equal(await menu.getAttribute("aria-expanded"),"false");
        await menu.click(); await page.keyboard.press("Escape");
        assert.equal(await menu.getAttribute("aria-expanded"),"false");
        await menu.click(); await page.locator("#mobile-panel").getByRole("link",{name:"Edge",exact:true}).click();
        assert.equal(new URL(page.url()).pathname,"/edge");
        assert.equal(await page.locator(".marketing-menu").getAttribute("aria-expanded"),"false");
      } else {
        await page.getByRole("button",{name:"Platform",exact:true}).click();
        await page.getByRole("menuitem",{name:/Understand demand/}).click();
        assert.equal(new URL(page.url()).pathname,"/discover");
        await page.getByRole("button",{name:"Search",exact:true}).click();
        await page.locator("#site-search").fill("Edge");
        assert.equal(await page.locator("#corporate-search").getByRole("link").count(),1);
        await page.locator("#site-search").fill("zzznodestination");
        assert.ok(await page.getByRole("status").isVisible());
        await capture(page,width+"-search-empty");
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("#corporate-search").count(),0);
      }
      await page.locator("footer").scrollIntoViewIfNeeded();
      await page.locator("footer").getByRole("link",{name:"Platform",exact:true}).click();
      assert.equal(await page.evaluate(()=>scrollY),0);
      return {wordmark:svg,menu:"open/close/Escape/route checked where available",scrollReset:0};
    });
    await record(width+" decision states",async()=>{
      await page.goto("http://127.0.0.1:4173/edge");
      await page.getByRole("tab",{name:/Policy/}).click();
      assert.ok(await page.getByText("Human review required",{exact:true}).isVisible());
      await capture(page,width+"-edge-policy");
      await page.goto("http://127.0.0.1:4173/business");
      await page.getByRole("button",{name:"High-value exception",exact:true}).click();
      await page.getByRole("tab",{name:/Authority/}).click();
      assert.ok(await page.getByText("Human review required",{exact:true}).isVisible());
      await capture(page,width+"-business-authority");
      await page.goto("http://127.0.0.1:4173/commerce");
      await page.getByRole("tab",{name:/Learning/}).click();
      assert.equal(await page.locator(".commerce-state>strong").textContent(),"Learning");
      return {edge:"human review",business:"human review",commerce:"Learning"};
    });
    await record(width+" assessment",async()=>{
      await page.goto("http://127.0.0.1:4173/assessment");
      const background=await page.locator(".edge-assessment").evaluate(el=>getComputedStyle(el).backgroundColor);
      assert.equal(background,"rgb(7, 9, 8)");
      await page.getByRole("button",{name:"Begin assessment"}).click();
      const next=page.getByRole("button",{name:/Continue/});
      assert.ok(await next.isDisabled());
      await page.getByRole("textbox").fill("Visual QA");
      assert.ok(await next.isEnabled()); await next.click();
      await page.getByRole("textbox").fill("invalid"); assert.ok(await next.isDisabled());
      await page.getByRole("textbox").fill("qa@example.invalid"); assert.ok(await next.isEnabled());
      await page.getByRole("button",{name:/Back/}).click();
      assert.equal(await page.getByRole("textbox").inputValue(),"Visual QA");
      await capture(page,width+"-assessment-filled");
      assert.ok((await geometry(page)).scrollWidth<=width+2);
      return {background,emptyDisabled:true,emailValidation:true,backPreservesAnswer:true,submitted:false};
    });
    await record(width+" signup",async()=>{
      await page.goto("http://127.0.0.1:4174/sign-up");
      await page.getByRole("heading",{name:"Start with Quincestone",exact:true}).waitFor();
      assert.equal(await page.locator("input").count(),3);
      const bg=await page.locator(".qs-entry-signup").evaluate(el=>getComputedStyle(el).backgroundColor);
      assert.equal(bg,"rgb(7, 9, 8)");
      await page.getByLabel("Work email",{exact:true}).focus();
      const focus=await page.getByLabel("Work email",{exact:true}).evaluate(el=>({focused:document.activeElement===el,shadow:getComputedStyle(el).boxShadow}));
      assert.ok(focus.focused); assert.notEqual(focus.shadow,"none");
      assert.ok((await page.getByRole("link",{name:"Sign in",exact:true}).getAttribute("href")).startsWith("/sign-in?next="));
      await capture(page,width+"-signup-focus");
      const g=await geometry(page); assert.equal(g.width,width); assert.ok(g.scrollWidth<=width+2,"Signup horizontal overflow");
      return { ...g,background:bg,inputs:3,focus,submitted:false };
    });
    // Auth is deliberately network-isolated; runtime service behavior has its own gate.
    await record(width+" Corporate JavaScript errors",async()=>{ assert.deepEqual(errors,[]); return errors; });
    await context.close();
  }
} finally {
  await browser?.close();
  children.forEach(child=>child.kill("SIGTERM"));
  await writeFile("certification-evidence/report.json",JSON.stringify(report,null,2));
  const summary=["# Controlled-width browser certification","Source: "+report.source,"Target: "+report.target,"Passes: "+report.results.length,"Failures: "+report.failures.length,...report.failures.map(x=>"- "+x.name+": "+x.error)].join("\n");
  console.log(summary);
  if(process.env.GITHUB_STEP_SUMMARY) await writeFile(process.env.GITHUB_STEP_SUMMARY,summary+"\n",{flag:"a"});
}
if(report.failures.length) process.exitCode=1;
