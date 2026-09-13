import { Link } from "react-router-dom";

const worlds = [
  ["TRAVEL", "Pack better.", "/shop/travel"],
  ["DRIVE", "Move better.", "/shop/drive"],
  ["COMPANION", "Keep useful things close.", "/shop/companion"],
  ["HOME + OUTDOOR", "Make your surroundings work better.", "/shop/home-outdoor"],
] as const;

export function ShopHomeEditorial() {
  return <div className="shop-commerce-page">
    <section className="shop-editorial-hero">
      <div>
        <p className="eyebrow">QUINCESTONE SHOP / RELEASE 001</p>
        <h1>Better things for how you move, live and explore.</h1>
        <p className="lede">A deliberately considered collection of useful products selected for quality, utility and the way they perform in the real world.</p>
        <div className="shop-hero-actions"><Link className="button" to="/shop/products">Explore the collection →</Link><Link className="text-link" to="/standard">How we choose →</Link></div>
      </div>
      <div className="shop-editorial-note"><span>THE RELEASE</span><strong>THE EVERYDAY CARRY</strong><p>A first collection built around movement, useful technology, travel and the objects that make everyday life work better.</p></div>
    </section>
    <section className="shop-knowledge">
      <div><p className="eyebrow">ONE THING WORTH KNOWING</p><h2>Products earn publication.</h2><p className="lede">We do not publish something because a supplier has it in stock. Demand, quality, utility, economics, reliability and experience have to stand up first.</p><Link className="shop-standard-link" to="/standard">Read the Quincestone Standard →</Link></div>
      <div className="shop-knowledge__media">FIELD MEDIA APPEARS WHEN VERIFIED</div>
    </section>
    <section className="shop-worlds"><p className="eyebrow">SHOP BY HOW YOU MOVE</p><h2>Four worlds. One standard.</h2><div className="shop-world-grid">{worlds.map(([title,subtitle,to])=><Link className="shop-world" to={to} key={title}><strong>{title}</strong><span>{subtitle}</span><span>Explore →</span></Link>)}</div></section>
  </div>;
}

export function ShopStandardPage() {
  const principles = [
    ["01", "DEMAND", "A real problem comes first."],
    ["02", "QUALITY", "Specifications and samples must stand up."],
    ["03", "UTILITY", "The product must genuinely help."],
    ["04", "ECONOMICS", "Price and landed economics are verified."],
    ["05", "RELIABILITY", "Fulfillment, returns, media rights and support matter."],
    ["06", "EXPERIENCE", "The transaction is not complete until the customer outcome is understood."],
  ];
  return <div className="shop-commerce-page"><section className="shop-editorial-hero"><div><p className="eyebrow">THE QUINCESTONE STANDARD</p><h1>Commerce should earn trust before asking for the transaction.</h1><p className="lede">The Standard is the operating discipline behind every product that earns a place in the Shop.</p></div><div className="shop-editorial-note"><span>PUBLICATION</span><strong>Evidence before exposure.</strong><p>Unknown information stays unknown. Unsupported claims stay out of the storefront.</p></div></section><section className="shop-standards"><div className="shop-standards-intro"><p className="eyebrow">SIX PRINCIPLES</p><h2>Everything in the Shop has to earn its place.</h2></div><div className="shop-standards-grid">{principles.map(([n,title,body])=><article key={n}><span>{n}</span><strong>{title}</strong><p>{body}</p></article>)}</div></section><section className="shop-knowledge"><div><p className="eyebrow">FROM QUESTION TO PRODUCT</p><h2>Research to outcome.</h2></div><div><p className="lede">Customer need → research → supplier discovery → sample → evaluation → verification → economic review → fulfillment review → human approval → published.</p><p className="lede">AI can propose. Policy can constrain. A human authorizes publication. The database records what happened.</p></div></section></div>;
}

export function ShopFieldNotesPage() {
  const notes = ["What actually belongs in a carry-on?", "Five things we stopped buying.", "How we evaluate outdoor gear.", "What makes a good everyday bag?", "Why we rejected 47 products before publishing one."];
  return <div className="shop-commerce-page"><section className="shop-editorial-hero"><div><p className="eyebrow">FIELD NOTES</p><h1>What we learn while choosing what belongs here.</h1><p className="lede">Editorial evidence, product evaluation and practical observations. Nothing is published as a research story until the underlying work exists.</p></div></section><section className="shop-knowledge"><div><p className="eyebrow">EDITORIAL QUEUE</p><h2>Notes will arrive with the work.</h2></div><div>{notes.map((note,index)=><article key={note} style={{borderTop:"1px solid rgba(11,17,16,.13)",padding:"1.2rem 0"}}><span style={{fontSize:".62rem",letterSpacing:".12em",color:"#68736c"}}>FIELD NOTE {String(index+1).padStart(2,"0")}</span><h3 style={{fontFamily:"var(--qs-font-display,Georgia,serif)",fontSize:"1.5rem",fontWeight:500,margin:".5rem 0"}}>{note}</h3><p style={{color:"#68736c"}}>Draft editorial slot — source material required before publication.</p></article>)}</div></section></div>;
}
