import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import "../marketing.css";
import "../p2-interaction.css";
import "../web-reconciliation.css";
import "../shop-account.css";
import "../footer-mobile-architecture.css";
import "../footer-commerce-premium.css";

type Item = { label: string; to: string; description: string };
type Group = { label: string; statement: string; items: Item[] };
const APP_SIGN_UP = "https://app.quincestone.com/sign-up";
const APP_SIGN_IN = "https://app.quincestone.com/sign-in";
const SHOP = "https://shop.quincestone.com";
const ACCOUNT = "https://account.quincestone.com";
const groups: Group[] = [
  { label: "Discover", statement: "Understand what is happening.", items: [
    { label: "Assessment", to: "/assessment", description: "Find where value is being lost." },
    { label: "Demand", to: "/discover", description: "Turn intent and friction into useful signals." },
    { label: "Research", to: "/product-discovery", description: "Separate evidence, interpretation and unknowns." },
  ]},
  { label: "Build", statement: "Turn understanding into infrastructure.", items: [
    { label: "Business", to: "/business", description: "Move a customer interaction toward an outcome." },
    { label: "Commerce", to: "/commerce", description: "Build products and value around verified demand." },
    { label: "Intelligence", to: "/intelligence", description: "Structure context before the system acts." },
    { label: "Knowledge", to: "/knowledge", description: "Put approved information at the decision point." },
  ]},
  { label: "Operate", statement: "Make the system act.", items: [
    { label: "Edge", to: "/edge", description: "Intelligence with an authority boundary." },
    { label: "Workflows", to: "/workflows", description: "Move qualified work through explicit processes." },
    { label: "Policies", to: "/policies", description: "Define what the business permits." },
    { label: "Routing", to: "/workflow-routing", description: "Give every next action an owner." },
    { label: "Human Review", to: "/escalations", description: "Stop where judgment or authority is required." },
  ]},
  { label: "Scale", statement: "Learn from outcomes.", items: [
    { label: "Outcomes", to: "/operations", description: "Connect action to the intended result." },
    { label: "Analytics", to: "/operations", description: "Make operating evidence visible and reviewable." },
    { label: "Learning", to: "/scale", description: "Improve the next cycle from credible results." },
  ]},
];
const footerColumns = [
  ...groups.map(({ label, items }) => ({ label, items })),
  { label: "Company", items: [{ label: "About", to: "/about", description: "" }, { label: "Contact", to: "/contact", description: "" }] },
  { label: "Quincestone", items: [{ label: "Shop", to: SHOP, description: "" }, { label: "Account", to: ACCOUNT, description: "" }, { label: "Business App", to: APP_SIGN_IN, description: "" }] },
];

function Chevron(){return <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.5 6 8l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>}
function Logo({compact=false}:{compact?:boolean}){return <img className={compact?"brand-logo compact":"brand-logo"} src="/quincestone-logo.svg" alt="Quincestone"/>}
function Destination({item,onClick,children}:{item:Pick<Item,"to">;onClick?:()=>void;children:ReactNode}) {
  return item.to.startsWith("http") ? <a href={item.to} onClick={onClick}>{children}</a> : <NavLink to={item.to} onClick={onClick}>{children}</NavLink>;
}

function ShopHeader({closeAll,mobileOpen,setMobileOpen}:{closeAll:()=>void;mobileOpen:boolean;setMobileOpen:(value:boolean)=>void}){
  return <header className="shop-header">
    <Link className="shop-brand" to="/shop" aria-label="Quincestone Shop home" onClick={closeAll}><Logo/><span>SHOP</span></Link>
    <nav aria-label="Shop navigation" className="shop-nav"><NavLink to="/shop">Discover</NavLink><NavLink to="/products">Shop</NavLink><NavLink to="/standard">The Standard</NavLink></nav>
    <div className="shop-actions"><NavLink to="/search" className="shop-icon-link">Search</NavLink><NavLink to="/account" className="shop-account-link">Account</NavLink><NavLink to="/account/saved" className="shop-icon-link">Saved</NavLink><NavLink className="shop-cart" to="/bag">Bag</NavLink><button className="shop-mobile-toggle" type="button" aria-label={mobileOpen?"Close Shop menu":"Open Shop menu"} aria-expanded={mobileOpen} onClick={()=>setMobileOpen(!mobileOpen)}><span/><span/></button></div>
    {mobileOpen && <div className="shop-mobile-panel"><div><span>DISCOVER</span><NavLink to="/shop" onClick={closeAll}>Featured</NavLink><NavLink to="/shop/new" onClick={closeAll}>New</NavLink><NavLink to="/shop/collections" onClick={closeAll}>Collections</NavLink><NavLink to="/field-notes" onClick={closeAll}>Field Notes</NavLink></div><div><span>SHOP</span><NavLink to="/travel" onClick={closeAll}>Travel</NavLink><NavLink to="/drive" onClick={closeAll}>Drive</NavLink><NavLink to="/companion" onClick={closeAll}>Companion</NavLink><NavLink to="/home-outdoor" onClick={closeAll}>Home + Outdoor</NavLink><NavLink to="/products" onClick={closeAll}>All Products</NavLink></div><div><span>ACCOUNT</span><NavLink to="/account" onClick={closeAll}>Overview</NavLink><NavLink to="/account/orders" onClick={closeAll}>Orders</NavLink><NavLink to="/account/saved" onClick={closeAll}>Saved</NavLink><NavLink to="/account/addresses" onClick={closeAll}>Addresses</NavLink><NavLink to="/account/profile" onClick={closeAll}>Profile</NavLink></div><div><span>THE STANDARD</span><NavLink to="/standard" onClick={closeAll}>How We Choose</NavLink><NavLink to="/standard#demand" onClick={closeAll}>Demand</NavLink><NavLink to="/standard#quality" onClick={closeAll}>Quality</NavLink><NavLink to="/standard#utility" onClick={closeAll}>Utility</NavLink><NavLink to="/standard#economics" onClick={closeAll}>Economics</NavLink><NavLink to="/standard#reliability" onClick={closeAll}>Reliability</NavLink></div><div><span>HELP</span><NavLink to="/shipping" onClick={closeAll}>Shipping</NavLink><NavLink to="/returns" onClick={closeAll}>Returns</NavLink><NavLink to="/support" onClick={closeAll}>Support</NavLink><NavLink to="/contact" onClick={closeAll}>Contact</NavLink></div></div>}
  </header>;
}

function ShopShell({closeAll,mobileOpen,setMobileOpen}:{closeAll:()=>void;mobileOpen:boolean;setMobileOpen:(value:boolean)=>void}) {
  return <div className="site-shell shop-shell"><a className="skip-link" href="#content">Skip to content</a><ShopHeader closeAll={closeAll} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/><main id="content"><Outlet/></main><footer className="shop-footer"><div><Link to="/shop"><Logo compact/></Link><p>Better things for how you move, live and explore.</p></div><div className="shop-footer-group"><span>DISCOVER</span><Link to="/shop">Featured</Link><Link to="/shop/new">New</Link><Link to="/shop/collections">Collections</Link><Link to="/field-notes">Field Notes</Link></div><div className="shop-footer-group"><span>SHOP</span><Link to="/travel">Travel</Link><Link to="/drive">Drive</Link><Link to="/companion">Companion</Link><Link to="/home-outdoor">Home + Outdoor</Link><Link to="/products">All Products</Link></div><div className="shop-footer-group"><span>ACCOUNT</span><Link to="/account">Overview</Link><Link to="/account/orders">Orders</Link><Link to="/account/saved">Saved</Link><Link to="/account/addresses">Addresses</Link><Link to="/account/profile">Profile</Link></div><div className="shop-footer-group"><span>THE STANDARD</span><Link to="/standard">How We Choose</Link><Link to="/standard">Demand</Link><Link to="/standard">Quality</Link><Link to="/standard">Utility</Link><Link to="/standard">Economics</Link><Link to="/standard">Reliability</Link></div><div className="shop-footer-group"><span>HELP</span><Link to="/shipping">Shipping</Link><Link to="/returns">Returns</Link><Link to="/support">Support</Link><Link to="/contact">Contact</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div><div className="shop-footer-bottom"><span>© Quincestone</span><Link to="/">One Quincestone →</Link></div></footer></div>;
}

export function Layout(){
  const[openGroup,setOpenGroup]=useState<string|null>(null);const[mobileOpen,setMobileOpen]=useState(false);const[mobileGroup,setMobileGroup]=useState<string|null>(null);const[scrolled,setScrolled]=useState(false);const lastTrigger=useRef<{focus:()=>void}|null>(null);
  useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>12);const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape"){setOpenGroup(null);setMobileOpen(false);setMobileGroup(null);lastTrigger.current?.focus()}};window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("keydown",onKey);return()=>{window.removeEventListener("scroll",onScroll);window.removeEventListener("keydown",onKey)}},[]);
  useEffect(()=>{document.body.style.overflow=mobileOpen?"hidden":"";return()=>{document.body.style.overflow=""}},[mobileOpen]);
  const closeAll=()=>{setOpenGroup(null);setMobileOpen(false);setMobileGroup(null)};const isShop=typeof window!=="undefined"&&window.location.hostname.toLowerCase()==="shop.quincestone.com";
  if(isShop)return <ShopShell closeAll={closeAll} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>;
  return <div className="site-shell"><a className="skip-link" href="#content">Skip to content</a><header className={scrolled?"marketing-header scrolled":"marketing-header"}><Link className="brand" to="/" aria-label="Quincestone home" onClick={closeAll}><Logo/></Link><nav className="marketing-nav" aria-label="Primary navigation">{groups.map(group=><div className="nav-group" key={group.label} data-open={openGroup===group.label}><button className="nav-trigger" aria-expanded={openGroup===group.label} aria-controls={`nav-${group.label.toLowerCase()}`} onClick={(event)=>{lastTrigger.current=event.currentTarget;setOpenGroup(openGroup===group.label?null:group.label)}}>{group.label}<Chevron/></button><div id={`nav-${group.label.toLowerCase()}`} className="nav-popover" onMouseLeave={()=>setOpenGroup(null)}><p><strong>{group.label}</strong><span>{group.statement}</span></p>{group.items.map(item=><Destination item={item} key={item.label} onClick={closeAll}><strong>{item.label}</strong><small>{item.description}</small></Destination>)}</div></div>)}<NavLink to="/about" onClick={closeAll}>About</NavLink><NavLink to="/contact" onClick={closeAll}>Contact</NavLink></nav><div className="marketing-actions"><a className="text-link sign-in-link" href={APP_SIGN_IN}>Sign in</a><a className="button small" href={APP_SIGN_UP}>Get started</a></div><button className="marketing-menu" aria-label={mobileOpen?"Close menu":"Open menu"} aria-expanded={mobileOpen} aria-controls="mobile-panel" onClick={()=>setMobileOpen(v=>!v)}><span/></button><div id="mobile-panel" className="mobile-panel" data-open={mobileOpen}><div className="mobile-panel-head"><span>QUINCESTONE</span><strong>Navigate the operating model.</strong><p>Understand demand. Build the system. Operate the work. Learn from outcomes.</p></div>{groups.map(group=><div className="mobile-section" key={group.label}><button aria-expanded={mobileGroup===group.label} aria-controls={`mobile-${group.label.toLowerCase()}`} onClick={()=>setMobileGroup(mobileGroup===group.label?null:group.label)}><span>{group.label}</span><Chevron/></button><div id={`mobile-${group.label.toLowerCase()}`} className="mobile-sub" data-open={mobileGroup===group.label}>{group.items.map(item=><Destination item={item} key={item.label} onClick={closeAll}>{item.label}</Destination>)}</div></div>)}<NavLink to="/about" onClick={closeAll}>About</NavLink><NavLink to="/contact" onClick={closeAll}>Contact</NavLink><a className="text-link mobile-sign-in" href={APP_SIGN_IN} onClick={closeAll}>Sign in</a><a className="button mobile-cta" href={APP_SIGN_UP} onClick={closeAll}>Get started</a></div></header><main id="content"><Outlet/></main><footer className="footer-new"><div className="footer-grid"><div className="footer-brand"><Link className="brand" to="/" onClick={closeAll}><Logo compact/></Link><div><p>Turn demand into outcomes.</p><p className="footer-company">Understand demand. Operate what happens next. Scale what works.</p></div></div>{footerColumns.map(column=><div key={column.label}><h3>{column.label}</h3>{column.items.map(item=><Destination key={item.label} item={item}>{item.label}</Destination>)}</div>)}</div><div className="footer-bottom"><span>© Quincestone · Built by Quinceweb</span><span><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/cookies">Cookies</Link><Link to="/security">Security</Link></span></div></footer></div>;
}
