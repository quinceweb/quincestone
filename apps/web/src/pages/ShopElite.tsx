import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../shop-elite-experience.css";
import "../shop-navigation.css";

type Json = Record<string, unknown>;
type CatalogRow = {
  id: string; slug: string; name: string; description: string | null; collection: string;
  content_eyebrow: string | null; content_headline: string | null; content_subheadline: string | null;
  content_short_description: string | null; content_story: string | null;
  benefit_blocks: Json[] | null; feature_blocks: Json[] | null; specs: Json[] | null; included_items: Json[] | null;
  usage_steps: Json[] | null; faq: Json[] | null; content_shipping: Json | null; content_returns_policy: Json | null;
  variant_id: string; sku: string; option_values: Record<string, string>; price_amount: number | null; currency: string;
  media_id: string | null; asset_url: string | null; media_type: string | null; alt_text: string | null; sort_order: number | null;
};
type Product = Omit<CatalogRow, "variant_id" | "sku" | "option_values" | "price_amount" | "currency" | "media_id" | "asset_url" | "media_type" | "alt_text" | "sort_order"> & { variants: CatalogRow[]; media: CatalogRow[] };

export const productWorlds = [
  { family: "WORK", slug: "developer-tools", name: "Developer Tools", positioning: "Better tools for focused technical work." },
  { family: "WORK", slug: "business-office", name: "Business + Office", positioning: "Better infrastructure for getting work done." },
  { family: "WORK", slug: "students-study", name: "Students + Study", positioning: "Better tools for focused learning." },
  { family: "WORK", slug: "creator-studio", name: "Creator + Studio", positioning: "Build a better creation environment." },
  { family: "LIVE", slug: "home-accessories", name: "Home + Accessories", positioning: "Useful things that earn their space." },
  { family: "LIVE", slug: "gadgets", name: "Gadgets", positioning: "Technology worth carrying." },
  { family: "LIVE", slug: "pets-companion", name: "Pets + Companion", positioning: "Better systems for the things you care for." },
  { family: "MOVE", slug: "travel", name: "Travel", positioning: "Move with less friction." },
  { family: "MOVE", slug: "drive-mobility", name: "Drive + Mobility", positioning: "Make time on the road easier." },
  { family: "MOVE", slug: "outdoor-everyday-carry", name: "Outdoor + Everyday Carry", positioning: "Useful gear for being away from home." },
] as const;
const situations = [
  ["My desk", "Developer + Office + Gadgets", "developer-tools"],
  ["My dorm", "Students + Home + Gadgets", "students-study"],
  ["My road trip", "Drive + Travel + Gadgets", "drive-mobility"],
  ["My content setup", "Creator + Developer + Gadgets", "creator-studio"],
  ["Traveling with my dog", "Travel + Companion + Drive", "pets-companion"],
  ["Working while traveling", "Developer + Travel + Office", "travel"],
] as const;
function useCatalog() {
  const [rows, setRows] = useState<CatalogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    void (async () => {
      if (!supabase) { setLoading(false); return; }
      const { data, error: queryError } = await supabase.from("commerce_catalog").select("*").order("slug").order("sort_order");
      if (!active) return;
      setError(Boolean(queryError));
      setRows((data || []) as CatalogRow[]);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);
  const products = useMemo(() => {
    const map = new Map<string, Product>();
    for (const row of rows) {
      let product = map.get(row.id);
      if (!product) {
        product = { id: row.id, slug: row.slug, name: row.name, description: row.description, collection: row.collection,
          content_eyebrow: row.content_eyebrow, content_headline: row.content_headline, content_subheadline: row.content_subheadline,
          content_short_description: row.content_short_description, content_story: row.content_story, benefit_blocks: row.benefit_blocks,
          feature_blocks: row.feature_blocks, specs: row.specs, included_items: row.included_items, usage_steps: row.usage_steps,
          faq: row.faq, content_shipping: row.content_shipping, content_returns_policy: row.content_returns_policy, variants: [], media: [] };
        map.set(row.id, product);
      }
      if (!product.variants.some((v) => v.variant_id === row.variant_id)) product.variants.push(row);
      if (row.media_id && !product.media.some((m) => m.media_id === row.media_id)) product.media.push(row);
    }
    return [...map.values()];
  }, [rows]);
  return { products, loading, error };
}

function money(amount: number, currency: string) { return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100); }
function value(v: unknown) { return typeof v === "string" ? v : ""; }
function blocks(v: Json[] | null) { return Array.isArray(v) ? v : []; }

function Media({ product, className = "" }: { product: Product; className?: string }) {
  const image = product.media[0];
  return <div className={`qs-elite-media ${className}`}>
    {image?.asset_url ? <img src={image.asset_url} alt={image.alt_text || product.name} loading="lazy" /> : <div className="qs-elite-media-pending" aria-label="Verified product media not available">MEDIA PENDING</div>}
  </div>;
}

function ProductCard({ product }: { product: Product }) {
  const variant = product.variants[0];
  return <Link className="qs-elite-card" to={`/product/${product.slug}`}>
    <Media product={product} />
    <div className="qs-elite-card-meta"><span>{product.collection.replace("-", " + ").toUpperCase()}</span><strong>{product.name}</strong><p>{product.content_short_description || product.description || "A considered product selected through the Quincestone Standard."}</p>{variant?.price_amount ? <b>{money(variant.price_amount, variant.currency)}</b> : null}</div>
  </Link>;
}

export function ShopEliteHome() {
  const { products, loading, error } = useCatalog();
  return <div className="qs-elite-page">
    <section className="qs-elite-hero"><div className="qs-elite-hero-copy"><p className="eyebrow">QUINCESTONE SHOP / PRODUCT HOUSE</p><h1>BETTER THINGS<br />FOR HOW YOU WORK,<br />MOVE, LIVE<br />AND CREATE.</h1><p>A deliberately considered collection of useful products selected for quality, utility, evidence and how they perform in the real world.</p><div className="qs-elite-actions"><Link className="button" to="/products">Explore the collection →</Link><Link className="text-link" to="/build-my-setup">Build my setup →</Link></div></div><div className="qs-elite-hero-system" aria-label="How Quincestone works"><span>SITUATION</span><i>01</i><span>INTELLIGENCE</span><i>02</i><span>CURATED SYSTEM</span><i>03</i><span>EVIDENCE</span><i>04</i><span>OUTCOME</span><i>05</i><p>Products do not enter the Shop because a supplier exists. They earn publication.</p></div></section>
    <section className="qs-elite-release"><div><p className="eyebrow">ONE THING WORTH KNOWING</p><h2>{products[0]?.name || "Products earn publication."}</h2><p>{products[0] ? (products[0].content_short_description || products[0].description || "Selected through the Quincestone Standard.") : "The Shop only exposes products that have earned publication through evidence, economics, fulfillment verification and human authorization."}</p>{products[0] && <Link className="text-link" to={`/product/${products[0].slug}`}>Explore →</Link>}</div><div className="qs-elite-release-visual"><Media product={products[0] || { media: [], variants: [], id: "", slug: "", name: "", description: null, collection: "", content_eyebrow: null, content_headline: null, content_subheadline: null, content_short_description: null, content_story: null, benefit_blocks: null, feature_blocks: null, specs: null, included_items: null, usage_steps: null, faq: null, content_shipping: null, content_returns_policy: null }} /></div></section>
    <section className="qs-situations"><div className="qs-elite-section-head"><div><p className="eyebrow">START WITH WHAT YOU'RE TRYING TO IMPROVE</p><h2>You bring the situation.<br />We structure the system.</h2></div><p>Begin with an outcome, not a department. Each pathway crosses product worlds to reduce the hard thinking between need and purchase.</p></div><div className="qs-situation-list">{situations.map(([title, mix, slug], index) => <Link key={title} to={`/world/${slug}`}><span>0{index + 1}</span><strong>{title}</strong><small>{mix}</small><b>→</b></Link>)}</div></section>
    <section className="qs-world-families"><div className="qs-elite-section-head"><div><p className="eyebrow">TEN PERMANENT PRODUCT WORLDS</p><h2>Work. Live. Move.</h2></div><p>Not endless departments. Ten tightly governed places for products that solve a recognizable problem.</p></div>{["WORK", "LIVE", "MOVE"].map((family) => <div className="qs-world-family" key={family}><h3>{family}</h3><div>{productWorlds.filter((world) => world.family === family).map((world) => <Link key={world.slug} to={`/world/${world.slug}`}><strong>{world.name}</strong><span>{world.positioning}</span><b>Explore →</b></Link>)}</div></div>)}</section>
    <section className="qs-setup-feature"><div><p className="eyebrow">BUILD MY SETUP</p><h2>One situation.<br />A complete useful system.</h2><p>Answer a few practical questions. We will organize compatible published products around what you are actually trying to do.</p><Link className="button" to="/build-my-setup">Build my setup →</Link></div><ol><li><span>01</span><strong>Describe the situation</strong><p>Trip, desk, dorm, road, studio or everyday carry.</p></li><li><span>02</span><strong>Set the constraints</strong><p>Purpose, duration and the way you work or move.</p></li><li><span>03</span><strong>See the system</strong><p>Only published products appear as purchasable recommendations.</p></li></ol></section>
    <section className="qs-elite-catalog"><div className="qs-elite-section-head"><div><p className="eyebrow">THE COLLECTION</p><h2>Selected, not filled.</h2></div><Link className="text-link" to="/products">View all →</Link></div>{error ? <Empty title="The catalog is unavailable." body="Quincestone does not substitute placeholder commerce data for a failed catalog connection." /> : loading ? <Empty title="Checking what has earned publication." body="The Shop is verifying the published catalog." /> : products.length ? <div className="qs-elite-grid">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div> : <Empty title="The next release is being prepared." body="No product is shown until the Commerce OS says it has earned publication." />}</section>
    <section className="qs-field-note-feature"><p className="eyebrow">FIELD NOTE / EDITORIAL QUEUE</p><div><h2>Why cheap USB-C hubs fail.</h2><p>Observation, testing and what changed our mind—once the source work is ready. Field Notes remain clearly marked until there is evidence to publish.</p><Link className="text-link" to="/field-notes">Read the editorial queue →</Link></div></section>
    <section className="qs-one-company"><p className="eyebrow">ONE QUINCESTONE</p><h2>Discovery here. Transactions through Store. Continuity through your Quincestone Account.</h2><p>The boundaries are deliberate. The experience stays unified.</p><a className="text-link" href="https://quincestone.com">Meet Quincestone →</a></section>
  </div>;
}

function Empty({ title, body }: { title: string; body: string }) { return <div className="qs-elite-empty"><p className="eyebrow">NOTHING TO INVENT</p><h3>{title}</h3><p>{body}</p></div>; }

export function ShopEliteCollection({ collection }: { collection?: string }) {
  const { products, loading, error } = useCatalog();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("curated");
  const filtered = useMemo(() => {
    const list = products.filter((p) => (!collection || collection === "products" || p.collection === collection) && `${p.name} ${p.description || ""}`.toLowerCase().includes(query.trim().toLowerCase()));
    if (sort === "price-low") return [...list].sort((a,b) => (a.variants[0]?.price_amount || 0) - (b.variants[0]?.price_amount || 0));
    if (sort === "price-high") return [...list].sort((a,b) => (b.variants[0]?.price_amount || 0) - (a.variants[0]?.price_amount || 0));
    return list;
  }, [collection, products, query, sort]);
  const world = productWorlds.find((item) => item.slug === collection);
  const title = world?.positioning || "The collection.";
  return <div className="qs-elite-page"><section className="qs-elite-collection-head"><p className="eyebrow">{world ? `${world.family} / ${world.name.toUpperCase()}` : "SHOP / ALL PRODUCTS"}</p><h1>{title}</h1><p>Every result below is drawn from the published Commerce OS catalog. Internal candidates never appear as products.</p></section><div className="qs-elite-tools"><label><span className="sr-only">Search products</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, use cases or features" /></label><select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products"><option value="curated">Curated</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select><span role="status">{loading ? "Checking…" : `${filtered.length} ${filtered.length === 1 ? "published product" : "published products"}`}</span></div>{error ? <Empty title="The catalog is unavailable." body="No placeholder results are shown." /> : filtered.length ? <div className="qs-elite-grid">{filtered.map((p) => <ProductCard key={p.id} product={p} />)}</div> : <Empty title={loading ? "Checking the published catalog." : world ? "No product has earned publication here yet." : "Nothing matched."} body={loading ? "Published products are verified before they appear here." : world ? "Selection is a feature. This world will remain empty until a candidate clears every launch gate." : "Try another term or product world."} />}</div>;
}

export function ShopEliteSearch() {
  const [query, setQuery] = useState("");
  const { products, loading } = useCatalog();
  const results = useMemo(() => products.filter((p) => `${p.name} ${p.collection} ${p.description || ""}`.toLowerCase().includes(query.trim().toLowerCase())), [products, query]);
  return <div className="qs-elite-page"><section className="qs-elite-search"><p className="eyebrow">DISCOVER / SEARCH</p><h1>Search by product—or situation.</h1><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try: portable work setup" aria-label="Search Quincestone Shop" />{query && <p role="status">{loading ? "Searching the published catalog…" : `${results.length} result${results.length === 1 ? "" : "s"}`}</p>}{query && <div className="qs-elite-grid">{results.map((p) => <ProductCard key={p.id} product={p} />)}</div>}{!query && <div className="qs-elite-suggestions">{["Traveling with a dog", "Portable work setup", "Desk cable organization", "Road emergency", "Developer travel kit"].map((term) => <button key={term} onClick={() => setQuery(term)}>{term} →</button>)}</div>}<p className="qs-search-disclosure">Search currently matches published catalog text. Situation-aware semantic search will only be introduced when its underlying intelligence is implemented and verified.</p></section></div>;
}

export function ShopEliteProduct() {
  const { slug } = useParams();
  const { products, loading } = useCatalog();
  const product = products.find((p) => p.slug === slug);
  const [active, setActive] = useState(0);
  if (loading) return <div className="qs-elite-page"><Empty title="Checking product publication." body="Only published products can be displayed." /></div>;
  if (!product) return <div className="qs-elite-page"><Empty title="This product is not published." body="Quincestone does not expose internal sourcing candidates as public products." /><Link className="button" to="/products">Return to the collection</Link></div>;
  const variant = product.variants[0];
  const image = product.media[active] || product.media[0];
  const benefits = blocks(product.benefit_blocks);
  const features = blocks(product.feature_blocks);
  const specs = blocks(product.specs);
  const included = blocks(product.included_items);
  const intelligence = [
    ["Utility", benefits.length ? "VERIFIED" : "MORE EVIDENCE NEEDED", "The published record includes a defined customer use."],
    ["Product detail", features.length || specs.length ? "VERIFIED" : "UNKNOWN", "Only structured attributes in the published record are shown."],
    ["Media", product.media.length ? "VERIFIED" : "UNKNOWN", "Product media must clear the public media boundary."],
    ["Fulfillment", "VERIFIED AT CHECKOUT", "Availability and order state are revalidated before payment."],
    ["Long-term durability", "UNKNOWN", "We do not claim durability beyond the current evidence window."],
  ];
  return <div className="qs-elite-page qs-elite-product"><div className="qs-elite-product-hero"><div className="qs-elite-gallery"><div className="qs-elite-gallery-stage">{image?.asset_url ? <img src={image.asset_url} alt={image.alt_text || product.name} /> : <div className="qs-elite-media-pending">VERIFIED MEDIA NOT AVAILABLE</div>}</div>{product.media.length > 1 && <div className="qs-elite-thumbs">{product.media.map((m, i) => <button key={m.media_id} type="button" aria-label={`View image ${i + 1}`} aria-pressed={active === i} onClick={() => setActive(i)}><img src={m.asset_url || ""} alt="" /></button>)}</div>}</div><aside className="qs-elite-purchase"><p className="eyebrow">{product.content_eyebrow || product.collection.toUpperCase()}</p><h1>{product.content_headline || product.name}</h1><p>{product.content_subheadline || product.content_short_description || product.description}</p>{variant?.price_amount ? <strong className="qs-elite-price">{money(variant.price_amount, variant.currency)}</strong> : <span>PRICE NOT AVAILABLE</span>}<div className="qs-elite-availability"><span>AVAILABILITY</span><strong>Revalidated before purchase</strong><small>Published status is not an inventory promise. Checkout verifies current order state server-side.</small></div>{variant?.variant_id && variant.price_amount ? <button className="button" type="button" onClick={() => { const raw = localStorage.getItem("qs-commerce-cart") || "[]"; let cart: { variantId: string; quantity: number }[] = []; try { cart = JSON.parse(raw); } catch { cart = []; } const found = cart.find((x) => x.variantId === variant.variant_id); const next = found ? cart.map((x) => x.variantId === variant.variant_id ? { ...x, quantity: x.quantity + 1 } : x) : [...cart, { variantId: variant.variant_id, quantity: 1 }]; localStorage.setItem("qs-commerce-cart", JSON.stringify(next)); window.dispatchEvent(new Event("qs-cart-change")); }}>Add to bag</button> : <p className="qs-purchase-blocked">Purchase is unavailable until a priced, published variant can be verified.</p>}<Link className="text-link" to="/bag">View bag →</Link></aside></div><section className="qs-elite-standard"><div><p className="eyebrow">WHY THIS EARNED PUBLICATION</p><h2>Known, estimated or unknown.</h2><p>Quincestone does not turn missing product information into marketing language.</p></div><div>{intelligence.map(([name, state, body]) => <details key={name}><summary><span>{name}</span><b data-state={state}>{state}</b></summary><p>{body}</p></details>)}</div></section><section className="qs-elite-two-col"><article><p className="eyebrow">WHY WE CARRY IT</p><h2>Evidence-backed strengths.</h2>{benefits.length ? <ul>{benefits.map((x,i)=><li key={i}>{value(x.title) || value(x.text) || value(x.description)}</li>)}</ul> : <p>The published record does not currently include additional benefit claims.</p>}</article><article><p className="eyebrow">WHAT WE VERIFIED</p><h2>Structured product detail.</h2>{features.length ? <ul>{features.map((x,i)=><li key={i}>{value(x.title)}{value(x.text) ? ` — ${value(x.text)}` : ""}</li>)}</ul> : <p>Additional verified detail will appear only when it is present in the published product record.</p>}</article></section><section className="qs-unknown"><p className="eyebrow">WHAT WE DON'T KNOW</p><h2>Unknown remains unknown.</h2><p>Long-term durability, performance outside documented use, and any attribute absent from the published record are not claimed.</p></section>{(specs.length || included.length) ? <section className="qs-elite-specs"><p className="eyebrow">PRODUCT INTELLIGENCE</p><div>{[...specs, ...included].map((x,i)=><div key={i}><span>{value(x.title) || value(x.name) || `Detail ${i + 1}`}</span><strong>{value(x.value) || value(x.text) || value(x.description)}</strong></div>)}</div></section> : null}<section className="qs-elite-product-note"><p className="eyebrow">USE CASE</p><p>{product.content_story || "Product context is presented from the published record. Unsupported claims are deliberately omitted."}</p><Link className="text-link" to="/build-my-setup">See where it fits in a setup →</Link></section></div>;
}

export function ShopEliteStandard() { const gates = [["Demand","A recognizable customer problem comes first."],["Utility","The product must make the situation meaningfully better."],["Quality","Samples, materials and specifications must support the claim."],["Evidence","Verified, estimated and unknown information stay distinct."],["Economics","Reliable all-in variable cost may not exceed 45% of selling price."],["Reliability","Supplier and fulfillment readiness must be evidenced."],["Fulfillment","Availability and transaction state are verified at the right boundary."],["Publication","Only approved records cross into the public catalog."],["Human approval","A responsible person authorizes the final transition."]]; return <div className="qs-elite-page"><section className="qs-elite-collection-head"><p className="eyebrow">THE QUINCESTONE STANDARD</p><h1>Products earn publication.</h1><p>A supplier listing is not a product decision. Every candidate moves through a controlled sequence, and missing economics data blocks publication.</p></section><section className="qs-publication-flow" aria-label="Publication states">{["Considering","Shortlisted","Qualification","Approved","Published"].map((state, index) => <div key={state}><span>0{index + 1}</span><strong>{state}</strong>{index < 4 && <b>→</b>}</div>)}</section><section className="qs-margin-standard"><div><p className="eyebrow">THE 55% MARGIN GATE</p><h2>Discipline before scale.</h2></div><div><strong>SELLING PRICE</strong><span>minus all-in variable cost of no more than 45%</span><b>= contribution of at least 55%</b><p>Sourcing, inbound freight, packaging, fulfillment allocation, payment processing, expected returns or damage, and other variable transaction costs are included. Unknown cost inputs stop publication.</p></div></section><section className="qs-elite-standard-page">{gates.map(([title, body], i) => <article id={title.toLowerCase().replace(" ", "-")} key={title}><span>{String(i + 1).padStart(2,"0")}</span><h2>{title}</h2><p>{body}</p></article>)}</section></div>; }

export function ShopEliteFieldNotes() { return <div className="qs-elite-page"><section className="qs-elite-collection-head"><p className="eyebrow">FIELD NOTES</p><h1>Product intelligence, not content filler.</h1><p>Observation, testing and changes in judgment belong here. No note is presented as research until the underlying work exists.</p></section><section className="qs-elite-notes">{["Why cheap USB-C hubs fail", "What makes a desk setup actually better", "Why portable monitors become clutter", "What we learned about travel power", "What makes a useful pet travel system", "How we evaluate everyday carry"].map((title, i) => <article key={title}><span>EDITORIAL QUEUE / {String(i + 1).padStart(2, "0")}</span><h2>{title}</h2><div className="qs-note-structure"><span>OBSERVATION</span><span>WHAT WE TESTED</span><span>WHAT CHANGED</span></div><p>Draft subject — evidence and source material required before publication.</p></article>)}</section></div>; }

export function ShopBuildSetup() {
  const [situation, setSituation] = useState("travel");
  const [constraint, setConstraint] = useState("7 days");
  const [purpose, setPurpose] = useState("Work");
  const labels: Record<string, string[]> = { travel: ["Core organization", "Reliable charging", "Fast access to essentials"], desk: ["Focused input", "Clean connectivity", "Useful power"], road: ["Road readiness", "Vehicle power", "Accessible organization"], creator: ["Clear capture", "Controlled lighting", "Stable mounting"] };
  return <div className="qs-elite-page qs-setup-page"><section className="qs-elite-collection-head"><p className="eyebrow">BUILD MY SETUP / ILLUSTRATIVE</p><h1>Build around the situation.</h1><p>This first release demonstrates the recommendation structure. It does not invent products, prices or compatibility. Purchasable recommendations will appear only from the published catalog.</p></section><section className="qs-setup-builder"><form><fieldset><legend>What are you building?</legend>{[["travel","Travel setup"],["desk","Desk setup"],["road","Road trip setup"],["creator","Creator setup"]].map(([value,label]) => <label key={value}><input type="radio" name="situation" value={value} checked={situation === value} onChange={() => setSituation(value)} /><span>{label}</span></label>)}</fieldset><label><span>Primary constraint</span><select value={constraint} onChange={(event) => setConstraint(event.target.value)}><option>3 days</option><option>7 days</option><option>14 days</option><option>Small footprint</option></select></label><label><span>Purpose</span><select value={purpose} onChange={(event) => setPurpose(event.target.value)}><option>Work</option><option>Leisure</option><option>Mixed</option></select></label></form><div className="qs-setup-output"><p className="eyebrow">ILLUSTRATIVE PRODUCT SYSTEM</p><h2>{constraint} · {purpose.toLowerCase()} · {situation}</h2><p>The system architecture is ready. Specific products and totals remain unavailable until compatible published catalog records can be verified.</p><ol>{labels[situation].map((label, index) => <li key={label}><span>0{index + 1}</span><div><strong>{label}</strong><small>Published product match pending</small></div><b>UNKNOWN</b></li>)}</ol><Link className="text-link" to="/products">Browse the published collection →</Link></div></section></div>;
}

export function ShopEliteCompare() { const { products } = useCatalog(); const [selected, setSelected] = useState<string[]>([]); const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((x) => x !== id) : current.length < 4 ? [...current, id] : current); const compared = products.filter((p) => selected.includes(p.id)); return <div className="qs-elite-page"><section className="qs-elite-collection-head"><p className="eyebrow">DISCOVER / COMPARE</p><h1>Compare what actually differs.</h1><p>Select up to four published products. Missing attributes remain unavailable rather than being guessed.</p></section><div className="qs-elite-compare-picker">{products.map((p) => <label key={p.id}><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} />{p.name}</label>)}</div>{compared.length > 0 && <div className="qs-elite-compare-table"><table><thead><tr><th>ATTRIBUTE</th>{compared.map((p) => <th key={p.id}>{p.name}</th>)}</tr></thead><tbody>{["Purpose", "Collection", "Price", "Materials", "Dimensions", "Weight", "Compatibility", "Warranty"].map((label) => <tr key={label}><th>{label}</th>{compared.map((p) => <td key={p.id}>{label === "Collection" ? p.collection : label === "Price" ? (p.variants[0]?.price_amount ? money(p.variants[0].price_amount, p.variants[0].currency) : "Not available") : "Not provided in the published record"}</td>)}</tr>)}</tbody></table></div>}</div>; }
