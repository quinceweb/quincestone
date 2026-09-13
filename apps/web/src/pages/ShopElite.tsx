import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

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

const worlds = [
  ["TRAVEL", "Things worth taking with you.", "/travel"],
  ["DRIVE", "Things that make movement better.", "/drive"],
  ["COMPANION", "Things designed to stay close.", "/companion"],
  ["HOME + OUTDOOR", "Things that earn their space.", "/home-outdoor"],
] as const;
const standards = [
  ["Demand", "A real customer problem comes first."],
  ["Quality", "Samples and specifications must stand up."],
  ["Utility", "The product must genuinely help."],
  ["Economics", "True variable cost must support the admission gate."],
  ["Reliability", "Fulfillment and support must be verifiable."],
  ["Experience", "The customer outcome remains part of the product."],
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
    <section className="qs-elite-hero"><div className="qs-elite-hero-copy"><p className="eyebrow">QUINCestone SHOP</p><h1>BETTER THINGS<br />FOR HOW YOU MOVE,<br />LIVE AND EXPLORE.</h1><p>A deliberately considered collection of useful products selected for quality, utility and the way they perform in the real world.</p><div className="qs-elite-actions"><Link className="button" to="/products">Explore the collection →</Link><Link className="text-link" to="/standard">How we choose →</Link></div></div><div className="qs-elite-hero-art" aria-hidden="true"><div className="qs-elite-orbit"/><span>CONSIDERED / VERIFIED / USEFUL</span></div></section>
    <section className="qs-elite-release"><div><p className="eyebrow">ONE THING WORTH KNOWING</p><h2>{products[0]?.name || "Products earn publication."}</h2><p>{products[0] ? (products[0].content_short_description || products[0].description || "Selected through the Quincestone Standard.") : "The Shop only exposes products that have earned publication through evidence, economics, fulfillment verification and human authorization."}</p>{products[0] && <Link className="text-link" to={`/product/${products[0].slug}`}>Explore →</Link>}</div><div className="qs-elite-release-visual"><Media product={products[0] || { media: [], variants: [], id: "", slug: "", name: "", description: null, collection: "", content_eyebrow: null, content_headline: null, content_subheadline: null, content_short_description: null, content_story: null, benefit_blocks: null, feature_blocks: null, specs: null, included_items: null, usage_steps: null, faq: null, content_shipping: null, content_returns_policy: null }} /></div></section>
    <section className="qs-elite-worlds"><p className="eyebrow">SHOP BY HOW YOU MOVE</p><h2>Four worlds. One standard.</h2><div>{worlds.map(([title, copy, to]) => <Link key={title} to={to}><strong>{title}</strong><span>{copy}</span><small>Explore →</small></Link>)}</div></section>
    <section className="qs-elite-catalog"><div className="qs-elite-section-head"><div><p className="eyebrow">THE COLLECTION</p><h2>Selected, not filled.</h2></div><Link className="text-link" to="/products">View all →</Link></div>{error ? <Empty title="The catalog is unavailable." body="Quincestone does not substitute placeholder commerce data for a failed catalog connection." /> : loading ? <Empty title="Checking what has earned publication." body="The Shop is verifying the published catalog." /> : products.length ? <div className="qs-elite-grid">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div> : <Empty title="The next release is being prepared." body="No product is shown until the Commerce OS says it has earned publication." />}</section>
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
  const title = collection === "travel" ? "Things worth taking with you." : collection === "drive" ? "Things that make movement better." : collection === "companion" ? "Things designed to stay close." : collection === "home-outdoor" ? "Things that earn their space." : "The collection.";
  return <div className="qs-elite-page"><section className="qs-elite-collection-head"><p className="eyebrow">SHOP / {collection === "products" || !collection ? "ALL PRODUCTS" : collection.toUpperCase()}</p><h1>{title}</h1><p>Every result below is drawn from the published Commerce OS catalog. No internal candidates are exposed.</p></section><div className="qs-elite-tools"><label><span className="sr-only">Search products</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the collection" /></label><select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products"><option value="curated">Curated</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select><span role="status">{loading ? "Checking…" : `${filtered.length} ${filtered.length === 1 ? "product" : "products"}`}</span></div>{error ? <Empty title="The catalog is unavailable." body="No placeholder results are shown." /> : filtered.length ? <div className="qs-elite-grid">{filtered.map((p) => <ProductCard key={p.id} product={p} />)}</div> : <Empty title={loading ? "Checking the published catalog." : "Nothing matched."} body={loading ? "Published products are verified before they appear here." : "Try another term or collection."} />}</div>;
}

export function ShopEliteSearch() {
  const [query, setQuery] = useState("");
  const { products, loading } = useCatalog();
  const results = useMemo(() => products.filter((p) => `${p.name} ${p.collection} ${p.description || ""}`.toLowerCase().includes(query.trim().toLowerCase())), [products, query]);
  return <div className="qs-elite-page"><section className="qs-elite-search"><p className="eyebrow">DISCOVER / SEARCH</p><h1>Find something considered.</h1><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Travel, driving, organization…" aria-label="Search Quincestone Shop" />{query && <p role="status">{loading ? "Searching…" : `${results.length} result${results.length === 1 ? "" : "s"}`}</p>}{query && <div className="qs-elite-grid">{results.map((p) => <ProductCard key={p.id} product={p} />)}</div>}{!query && <div className="qs-elite-suggestions">{["Travel", "Everyday carry", "Outdoor", "Organization", "Driving", "Companion"].map((term) => <button key={term} onClick={() => setQuery(term)}>{term} →</button>)}</div>}</section></div>;
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
  return <div className="qs-elite-page qs-elite-product"><div className="qs-elite-product-hero"><div className="qs-elite-gallery"><div className="qs-elite-gallery-stage">{image?.asset_url ? <img src={image.asset_url} alt={image.alt_text || product.name} /> : <div className="qs-elite-media-pending">VERIFIED MEDIA NOT AVAILABLE</div>}</div>{product.media.length > 1 && <div className="qs-elite-thumbs">{product.media.map((m, i) => <button key={m.media_id} type="button" aria-label={`View image ${i + 1}`} aria-pressed={active === i} onClick={() => setActive(i)}><img src={m.asset_url || ""} alt="" /></button>)}</div>}</div><aside className="qs-elite-purchase"><p className="eyebrow">{product.content_eyebrow || product.collection.toUpperCase()}</p><h1>{product.content_headline || product.name}</h1><p>{product.content_subheadline || product.content_short_description || product.description}</p>{variant?.price_amount ? <strong className="qs-elite-price">{money(variant.price_amount, variant.currency)}</strong> : <span>PRICE NOT AVAILABLE</span>}<div className="qs-elite-availability"><span>AVAILABILITY</span><strong>Verified published inventory</strong><small>Checkout revalidates order state server-side.</small></div><button className="button" type="button" onClick={() => { const raw = localStorage.getItem("qs-commerce-cart") || "[]"; let cart: { variantId: string; quantity: number }[] = []; try { cart = JSON.parse(raw); } catch { cart = []; } const found = cart.find((x) => x.variantId === variant.variant_id); const next = found ? cart.map((x) => x.variantId === variant.variant_id ? { ...x, quantity: x.quantity + 1 } : x) : [...cart, { variantId: variant.variant_id, quantity: 1 }]; localStorage.setItem("qs-commerce-cart", JSON.stringify(next)); window.dispatchEvent(new Event("qs-cart-change")); }}>Add to bag</button><Link className="text-link" to="/bag">View bag →</Link></aside></div><section className="qs-elite-standard"><div><p className="eyebrow">THE QUINCestone STANDARD</p><h2>Why this product is here.</h2><p>Publication means the Commerce OS has satisfied the required evidence, economics, fulfillment, media and human-authorization gates.</p></div><div>{standards.map(([name, body]) => <details key={name}><summary><span>{name}</span><b>Verified</b></summary><p>{body} The underlying verification remains recorded in the Commerce OS.</p></details>)}</div></section><section className="qs-elite-two-col"><article><p className="eyebrow">WHAT WE LIKE</p><h2>Evidence-backed strengths.</h2>{benefits.length ? <ul>{benefits.map((x,i)=><li key={i}>{value(x.title) || value(x.text) || value(x.description)}</li>)}</ul> : <p>Published product content does not currently include additional strengths.</p>}</article><article><p className="eyebrow">WHAT WE VERIFIED</p><h2>Structured product detail.</h2>{features.length ? <ul>{features.map((x,i)=><li key={i}>{value(x.title)}{value(x.text) ? ` — ${value(x.text)}` : ""}</li>)}</ul> : <p>Additional verified product detail will appear when it is present in the published product record.</p>}</article></section>{(specs.length || included.length) ? <section className="qs-elite-specs"><p className="eyebrow">DETAILS</p><div>{[...specs, ...included].map((x,i)=><div key={i}><span>{value(x.title) || value(x.name) || `Detail ${i + 1}`}</span><strong>{value(x.value) || value(x.text) || value(x.description)}</strong></div>)}</div></section> : null}<section className="qs-elite-product-note"><p className="eyebrow">WHAT YOU SHOULD KNOW</p><p>{product.content_story || "Product context is presented from the published record. Unsupported claims are deliberately omitted."}</p></section></div>;
}

export function ShopEliteStandard() { return <div className="qs-elite-page"><section className="qs-elite-collection-head"><p className="eyebrow">THE STANDARD</p><h1>Commerce should earn trust before asking for the transaction.</h1><p>Products move from demand to research, sourcing, sample evaluation, true economics, reliability and fulfillment, then human approval before publication.</p></section><section className="qs-elite-standard-page">{standards.map(([title, body], i) => <article key={title}><span>0{i + 1}</span><h2>{title}</h2><p>{body}</p></article>)}</section></div>; }

export function ShopEliteFieldNotes() { return <div className="qs-elite-page"><section className="qs-elite-collection-head"><p className="eyebrow">FIELD NOTES</p><h1>What we learn while choosing what belongs here.</h1><p>No article is presented as research until the underlying work exists. Draft subjects remain clearly marked.</p></section><section className="qs-elite-notes">{["What actually belongs in a carry-on?", "Five things we stopped buying.", "How we evaluate outdoor gear.", "What makes a good everyday bag?", "Why we rejected products before publishing one."].map((title, i) => <article key={title}><span>EDITORIAL QUEUE / {String(i + 1).padStart(2, "0")}</span><h2>{title}</h2><p>Draft subject — source material required before publication.</p></article>)}</section></div>; }

export function ShopEliteCompare() { const { products } = useCatalog(); const [selected, setSelected] = useState<string[]>([]); const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((x) => x !== id) : current.length < 4 ? [...current, id] : current); const compared = products.filter((p) => selected.includes(p.id)); return <div className="qs-elite-page"><section className="qs-elite-collection-head"><p className="eyebrow">DISCOVER / COMPARE</p><h1>Compare what actually differs.</h1><p>Select up to four published products. Missing attributes remain unavailable rather than being guessed.</p></section><div className="qs-elite-compare-picker">{products.map((p) => <label key={p.id}><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} />{p.name}</label>)}</div>{compared.length > 0 && <div className="qs-elite-compare-table"><table><thead><tr><th>ATTRIBUTE</th>{compared.map((p) => <th key={p.id}>{p.name}</th>)}</tr></thead><tbody>{["Purpose", "Collection", "Price", "Materials", "Dimensions", "Weight", "Compatibility", "Warranty"].map((label) => <tr key={label}><th>{label}</th>{compared.map((p) => <td key={p.id}>{label === "Collection" ? p.collection : label === "Price" ? (p.variants[0]?.price_amount ? money(p.variants[0].price_amount, p.variants[0].currency) : "Not available") : "Not provided in the published record"}</td>)}</tr>)}</tbody></table></div>}</div>; }
