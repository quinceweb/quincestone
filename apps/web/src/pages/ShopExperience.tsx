import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type CatalogRow = {
  id: string; slug: string; name: string; description: string | null; collection: string;
  variant_id: string; sku: string; option_values: Record<string, string>; price_amount: number;
  compare_at_amount: number | null; currency: string; weight_grams: number | null; dimensions: Record<string, unknown> | null;
  media_id: string | null; asset_url: string | null; media_type: string | null; alt_text: string | null; sort_order: number | null;
};
type Product = { id: string; slug: string; name: string; description: string | null; collection: string; variants: CatalogRow[]; media: CatalogRow[] };
type CartItem = { variantId: string; quantity: number };

const standards = [
  ["01", "Demand", "We begin with a real customer problem, not a random catalog."],
  ["02", "Quality", "Samples and specifications earn the right to move forward."],
  ["03", "Utility", "Products must solve something clearly and usefully."],
  ["04", "Economics", "Price and landed economics are verified before launch."],
  ["05", "Reliability", "Fulfillment, returns, media rights and support are part of the product."],
  ["06", "Experience", "The transaction is only complete when the customer outcome is understood."],
] as const;

function useCatalog() {
  const [rows, setRows] = useState<CatalogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) { setLoading(false); return; }
      const { data, error: queryError } = await supabase.from("commerce_catalog").select("*").order("slug").order("sort_order");
      if (!active) return;
      if (queryError) setError(true); else setRows((data || []) as CatalogRow[]);
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, []);
  const products = useMemo(() => {
    const map = new Map<string, Product>();
    for (const row of rows) {
      let product = map.get(row.id);
      if (!product) { product = { id: row.id, slug: row.slug, name: row.name, description: row.description, collection: row.collection, variants: [], media: [] }; map.set(row.id, product); }
      if (!product.variants.some((variant) => variant.variant_id === row.variant_id)) product.variants.push(row);
      if (row.media_id && !product.media.some((media) => media.media_id === row.media_id)) product.media.push(row);
    }
    return [...map.values()];
  }, [rows]);
  return { products, loading, error };
}

function money(amount: number, currency: string) { return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100); }
function readCart(): CartItem[] { try { return JSON.parse(localStorage.getItem("qs-commerce-cart") || "[]") as CartItem[]; } catch { return []; } }
function writeCart(items: CartItem[]) { localStorage.setItem("qs-commerce-cart", JSON.stringify(items)); window.dispatchEvent(new Event("qs-cart-change")); }

function CatalogCard({ product }: { product: Product }) {
  const variant = product.variants[0];
  const image = product.media[0];
  return <Link className="shop-product-card" to={`/shop/product/${product.slug}`}><div className="shop-product-media">{image?.asset_url ? <img src={image.asset_url} alt={image.alt_text || product.name} loading="lazy" /> : <span>IMAGE PENDING</span>}</div><div className="shop-product-meta"><span>{product.collection.replace("-", " + ").toUpperCase()}</span><strong>{product.name}</strong>{variant?.price_amount ? <b>{money(variant.price_amount, variant.currency)}</b> : <small>Price pending</small>}</div></Link>;
}

export function ShopExperience({ collection = "discover" }: { collection?: string }) {
  const { products, loading, error } = useCatalog();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => products.filter((product) => (collection === "discover" || product.collection === collection) && product.name.toLowerCase().includes(query.trim().toLowerCase())), [collection, products, query]);
  const title = collection === "travel" ? "Travel, considered." : collection === "drive" ? "Drive, better." : collection === "companion" ? "For the ones beside you." : collection === "home-outdoor" ? "Home + Outdoor." : "Better things for how you move, live and explore.";
  return <section className="shop-page shop-commerce-page"><div className="shop-editorial-hero"><div><p className="eyebrow">QUINCESTONE / SHOP</p><h1>{title}</h1><p className="lede">Useful products selected through demand, quality, utility, economics and customer experience.</p></div><div className="shop-editorial-note"><span>THE STANDARD</span><strong>Products earn publication.</strong><p>No invented stock, reviews, discounts, delivery claims or supplier stories.</p></div></div><nav className="shop-collection-nav" aria-label="Shop collections"><Link className={collection === "discover" ? "active" : ""} to="/shop">Discover</Link><Link className={collection === "travel" ? "active" : ""} to="/shop/travel">Travel</Link><Link className={collection === "drive" ? "active" : ""} to="/shop/drive">Drive</Link><Link className={collection === "companion" ? "active" : ""} to="/shop/companion">Companion</Link><Link className={collection === "home-outdoor" ? "active" : ""} to="/shop/home-outdoor">Home + Outdoor</Link><span /><Link to="/shop/cart">Bag</Link></nav><div className="shop-discovery-tools"><label className="shop-search"><span className="sr-only">Search products</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" autoComplete="off" /></label><div className="shop-tool-status">{loading ? "Checking verified catalog…" : `${filtered.length} published ${filtered.length === 1 ? "product" : "products"}`}</div></div>{error ? <section className="shop-empty"><div><p className="shop-kicker">CATALOG UNAVAILABLE</p><h2>The catalog could not be read.</h2><p>Quincestone is not substituting placeholder inventory for a failed commerce connection. Try again shortly.</p></div></section> : filtered.length ? <section className="shop-product-grid">{filtered.map((product) => <CatalogCard key={product.id} product={product} />)}</section> : <section className="shop-empty"><div className="shop-empty-mark"><img src="/favicon.svg" alt="" /></div><div><p className="shop-kicker">{loading ? "VERIFYING" : "CATALOG STATUS"}</p><h2>{loading ? "Checking what is genuinely ready to sell." : "The catalog is being curated."}</h2><p>{loading ? "Only products that pass the Quincestone publication gate can appear here." : "The first product candidates are in sourcing and verification. Nothing is published until its SKU, sample, specification, economics, shipping, rights, price and content gates pass."}</p></div></section>}<section className="shop-standards"><div className="shop-standards-intro"><p className="eyebrow">THE QUINCESTONE STANDARD</p><h2>Commerce should earn trust before asking for the transaction.</h2><p>Our internal product process is deliberately stricter than a storefront needs to look.</p></div><div className="shop-standards-grid">{standards.map(([n, titleText, text]) => <article key={n}><span>{n}</span><strong>{titleText}</strong><p>{text}</p></article>)}</div></section></section>;
}

export function ShopProduct() {
  const { slug } = useParams();
  const { products, loading } = useCatalog();
  const product = products.find((item) => item.slug === slug);
  const [variantId, setVariantId] = useState("");
  const variant = product?.variants.find((item) => item.variant_id === (variantId || product.variants[0]?.variant_id));
  const [added, setAdded] = useState(false);
  if (loading) return <section className="shop-product-page"><p className="eyebrow">QUINCESTONE SHOP</p><h1>Checking product availability.</h1></section>;
  if (!product || !variant) return <section className="shop-product-page"><p className="eyebrow">404 / PRODUCT</p><h1>This product is not published.</h1><p className="lede">Quincestone does not expose internal sourcing candidates as public products.</p><Link className="button" to="/shop">Back to shop</Link></section>;
  const add = () => { const cart = readCart(); const existing = cart.find((item) => item.variantId === variant.variant_id); writeCart(existing ? cart.map((item) => item.variantId === variant.variant_id ? { ...item, quantity: item.quantity + 1 } : item) : [...cart, { variantId: variant.variant_id, quantity: 1 }]); setAdded(true); };
  const image = product.media[0];
  return <section className="shop-product-page"><div className="shop-product-layout"><div className="shop-product-gallery">{image?.asset_url ? <img src={image.asset_url} alt={image.alt_text || product.name} /> : <div className="shop-product-pending">MEDIA PENDING VERIFICATION</div>}</div><div className="shop-product-copy"><p className="eyebrow">{product.collection.replace("-", " + ").toUpperCase()}</p><h1>{product.name}</h1><p className="lede">{product.description}</p><div className="shop-product-price">{money(variant.price_amount, variant.currency)}</div>{product.variants.length > 1 && <label className="shop-variant-select">Variant<select value={variant.variant_id} onChange={(event) => setVariantId(event.target.value)}>{product.variants.map((item) => <option key={item.variant_id} value={item.variant_id}>{item.sku}</option>)}</select></label>}<button className="button shop-buy" type="button" onClick={add}>{added ? "Added to bag" : "Add to bag"}</button><p className="shop-product-truth">Availability, fulfillment and delivery are checked again by the commerce server before checkout.</p><div className="shop-detail-list"><div><span>PRODUCT STATUS</span><strong>Published</strong></div><div><span>SPECIFICATIONS</span><strong>Verified catalog data only</strong></div><div><span>RETURNS</span><strong>Policy shown before purchase</strong></div></div></div></div></section>;
}

export function ShopCartExperience() {
  const { products } = useCatalog();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => { const sync = () => setCart(readCart()); sync(); window.addEventListener("qs-cart-change", sync); return () => window.removeEventListener("qs-cart-change", sync); }, []);
  const lines = cart.map((item) => { const variant = products.flatMap((product) => product.variants.map((v) => ({ ...v, productName: product.name }))).find((v) => v.variant_id === item.variantId); return variant ? { ...item, variant } : null; }).filter(Boolean) as Array<CartItem & { variant: CatalogRow & { productName: string } }>;
  const total = lines.reduce((sum, line) => sum + line.variant.price_amount * line.quantity, 0);
  async function checkout() { setMessage(""); if (!email || !email.includes("@")) { setMessage("Enter an email address to continue."); return; } if (!lines.length) return; setBusy(true); try { const response = await fetch("/api/commerce-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, items: lines.map((line) => ({ variantId: line.variant.variant_id, quantity: line.quantity })) }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Checkout unavailable."); window.location.assign(data.checkoutUrl); } catch (error) { setMessage(error instanceof Error ? error.message : "Checkout unavailable."); setBusy(false); } }
  return <section className="shop-cart-page"><p className="eyebrow">QUINCESTONE / BAG</p><h1>Your bag.</h1>{!lines.length ? <div className="shop-cart-boundary"><div><strong>Your bag is empty.</strong><p>Products enter the bag only after they are genuinely published.</p></div><Link className="button" to="/shop">Continue shopping</Link></div> : <div className="shop-cart-live"><div className="shop-cart-lines">{lines.map((line) => <article key={line.variant.variant_id}><div><strong>{line.variant.productName}</strong><span>{line.variant.sku}</span></div><span>{line.quantity} × {money(line.variant.price_amount, line.variant.currency)}</span><button type="button" onClick={() => { writeCart(cart.filter((item) => item.variantId !== line.variant.variant_id)); }}>Remove</button></article>)}</div><aside className="shop-checkout-panel"><span>SERVER-AUTHORITATIVE TOTAL</span><strong>{money(total, lines[0].variant.currency)}</strong><label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" /></label><button className="button" type="button" disabled={busy} onClick={checkout}>{busy ? "Preparing secure checkout…" : "Continue to secure checkout"}</button>{message && <p role="alert">{message}</p>}<small>Final availability, price, payment and order state are verified server-side.</small></aside></div>}</section>;
}
