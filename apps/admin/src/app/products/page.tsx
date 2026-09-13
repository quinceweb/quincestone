import Link from "next/link";
import { requirePlatformRole } from "@/lib/platform-authority";
import { createCommerceAuthorityClient } from "@/lib/commerce";

export const dynamic = "force-dynamic";

const portfolio = [
  { slug: "vacuum-compression-travel-backpack", label: "Compression Travel System", target: "$99", collection: "TRAVEL" },
  { slug: "cordless-premium-pressure-washer-power-cleaner", label: "Portable Power Cleaner", target: "$99", collection: "DRIVE" },
  { slug: "obd2-automotive-diagnostic-scanner", label: "Vehicle Signal Scanner", target: "$59", collection: "DRIVE" },
  { slug: "hard-bottom-dog-backseat-travel-platform", label: "Pet Travel Platform", target: "$79", collection: "COMPANION" },
  { slug: "smart-bird-feeder-camera", label: "Smart Bird Feeder", target: "$129", collection: "HOME + OUTDOOR" },
] as const;

export default async function ProductsControlPlane() {
  try { await requirePlatformRole("operator"); } catch (error) {
    const message = error instanceof Error && error.message === "Forbidden" ? "Platform operations authority is not enabled for this identity." : "Sign in with an authorized Quincestone operations identity.";
    return <main className="main"><div className="content"><div className="eyebrow">PRODUCTS / AUTHORITY REQUIRED</div><h1>Product operations are fail-closed.</h1><p className="lede">{message}</p><div className="notice"><strong>No product data was loaded.</strong><span>Customer workspace roles are not treated as commerce publication authority.</span></div></div></main>;
  }

  const supabase = createCommerceAuthorityClient();
  const { data: products } = await supabase.from("commerce_products").select("id,name,slug,collection,lifecycle_status,merchandising_status,publication_state,target_price_amount,fulfillment_state,human_approved_at,updated_at").order("updated_at", { ascending: false });
  const { data: economics } = await supabase.from("commerce_product_economic_summary").select("product_id,total_variable_cost_amount,margin_gate,pre_ad_margin_percent,approved");
  const econ = new Map((economics || []).map((row) => [row.product_id, row]));
  const selected = portfolio.map((item) => ({ ...item, product: (products || []).find((product) => product.slug === item.slug) })).filter((item) => item.product);

  return <main className="main"><div className="content"><div className="header"><div><div className="eyebrow">COMMERCE / PRODUCT CONTROL</div><h1>The Quincestone Shop portfolio.</h1><p className="lede">Five controlled candidates. Research can move quickly; publication cannot.</p></div><div className="status"><div className="status-label">Authority</div><div className="status-value">Operator</div></div></div><section className="section"><div className="section-heading"><div><div className="eyebrow">TEST PORTFOLIO</div><h2>Publication remains blocked until evidence passes.</h2></div><span>{selected.length} candidates</span></div><div className="commerce-product-list">{selected.map(({ product, label, target, collection }) => { const e = econ.get(product!.id); const ready = product!.publication_state === "published"; return <article key={product!.id} className="commerce-product-row"><div><span className="product-collection">{collection}</span><h3>{label}</h3><p>{product!.slug}</p><Link className="text-link" href={`/commerce/products/${product!.id}`}>Open product control →</Link></div><div className="product-lifecycle"><span>Target {target}</span><strong>{ready ? "PUBLISHED" : "BLOCKED"}</strong><small>{product!.lifecycle_status} · economics {e?.margin_gate || "unknown"}</small></div></article>; })}</div></section><section className="grid"><section className="section"><span className="nav-label">PUBLICATION RULE</span><h2>Evidence first.</h2><p>Verified supplier/sample evidence, quality, utility, economics, reliability, fulfillment, media rights and explicit human approval are required before publication.</p></section><section className="section"><span className="nav-label">ECONOMICS RULE</span><h2>55%</h2><p>Pre-ad margin target. Maximum all-in variable cost is 45% of the Quincestone selling price. Missing cost data remains unknown and blocks publication.</p></section></section></div></main>;
}
