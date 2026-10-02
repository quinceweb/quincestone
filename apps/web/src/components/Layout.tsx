import { useEffect, useRef, useState, type ComponentRef } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import "../marketing.css";
import "../p2-interaction.css";
import "../web-reconciliation.css";
import "../footer-mobile-architecture.css";
import { CorporateFooter } from "./CorporateFooter";
import { QuincestoneWordmark } from "../../../../packages/ui/src/brand-signature";

type Item={label:string;to:string;description:string;external?:boolean};
const searchItems:Item[]=[
  {label:"Platform",to:"/platform",description:"The Quincestone operating model."},
  {label:"Edge",to:"/edge",description:"Governed intelligence with an authority boundary."},
  {label:"Business",to:"/business",description:"Business operating systems and authorized work."},
  {label:"Commerce",to:"/commerce",description:"Demand-led product and commerce systems."},
  {label:"About",to:"/about",description:"Why Quincestone exists and how it operates."},
  {label:"Security",to:"/security",description:"Security and operating boundaries."}
];

const platform:Item[]=[
  {label:"Understand demand",to:"/discover",description:"See what people need before choosing the system."},
  {label:"Build the experience",to:"/build",description:"Turn understanding into a useful customer path."},
  {label:"Operate the work",to:"/operate",description:"Route qualified demand through governed operations."},
  {label:"Learn from outcomes",to:"/scale",description:"Connect action to evidence and improve."}
];

function SearchIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3"/><path d="m15.5 15.5 5 5"/></svg>}
function AccountIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.4"/><path d="M5.7 20c.6-4 2.8-6.1 6.3-6.1s5.7 2.1 6.3 6.1"/></svg>}
function Menu({items,close}:{items:Item[];close:()=>void}){return <div className="nav-popover qs-mega" role="menu">{items.map(item=>item.external?<a key={item.label} href={item.to} role="menuitem" onClick={close}><strong>{item.label}</strong><small>{item.description}</small></a>:<NavLink key={item.label} to={item.to} role="menuitem" onClick={close}><strong>{item.label}</strong><small>{item.description}</small></NavLink>)}</div>}

export function Layout(){
  const[open,setOpen]=useState<string|null>(null);
  const[mobile,setMobile]=useState(false);
  const[searchQuery,setSearchQuery]=useState("");
  const searchButtonRef=useRef<ComponentRef<"button">>(null);
  const searchResults=searchItems.filter(item=>!searchQuery.trim()||`${item.label} ${item.description}`.toLowerCase().includes(searchQuery.toLowerCase()));
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==="Escape"){if(open==="search")searchButtonRef.current?.focus();setOpen(null);setMobile(false)}};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[open]);
  const close=()=>{setOpen(null);setMobile(false)};
  return <div className="site-shell corporate-shell">
    <a className="skip-link" href="#content">Skip to content</a>
    <header className="marketing-header">
      <Link className="brand" to="/" aria-label="Quincestone home" onClick={close}><QuincestoneWordmark className="master-wordmark" /></Link>
      <nav className="marketing-nav" aria-label="Primary navigation">
        <div className="nav-group" data-open={open==="platform"}><button className="nav-trigger" aria-expanded={open==="platform"} onClick={()=>setOpen(open==="platform"?null:"platform")}>Platform</button>{open==="platform"&&<Menu items={platform} close={close}/>}</div>
        <NavLink to="/edge">Edge</NavLink>
        <NavLink to="/business">Business</NavLink>
        <a href="https://shop.quincestone.com">Commerce</a>
        <a href="https://quincestonedeals.app">Deals</a>
      </nav>
      <div className="marketing-actions header-utilities">
        <div className="header-search"><button ref={searchButtonRef} className="header-icon" type="button" aria-label="Search" aria-expanded={open==="search"} aria-controls="corporate-search" onClick={()=>setOpen(open==="search"?null:"search")}><SearchIcon/></button>{open==="search"&&<div id="corporate-search" className="search-popover"><label htmlFor="site-search">Search Quincestone</label><input id="site-search" autoFocus value={searchQuery} onChange={(event)=>setSearchQuery(event.target.value)} placeholder="Platform, Edge, Business…" /> <div>{searchResults.map(item=><NavLink key={item.label} to={item.to} onClick={close}><strong>{item.label}</strong><small>{item.description}</small></NavLink>)}</div>{searchResults.length===0&&<p role="status">No destinations found. Try Platform, Edge, or Business.</p>}</div>}</div>
        <a className="header-icon" href="https://app.quincestone.com/account" aria-label="Account"><AccountIcon/></a>
        <a className="header-signup" href="https://app.quincestone.com/sign-up">Create account</a>
      </div>
      <button className="marketing-menu" aria-label={mobile?"Close menu":"Open menu"} aria-expanded={mobile} aria-controls="mobile-panel" onClick={()=>setMobile(v=>!v)}><span/></button>
      <div id="mobile-panel" className="mobile-panel" data-open={mobile}>
        <QuincestoneWordmark className="mobile-wordmark" />
        <NavLink to="/platform" onClick={close}>Platform</NavLink>
        <NavLink to="/edge" onClick={close}>Edge</NavLink>
        <NavLink to="/business" onClick={close}>Business</NavLink>
        <a href="https://shop.quincestone.com">Commerce</a>
        <a href="https://quincestonedeals.app">Deals</a>
        <a href="https://app.quincestone.com/account">Account</a>
        <a href="https://app.quincestone.com/sign-up?next=%2Faccount">Create account</a>
      </div>
    </header>
    <main id="content"><Outlet/></main>
    <CorporateFooter/>
  </div>
}
