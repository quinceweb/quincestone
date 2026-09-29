import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import "../marketing.css";
import "../p2-interaction.css";
import "../web-reconciliation.css";
import "../footer-mobile-architecture.css";
import { CorporateFooter } from "./CorporateFooter";

type Item={label:string;to:string;description:string;external?:boolean};
const platform:Item[]=[{label:"Understand demand",to:"/discover",description:"See what people need before choosing the system."},{label:"Build the experience",to:"/build",description:"Turn understanding into a useful customer path."},{label:"Operate the work",to:"/operate",description:"Route qualified demand through governed operations."},{label:"Learn from outcomes",to:"/scale",description:"Connect action to evidence and improve."}];
const company:Item[]=[{label:"About Quincestone",to:"/about",description:"The company, operating thesis and product ecosystem."},{label:"Principles",to:"/about#principles",description:"The principles behind governed intelligence and human authority."},{label:"Security",to:"/security",description:"How Quincestone approaches identity, authority and operational security."},{label:"Contact",to:"/contact",description:"Start a conversation with Quincestone."}];
function Logo(){return <span className="corporate-lockup"><img className="brand-logo" src="/quincestone-logo.svg" alt=""/><strong>QUINCESTONE</strong></span>}
function RouteScrollReset(){
  const {pathname,search,hash,key}=useLocation();
  useEffect(()=>{
    if("scrollRestoration" in window.history) window.history.scrollRestoration="manual";
    if(!hash){window.scrollTo({top:0,left:0,behavior:"auto"});return;}
    const id=decodeURIComponent(hash.slice(1));
    const scrollToTarget=()=>{const target=document.getElementById(id);if(!target)return false;target.scrollIntoView({block:"start",behavior:"auto"});return true};
    if(scrollToTarget())return;
    const observer=new MutationObserver(()=>{if(scrollToTarget())observer.disconnect()});
    observer.observe(document.body,{childList:true,subtree:true});
    const timeout=window.setTimeout(()=>observer.disconnect(),2000);
    return()=>{observer.disconnect();window.clearTimeout(timeout)};
  },[pathname,search,hash,key]);
  return null;
}
function Menu({id,items,close}:{id:string;items:Item[];close:()=>void}){return <div id={id} className="nav-popover qs-mega">{items.map(item=>item.external?<a key={item.label} href={item.to} onClick={close}><strong>{item.label}</strong><small>{item.description}</small></a>:<NavLink key={item.label} to={item.to} onClick={close}><strong>{item.label}</strong><small>{item.description}</small></NavLink>)}</div>}
export function Layout(){
  const[open,setOpen]=useState<string|null>(null);
  const[mobile,setMobile]=useState(false);
  const menuButton=useRef<globalThis.HTMLButtonElement>(null);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==="Escape"){setOpen(null);if(mobile){setMobile(false);menuButton.current?.focus()}}};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[mobile]);
  const close=()=>{setOpen(null);setMobile(false)};
  return <div className="site-shell corporate-shell"><RouteScrollReset/>
    <a className="skip-link" href="#content">Skip to content</a>
    <header className="marketing-header">
      <Link className="brand" to="/" aria-label="Quincestone home" onClick={close}><Logo/></Link>
      <nav className="marketing-nav" aria-label="Primary navigation">
        <div className="nav-group"><button className="nav-trigger" aria-expanded={open==="platform"} aria-controls="platform-navigation" onClick={()=>setOpen(open==="platform"?null:"platform")}>Platform</button>{open==="platform"&&<Menu id="platform-navigation" items={platform} close={close}/>}</div>
        <NavLink to="/business">Business</NavLink><NavLink to="/edge">Edge</NavLink><a href="https://shop.quincestone.com">Commerce</a>
        <div className="nav-group"><button className="nav-trigger" aria-expanded={open==="company"} aria-controls="company-navigation" onClick={()=>setOpen(open==="company"?null:"company")}>Company</button>{open==="company"&&<Menu id="company-navigation" items={company} close={close}/>}</div>
      </nav>
      <div className="marketing-actions"><a className="text-link sign-in-link" href="https://account.quincestone.com/sign-in">Sign in</a><NavLink className="button small" to="/assessment">Start assessment</NavLink></div>
      <button ref={menuButton} className="marketing-menu" aria-label={mobile?"Close menu":"Open menu"} aria-expanded={mobile} aria-controls="mobile-panel" onClick={()=>setMobile(v=>!v)}><span/></button>
      {mobile&&<div id="mobile-panel" className="mobile-panel" data-open="true">
        <div className="mobile-panel-head"><span>QUINCESTONE / INSTITUTIONAL SYSTEM</span><strong>Turn demand into outcomes.</strong><p>One governed path from understanding to action.</p></div>
        <NavLink to="/platform" onClick={close}>Platform <span aria-hidden="true">01</span></NavLink>
        <NavLink to="/business" onClick={close}>Business <span aria-hidden="true">02</span></NavLink>
        <NavLink to="/edge" onClick={close}>Edge <span aria-hidden="true">03</span></NavLink>
        <a href="https://shop.quincestone.com">Commerce <span aria-hidden="true">04 ↗</span></a>
        <NavLink to="/about" onClick={close}>Company <span aria-hidden="true">05</span></NavLink>
        <div className="mobile-panel-actions"><a className="mobile-sign-in" href="https://account.quincestone.com/sign-in">Sign in</a><NavLink className="button mobile-cta" to="/assessment" onClick={close}>Start assessment <span aria-hidden="true">→</span></NavLink></div>
      </div>}
    </header>
    <div id="content"><Outlet/></div><CorporateFooter/>
  </div>
}
