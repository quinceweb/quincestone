import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import "../marketing.css";
import "../p2-interaction.css";
import "../web-reconciliation.css";
import "../shop-account.css";
import "../footer-mobile-architecture.css";
import "../footer-commerce-premium.css";

type Item = { label: string; to: string; description: string };
type Group = { label: string; items: Item[] };
const APP_SIGN_UP = "https://app.quincestone.com/sign-up";
const groups: Group[] = [
  { label: "Discover", items: [["What Quincestone is", "/discover", "Understand demand, interaction, assessment and research."], ["Assessment", "/assessment", "Find where value is being lost and define the next move."], ["Demand", "/discover", "See how useful intent becomes an operating signal."], ["Research", "/product-discovery", "Separate evidence, interpretation and unknowns."]].map(([label,to,description])=>({label,to,description})) },
  { label: "Build", items: [["Build the system", "/build", "Turn understanding into practical infrastructure."], ["Business", "/business", "Create a public front door that moves work forward."], ["Commerce", "/commerce", "Build products and value around verified demand."], ["Intelligence + knowledge", "/knowledge", "Give decisions approved context and clear boundaries."]].map(([label,to,description])=>({label,to,description})) },
  { label: "Operate", items: [["Operate the model", "/operate", "Make the system act with control and visibility."], ["Edge", "/edge", "Governed intelligence between interaction and operations."], ["Workflows + routing", "/workflows", "Move qualified work through explicit processes."], ["Policies + human review", "/escalations", "Keep consequential judgment explicit."]].map(([label,to,description])=>({label,to,description})) },
  { label: "Scale", items: [["Scale what works", "/scale", "Learn from credible outcomes and improve the next cycle."], ["Outcomes + analytics", "/operations", "Connect activity to the result it was meant to change."], ["Commerce", "https://shop.quincestone.com", "Explore the Quincestone product house."], ["About", "/about", "Why Quincestone exists and what it refuses to fake."]].map(([label,to,description])=>({label,to,description})) },
];
function Chevron(){return <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.5 6 8l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>}
function Logo({compact=false}:{compact?:boolean}){return <img className={compact?"brand-logo compact":"brand-logo"} src="/quincestone-logo.svg" alt="Quincestone"/>}
function FooterLink({item}:{item:Item}){
  const content = <><span>{item.label}</span><span aria-hidden="true">↗</span></>;
  return item.to.startsWith("http")
    ? <a href={item.to}>{content}</a>
    : <Link to={item.to}>{content}</Link>;
}
function InstitutionalFooter(){
  return <footer className="footer-new" aria-labelledby="footer-heading">
    <div className="footer-shell">
      <section className="footer-lead">
        <div className="footer-lead-copy">
          <Link className="footer-logo" to="/" aria-label="Quincestone home"><Logo compact/></Link>
          <p className="footer-kicker">Commerce + operating systems</p>
          <h2 id="footer-heading">Turn demand <span>into outcomes.</span></h2>
          <p className="footer-summary">One governed system for discovering demand, building what matters, operating with control, and scaling what works.</p>
        </div>
        <div className="footer-actions" aria-label="Get started">
          <Link className="footer-primary-action" to="/assessment"><span>Start with an assessment</span><span aria-hidden="true">↗</span></Link>
          <a className="footer-secondary-action" href={APP_SIGN_UP}>Build your system</a>
        </div>
      </section>

      <nav className="footer-navigation" aria-label="Footer navigation">
        {groups.map((group,index)=><section className="footer-nav-group" key={group.label} aria-labelledby={`footer-group-${index}`}>
          <p className="footer-index" aria-hidden="true">0{index+1}</p>
          <h3 id={`footer-group-${index}`}>{group.label}</h3>
          <div>{group.items.map(item=><FooterLink key={`${item.label}-${item.to}`} item={item}/>)}</div>
        </section>)}
      </nav>

      <div className="footer-utility">
        <nav aria-label="Company"><h3>Company</h3><div><Link to="/about">About</Link><Link to="/contact">Contact</Link><a href="mailto:hello@quincestone.com">hello@quincestone.com</a></div></nav>
        <nav aria-label="Account"><h3>Account</h3><div><a href="https://app.quincestone.com/sign-in">Sign in</a><a href={APP_SIGN_UP}>Get started</a></div></nav>
        <nav aria-label="Legal"><h3>Legal</h3><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/cookies">Cookies</Link><Link to="/security">Security</Link></div></nav>
      </div>

      <div className="footer-bottom"><span>© {new Date().getFullYear()} Quincestone</span><span>Built by Quinceweb</span><Link to="/">One company. One operating model.</Link></div>
    </div>
  </footer>;
}
function ShopHeader({closeAll,mobileOpen,setMobileOpen}:{closeAll:()=>void;mobileOpen:boolean;setMobileOpen:(value:boolean)=>void}){
  return <header className="shop-header">
    <Link className="shop-brand" to="/shop" aria-label="Quincestone Shop home" onClick={closeAll}><Logo/><span>SHOP</span></Link>
    <nav aria-label="Shop navigation" className="shop-nav"><NavLink to="/shop">Discover</NavLink><NavLink to="/products">Shop</NavLink><NavLink to="/standard">The Standard</NavLink></nav>
    <div className="shop-actions"><NavLink to="/search" className="shop-icon-link">Search</NavLink><NavLink to="/account" className="shop-account-link">Account</NavLink><NavLink to="/account/saved" className="shop-icon-link">Saved</NavLink><NavLink className="shop-cart" to="/bag" aria-label="Open bag">Bag</NavLink><button className="shop-mobile-toggle" type="button" aria-label={mobileOpen?"Close Shop menu":"Open Shop menu"} aria-expanded={mobileOpen} onClick={()=>setMobileOpen(!mobileOpen)}><span/><span/></button></div>
    {mobileOpen && <div className="shop-mobile-panel"><div><span>DISCOVER</span><NavLink to="/shop" onClick={closeAll}>Featured</NavLink><NavLink to="/shop/new" onClick={closeAll}>New</NavLink><NavLink to="/shop/collections" onClick={closeAll}>Collections</NavLink><NavLink to="/field-notes" onClick={closeAll}>Field Notes</NavLink></div><div><span>SHOP</span><NavLink to="/travel" onClick={closeAll}>Travel</NavLink><NavLink to="/drive" onClick={closeAll}>Drive</NavLink><NavLink to="/companion" onClick={closeAll}>Companion</NavLink><NavLink to="/home-outdoor" onClick={closeAll}>Home + Outdoor</NavLink><NavLink to="/products" onClick={closeAll}>All Products</NavLink></div><div><span>ACCOUNT</span><NavLink to="/account" onClick={closeAll}>Overview</NavLink><NavLink to="/account/orders" onClick={closeAll}>Orders</NavLink><NavLink to="/account/saved" onClick={closeAll}>Saved</NavLink><NavLink to="/account/addresses" onClick={closeAll}>Addresses</NavLink><NavLink to="/account/profile" onClick={closeAll}>Profile</NavLink></div><div><span>THE STANDARD</span><NavLink to="/standard" onClick={closeAll}>How We Choose</NavLink><NavLink to="/standard#demand" onClick={closeAll}>Demand</NavLink><NavLink to="/standard#quality" onClick={closeAll}>Quality</NavLink><NavLink to="/standard#utility" onClick={closeAll}>Utility</NavLink><NavLink to="/standard#economics" onClick={closeAll}>Economics</NavLink><NavLink to="/standard#reliability" onClick={closeAll}>Reliability</NavLink></div><div><span>HELP</span><NavLink to="/shipping" onClick={closeAll}>Shipping</NavLink><NavLink to="/returns" onClick={closeAll}>Returns</NavLink><NavLink to="/support" onClick={closeAll}>Support</NavLink><NavLink to="/contact" onClick={closeAll}>Contact</NavLink></div></div>}
  </header>
}
export function Layout(){const[openGroup,setOpenGroup]=useState<string|null>(null);const[mobileOpen,setMobileOpen]=useState(false);const[mobileGroup,setMobileGroup]=useState<string|null>(null);const[scrolled,setScrolled]=useState(false);useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>12);const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape"){setOpenGroup(null);setMobileOpen(false);setMobileGroup(null)}};window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("keydown",onKey);return()=>{window.removeEventListener("scroll",onScroll);window.removeEventListener("keydown",onKey)}},[]);useEffect(()=>{document.body.style.overflow=mobileOpen?"hidden":"";return()=>{document.body.style.overflow=""}},[mobileOpen]);const closeAll=()=>{setOpenGroup(null);setMobileOpen(false);setMobileGroup(null)};const isShop=typeof window!=="undefined"&&window.location.hostname.toLowerCase()==="shop.quincestone.com";
if(isShop)return <div className="site-shell shop-shell"><a className="skip-link" href="#content">Skip to content</a><ShopHeader closeAll={closeAll} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/><main id="content"><Outlet/></main><footer className="shop-footer"><div><Link to="/shop"><Logo compact/></Link><p>Better things for how you move, live and explore.</p></div><div className="shop-footer-group"><span>DISCOVER</span><Link to="/shop">Featured</Link><Link to="/shop/new">New</Link><Link to="/shop/collections">Collections</Link><Link to="/field-notes">Field Notes</Link></div><div className="shop-footer-group"><span>SHOP</span><Link to="/travel">Travel</Link><Link to="/drive">Drive</Link><Link to="/companion">Companion</Link><Link to="/home-outdoor">Home + Outdoor</Link><Link to="/products">All Products</Link></div><div className="shop-footer-group"><span>ACCOUNT</span><Link to="/account">Overview</Link><Link to="/account/orders">Orders</Link><Link to="/account/saved">Saved</Link><Link to="/account/addresses">Addresses</Link><Link to="/account/profile">Profile</Link></div><div className="shop-footer-group"><span>THE STANDARD</span><Link to="/standard">How We Choose</Link><Link to="/standard">Demand</Link><Link to="/standard">Quality</Link><Link to="/standard">Utility</Link><Link to="/standard">Economics</Link><Link to="/standard">Reliability</Link></div><div className="shop-footer-group"><span>HELP</span><Link to="/shipping">Shipping</Link><Link to="/returns">Returns</Link><Link to="/support">Support</Link><Link to="/contact">Contact</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div><div className="shop-footer-bottom"><span>© Quincestone</span><Link to="/">One Quincestone →</Link></div></footer></div>;
return <div className="site-shell"><a className="skip-link" href="#content">Skip to content</a><header className={scrolled?"marketing-header scrolled":"marketing-header"}><Link className="brand" to="/" aria-label="Quincestone home" onClick={closeAll}><Logo/></Link><nav className="marketing-nav" aria-label="Primary navigation">{groups.map(group=><div className="nav-group" key={group.label} data-open={openGroup===group.label}><button className="nav-trigger" aria-expanded={openGroup===group.label} onClick={()=>setOpenGroup(openGroup===group.label?null:group.label)}>{group.label}<Chevron/></button><div className="nav-popover" role="menu" onMouseLeave={()=>setOpenGroup(null)}>{group.items.map(item=><NavLink key={item.label} to={item.to} role="menuitem" onClick={closeAll}><strong>{item.label}</strong><small>{item.description}</small></NavLink>)}</div></div>)}<NavLink to="/demo" onClick={closeAll}>Demo</NavLink></nav><div className="marketing-actions"><a className="text-link sign-in-link" href="https://app.quincestone.com/sign-in">Sign in</a><a className="button small" href={APP_SIGN_UP}>Get started</a></div><button className="marketing-menu" aria-label={mobileOpen?"Close menu":"Open menu"} aria-expanded={mobileOpen} aria-controls="mobile-panel" onClick={()=>setMobileOpen(v=>!v)}><span/></button><div id="mobile-panel" className="mobile-panel" data-open={mobileOpen}><div className="mobile-panel-head"><span>QUINCESTONE</span><strong>Choose your way in.</strong><p>Explore the system by journey, capability, operation, or outcome.</p></div>{groups.map(group=><div className="mobile-section" key={group.label}><button aria-expanded={mobileGroup===group.label} onClick={()=>setMobileGroup(mobileGroup===group.label?null:group.label)}><span>{group.label}</span><Chevron/></button><div className="mobile-sub" data-open={mobileGroup===group.label}>{group.items.map(item=><NavLink key={item.label} to={item.to} onClick={closeAll}>{item.label}</NavLink>)}</div></div>)}<NavLink to="/demo" onClick={closeAll}>Demo</NavLink><a className="text-link mobile-sign-in" href="https://app.quincestone.com/sign-in" onClick={closeAll}>Sign in</a><a className="button mobile-cta" href={APP_SIGN_UP} onClick={closeAll}>Get started</a></div></header><main id="content"><Outlet/></main><InstitutionalFooter/></div>}
