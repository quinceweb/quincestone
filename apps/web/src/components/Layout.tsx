import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import "../marketing.css";
import "../p2-interaction.css";
import "../web-reconciliation.css";
import "../footer-mobile-architecture.css";
import { CorporateFooter } from "./CorporateFooter";

type Item={label:string;to:string;description:string;external?:boolean};
const platform:Item[]=[{label:"Understand demand",to:"/discover",description:"See what people need before choosing the system."},{label:"Build the experience",to:"/build",description:"Turn understanding into a useful customer path."},{label:"Operate the work",to:"/operate",description:"Route qualified demand through governed operations."},{label:"Learn from outcomes",to:"/scale",description:"Connect action to evidence and improve."}];
const company:Item[]=[{label:"About Quincestone",to:"/about",description:"The company, operating thesis and product ecosystem."},{label:"Principles",to:"/about#principles",description:"The principles behind governed intelligence and human authority."},{label:"Research",to:"/research",description:"Field notes, operating insights, product intelligence and technical thinking."},{label:"Security",to:"/security",description:"How Quincestone approaches identity, authority and operational security."},{label:"Careers",to:"/careers",description:"Published opportunities to build Quincestone."},{label:"Contact",to:"/contact",description:"Start a conversation with Quincestone."}];
function Logo(){return <span className="corporate-lockup"><img className="brand-logo" src="/quincestone-logo.svg" alt=""/><strong>QUINCESTONE</strong></span>}
function RouteScrollReset(){
  const {pathname,search,hash,key}=useLocation();
  useEffect(()=>{
    if("scrollRestoration" in window.history) window.history.scrollRestoration="manual";
    if(!hash){window.scrollTo({top:0,left:0,behavior:"auto"});return;}
    const id=decodeURIComponent(hash.slice(1));
    const scrollToTarget=()=>{const target=document.getElementById(id);if(!target)return false;target.scrollIntoView({block:"start",behavior:"auto"});return true};
    if(scrollToTarget())return;
    const observer=new window.MutationObserver(()=>{if(scrollToTarget())observer.disconnect()});
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
  const mobilePanel=useRef<globalThis.HTMLDivElement>(null);
  useEffect(()=>{
    if(!mobile)return;
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    const panel=mobilePanel.current;
    const focusable=()=>Array.from(panel?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')??[]);
    focusable()[0]?.focus();
    const key=(e:KeyboardEvent)=>{
      if(e.key==="Escape"){setMobile(false);menuButton.current?.focus();return}
      if(e.key!=="Tab")return;
      const items=focusable();if(!items.length)return;
      const first=items[0],last=items[items.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    };
    window.addEventListener("keydown",key);
    return()=>{document.body.style.overflow=previousOverflow;window.removeEventListener("keydown",key)}
  },[mobile]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(null)};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[]);
  const close=()=>{setOpen(null);setMobile(false)};
  return <div className="site-shell corporate-shell"><RouteScrollReset/>
    <a className="skip-link" href="#content">Skip to content</a>
    <header className="marketing-header">
      <Link className="brand" to="/" aria-label="Quincestone home" onClick={close}><Logo/></Link>
      <nav className="marketing-nav" aria-label="Primary navigation">
        <div className="nav-group"><button className="nav-trigger" aria-expanded={open==="platform"} aria-controls="platform-navigation" onClick={()=>setOpen(open==="platform"?null:"platform")}>Platform</button>{open==="platform"&&<Menu id="platform-navigation" items={platform} close={close}/>}</div>
        <NavLink to="/edge">Edge</NavLink><NavLink to="/business">Business</NavLink><NavLink to="/commerce">Commerce</NavLink><NavLink to="/deals">Deals</NavLink>
        <div className="nav-group"><button className="nav-trigger" aria-expanded={open==="company"} aria-controls="company-navigation" onClick={()=>setOpen(open==="company"?null:"company")}>Company</button>{open==="company"&&<Menu id="company-navigation" items={company} close={close}/>}</div>
      </nav>
      <div className="marketing-actions"><a className="text-link sign-in-link" href="https://shop.quincestone.com">Shop</a><a className="text-link sign-in-link" href="https://account.quincestone.com">Account</a><a className="text-link sign-in-link" href="https://app.quincestone.com">Business OS</a><NavLink className="button small" to="/assessment">Start assessment</NavLink></div>
      <button ref={menuButton} className="marketing-menu" aria-label={mobile?"Close menu":"Open menu"} aria-expanded={mobile} aria-controls="mobile-panel" onClick={()=>{setOpen(null);setMobile(v=>!v)}}><span/></button>
      {mobile&&<div ref={mobilePanel} id="mobile-panel" className="mobile-panel" data-open="true" role="dialog" aria-modal="true" aria-label="Primary navigation">
        <div className="mobile-panel-head"><span>QUINCESTONE / INSTITUTIONAL SYSTEM</span><strong>Turn demand into outcomes.</strong><p>One governed path from understanding to action.</p></div>
        <NavLink to="/platform" onClick={close}>Platform <span aria-hidden="true">01</span></NavLink>
        <NavLink to="/business" onClick={close}>Business <span aria-hidden="true">02</span></NavLink>
        <NavLink to="/edge" onClick={close}>Edge <span aria-hidden="true">03</span></NavLink>
        <NavLink to="/commerce" onClick={close}>Commerce <span aria-hidden="true">04</span></NavLink>
        <NavLink to="/deals" onClick={close}>Deals <span aria-hidden="true">05</span></NavLink>
        <NavLink to="/research" onClick={close}>Research <span aria-hidden="true">06</span></NavLink>
        <NavLink to="/about" onClick={close}>Company <span aria-hidden="true">07</span></NavLink>
        <div className="mobile-panel-actions"><a className="mobile-sign-in" href="https://account.quincestone.com/sign-in">Sign in</a><NavLink className="button mobile-cta" to="/assessment" onClick={close}>Start assessment <span aria-hidden="true">→</span></NavLink></div>
      </div>}
    </header>
    <div id="content"><Outlet/></div><CorporateFooter/>
  </div>
}
