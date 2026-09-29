import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import "../marketing.css";
import "../p2-interaction.css";
import "../web-reconciliation.css";
import "../footer-mobile-architecture.css";
import { CorporateFooter } from "./CorporateFooter";

type Item={label:string;to:string;description:string;external?:boolean};
const platform:Item[]=[{label:"Understand demand",to:"/discover",description:"See what people need before choosing the system."},{label:"Build the experience",to:"/build",description:"Turn understanding into a useful customer path."},{label:"Operate the work",to:"/operate",description:"Route qualified demand through governed operations."},{label:"Learn from outcomes",to:"/scale",description:"Connect action to evidence and improve."}];
const company:Item[]=[{label:"About Quincestone",to:"/about",description:"The company, operating thesis and product ecosystem."},{label:"Principles",to:"/about#principles",description:"The principles behind governed intelligence and human authority."},{label:"Security",to:"/security",description:"How Quincestone approaches identity, authority and operational security."},{label:"Contact",to:"/contact",description:"Start a conversation with Quincestone."}];
function Logo(){return <span className="corporate-lockup"><img className="brand-logo" src="/quincestone-logo.svg" alt=""/><strong>QUINCESTONE</strong></span>}
function Menu({items,close}:{items:Item[];close:()=>void}){return <div className="nav-popover qs-mega" role="menu">{items.map(item=>item.external?<a key={item.label} href={item.to} role="menuitem" onClick={close}><strong>{item.label}</strong><small>{item.description}</small></a>:<NavLink key={item.label} to={item.to} role="menuitem" onClick={close}><strong>{item.label}</strong><small>{item.description}</small></NavLink>)}</div>}
export function Layout(){
  const[open,setOpen]=useState<string|null>(null);
  const[mobile,setMobile]=useState(false);
  const menuButton=useRef<HTMLButtonElement>(null);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==="Escape"){setOpen(null);if(mobile){setMobile(false);menuButton.current?.focus()}}};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[mobile]);
  const close=()=>{setOpen(null);setMobile(false)};
  return <div className="site-shell corporate-shell">
    <a className="skip-link" href="#content">Skip to content</a>
    <header className="marketing-header">
      <Link className="brand" to="/" aria-label="Quincestone home" onClick={close}><Logo/></Link>
      <nav className="marketing-nav" aria-label="Primary navigation">
        <div className="nav-group"><button className="nav-trigger" aria-expanded={open==="platform"} onClick={()=>setOpen(open==="platform"?null:"platform")}>Platform</button>{open==="platform"&&<Menu items={platform} close={close}/>}</div>
        <NavLink to="/business">Business</NavLink><NavLink to="/edge">Edge</NavLink><a href="https://shop.quincestone.com">Commerce</a>
        <div className="nav-group"><button className="nav-trigger" aria-expanded={open==="company"} onClick={()=>setOpen(open==="company"?null:"company")}>Company</button>{open==="company"&&<Menu items={company} close={close}/>}</div>
      </nav>
      <div className="marketing-actions"><a className="text-link sign-in-link" href="https://account.quincestone.com/sign-in">Sign in</a><NavLink className="button small" to="/assessment">Start assessment</NavLink></div>
      <button ref={menuButton} className="marketing-menu" aria-label={mobile?"Close menu":"Open menu"} aria-expanded={mobile} aria-controls="mobile-panel" onClick={()=>setMobile(v=>!v)}><span/></button>
      <div id="mobile-panel" className="mobile-panel" data-open={mobile} aria-hidden={!mobile}>
        <div className="mobile-panel-head"><span>QUINCESTONE / INSTITUTIONAL SYSTEM</span><strong>Turn demand into outcomes.</strong><p>One governed path from understanding to action.</p></div>
        <NavLink to="/platform" onClick={close}>Platform <span aria-hidden="true">01</span></NavLink>
        <NavLink to="/business" onClick={close}>Business <span aria-hidden="true">02</span></NavLink>
        <NavLink to="/edge" onClick={close}>Edge <span aria-hidden="true">03</span></NavLink>
        <a href="https://shop.quincestone.com">Commerce <span aria-hidden="true">04 ↗</span></a>
        <NavLink to="/about" onClick={close}>Company <span aria-hidden="true">05</span></NavLink>
        <div className="mobile-panel-actions"><a className="mobile-sign-in" href="https://account.quincestone.com/sign-in">Sign in</a><NavLink className="button mobile-cta" to="/assessment" onClick={close}>Start assessment <span aria-hidden="true">→</span></NavLink></div>
      </div>
    </header>
    <div id="content"><Outlet/></div><CorporateFooter/>
  </div>
}
