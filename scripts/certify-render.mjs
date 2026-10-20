import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
const AXE_PATH="/tmp/qs-browser/node_modules/axe-core/axe.min.js";
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
  if(["320-home","375-build","1920-home","native-200percent-build"].includes(name))console.log("REVIEW_IMAGE "+name+" "+(await page.screenshot({type:"jpeg",quality:65,animations:"disabled"})).toString("base64"));
}
async function geometry(page) {
  return page.evaluate(() => {
    const h=document.querySelector("h1"); const rect=h?.getBoundingClientRect();
    return { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, heading: h?.textContent, headingVisible: !!rect && rect.width>0 && rect.height>0 && getComputedStyle(h).visibility!=="hidden", headingOverflow: h ? h.scrollWidth>h.clientWidth+2 : true, headingClientWidth: h?.clientWidth, headingScrollWidth: h?.scrollWidth, headingRect: rect ? {left:rect.left,right:rect.right,width:rect.width}:null, clipAncestors: h ? Array.from((function*(el){while(el){yield el;el=el.parentElement;}})(h.parentElement)).filter(el=>["hidden","clip"].includes(getComputedStyle(el).overflowX)).map(el=>({tag:el.tagName,class:el.className,left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right})):[] };
  });
}
try {
  await Promise.all([ready("http://127.0.0.1:4173"),ready("http://127.0.0.1:4174/sign-up")]);
  browser=await chromium.launch();
  for (const [width,height] of [[320,812],[375,812],[390,844],[768,1024],[1024,768],[1280,900],[1440,900],[1920,1080]]) {
    const context=await browser.newContext({ viewport: {width,height}, reducedMotion:"reduce" });
    // Deny external requests: this suite never creates accounts or submits production data.
    await context.route("**/*",route => {
      const host=new URL(route.request().url()).hostname;
      return host==="127.0.0.1" ? route.continue() : route.abort();
    });
    const page=await context.newPage();
    const errors=[]; page.on("pageerror",error=>errors.push(error.message));
    for(const path of ["/","/platform","/discover","/build","/operate","/scale","/edge","/business","/commerce","/about","/security","/privacy","/terms","/cookies","/assessment","/demo/experience","/demo/operations","/contact","/outside-the-map","/intelligence","/knowledge","/policies","/workflows","/escalations","/integrations","/qualification","/operations","/workflow-routing","/industries","/industries/roofing","/industries/solar","/industries/dental","/industries/professional-services","/process","/apply","/pricing","/onboarding","/product-discovery"]) {
      await record(width+" route "+path,async()=>{
        await page.goto("http://127.0.0.1:4173"+path);
        await page.locator("h1").first().waitFor();
        await page.evaluate(()=>document.fonts.ready);
        await capture(page,width+"-"+(path.slice(1).replaceAll("/","-")||"home"));
        const g=await geometry(page);
        assert.equal(g.width,width); assert.equal(g.height,height);
        assert.ok(g.scrollWidth<=width+2,"Document overflows horizontally: "+JSON.stringify(g));
        assert.ok(g.headingVisible,"Heading invisible");
        if(g.headingOverflow) console.log("RENDER_EVIDENCE "+width+" "+path+" "+(await page.screenshot({type:"jpeg",quality:65,fullPage:false})).toString("base64"));
        assert.ok(!g.headingOverflow,"Heading overflow: "+JSON.stringify(g));
        if(width===375||width===1440) {
          await page.addScriptTag({path:AXE_PATH});
          const a11y=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa","best-practice"]}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});
          await writeFile("certification-evidence/axe-"+width+"-"+(path.slice(1).replaceAll("/","-")||"home")+".json",JSON.stringify(a11y,null,2));
          assert.deepEqual(a11y,[],"Accessibility violations: "+JSON.stringify(a11y));
        }
        const links=await page.locator("a[href]").evaluateAll(nodes=>nodes.map(n=>({text:n.textContent.trim(),href:n.getAttribute("href")})));
        for(const link of links) {
          if(/^(Get started|Create account)$/.test(link.text)) assert.ok(link.href.startsWith("https://app.quincestone.com/sign-up"),"Invalid signup CTA "+JSON.stringify(link));
          if(link.text==="Sign in") assert.ok(link.href.startsWith("https://app.quincestone.com/sign-in"),"Invalid sign-in CTA");
          if(/Start.*assessment/i.test(link.text)) assert.equal(link.href,"/assessment","Invalid assessment CTA");
          assert.ok(!/^javascript:/i.test(link.href),"Unsafe link");
        }
        return g;
      });
    }
    await record(width+" navigation",async()=>{
      await page.goto("http://127.0.0.1:4173/");
      const mark=page.locator(".master-wordmark");
      const box=await mark.boundingBox(); assert.ok(box && box.width>100);
      const svg=await mark.evaluate(el=>({bounds:el.getBBox().x+el.getBBox().width,viewBox:el.viewBox.baseVal.width}));
      assert.ok(svg.bounds<=svg.viewBox,"Wordmark paths clipped by SVG viewBox");
      if(width<=1100) {
        const menu=page.getByRole("button",{name:"Open menu",exact:true});
        await menu.click();
        assert.equal(await page.evaluate(()=>document.body.style.overflow),"hidden");
        assert.ok(await page.locator("#mobile-panel a").first().evaluate(el=>document.activeElement===el));
        await page.getByRole("button",{name:"Close menu",exact:true}).click();
        assert.equal(await menu.getAttribute("aria-expanded"),"false");
        await menu.click(); await page.keyboard.press("Escape");
        assert.ok(await menu.evaluate(el=>document.activeElement===el));
        assert.notEqual(await page.evaluate(()=>document.body.style.overflow),"hidden");
        assert.equal(await menu.getAttribute("aria-expanded"),"false");
        await menu.click(); await page.locator("#mobile-panel").getByRole("link",{name:"Edge",exact:true}).click();
        assert.equal(new URL(page.url()).pathname,"/edge");
        assert.equal(await page.locator(".marketing-menu").getAttribute("aria-expanded"),"false");
      } else {
        await page.getByRole("button",{name:"Platform",exact:true}).click();
        await page.getByRole("link",{name:/Understand demand/}).click();
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
      if(width<=640) await page.locator(".corporate-footer__nav--mobile summary").filter({hasText:"Platform"}).click();
      await page.locator("footer").getByRole("link",{name:"Platform",exact:true}).click();
      assert.equal(await page.evaluate(()=>scrollY),0);
      return {wordmark:svg,menu:"open/close/Escape/route checked where available",scrollReset:0};
    });
    await record(width+" decision states",async()=>{
      await page.goto("http://127.0.0.1:4173/edge");
      await page.getByRole("tab",{name:/Facts/}).focus();
      await page.keyboard.press("ArrowRight");await page.keyboard.press("ArrowRight");
      assert.equal(await page.getByRole("tab",{name:/Policy/}).getAttribute("aria-selected"),"true");
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

  await record("native browser zoom 200%",async()=>{
    const extension="/tmp/quincestone-zoom-extension";
    await mkdir(extension,{recursive:true});
    await writeFile(extension+"/manifest.json",JSON.stringify({manifest_version:3,name:"Quincestone controlled zoom verification",version:"1.0",permissions:["tabs"],background:{service_worker:"worker.js"}}));
    await writeFile(extension+"/worker.js","chrome.runtime.onInstalled.addListener(()=>{});");
    const zoomContext=await chromium.launchPersistentContext("/tmp/qs-zoom-profile",{headless:false,viewport:null,args:["--window-size=1440,1000","--disable-extensions-except="+extension,"--load-extension="+extension]});
    try {
      const page=await zoomContext.newPage();
      await page.goto("http://127.0.0.1:4173/build");
      const before=await page.evaluate(()=>({width:innerWidth,dpr:devicePixelRatio}));
      const worker=zoomContext.serviceWorkers()[0]||await zoomContext.waitForEvent("serviceworker");
      const factor=await worker.evaluate(async()=>{const tabs=await chrome.tabs.query({});const tab=tabs.find(t=>t.url?.includes("127.0.0.1:4173/build"));if(!tab)throw Error("Zoom tab missing");await chrome.tabs.setZoom(tab.id,2);return chrome.tabs.getZoom(tab.id);});
      assert.equal(factor,2);
      await page.waitForFunction(before=>innerWidth<=before.width/2+2,before);
      const after=await geometry(page);
      assert.ok(after.scrollWidth<=after.width+2,"200% zoom overflow");assert.ok(!after.headingOverflow,"200% heading overflow");
      await capture(page,"native-200percent-build");
      for(const path of ["/","/assessment","/business","/edge","/about","/contact","/privacy"]) {
        await page.goto("http://127.0.0.1:4173"+path);
        const g=await geometry(page);assert.ok(g.scrollWidth<=g.width+2,"Zoom overflow "+path);assert.ok(!g.headingOverflow,"Zoom clipped heading "+path);
        await capture(page,"native-200percent-"+(path.slice(1)||"home"));
      }
      return {factor,before,after,method:"Chromium extension chrome.tabs.setZoom, measured CSS viewport reflow"};
    } finally {await zoomContext.close();}
  });

} finally {
  await browser?.close();
  children.forEach(child=>child.kill("SIGTERM"));
  await writeFile("certification-evidence/report.json",JSON.stringify(report,null,2));
  const summary=["# Controlled-width browser certification","Source: "+report.source,"Target: "+report.target,"Passes: "+report.results.length,"Failures: "+report.failures.length,...report.failures.map(x=>"- "+x.name+": "+x.error)].join("\n");
  console.log(summary);
  if(process.env.GITHUB_STEP_SUMMARY) await writeFile(process.env.GITHUB_STEP_SUMMARY,summary+"\n",{flag:"a"});
}
if(report.failures.length) process.exitCode=1;
