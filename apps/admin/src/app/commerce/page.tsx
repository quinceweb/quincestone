import { requirePlatformRole } from "@/lib/platform-authority";
import { createCommerceAuthorityClient, gatePassed, launchGateLabels } from "@/lib/commerce";

export const dynamic = "force-dynamic";

export default async function CommerceOperationsPage() {
  try { await requirePlatformRole("operator"); } catch (error) {
    const message = error instanceof Error && error.message === "Forbidden" ? "Platform operations authority is not enabled for this identity." : "Sign in with an authorized Quincestone operations identity.";
    return <main className="main"><div className="content"><div className="eyebrow">COMMERCE / AUTHORITY REQUIRED</div><h1>Operations are fail-closed.</h1><p className="lede">{message}</p><div className="notice"><strong>No privileged data was loaded.</strong><span>Customer workspace roles are not treated as commerce operations authority.</span></div></div></main>;
  }

  const supabase = createCommerceAuthorityClient();
  const [{ data: products }, { data: qa }, { count: orderCount }, { count: fulfillmentCount }, { count: returnCount }] = await Promise.all([
    supabase.from("commerce_products").select("id,name,slug,collection,lifecycle_status,merchandising_status,publication_state,updated_at").order("updated_at", { ascending: false }),
    supabase.from("commerce_product_qa").select("product_id,sourcing_status,exact_sku_verified,sample_status,quality_result,functional_result,packaging_result,media_verification,economics_approval,shipping_terms_approval,returns_warranty_approval,price_approval,content_approval,final_decision"),
    supabase.from("commerce_orders").select("id", { count: "exact", head: true }),
    supabase.from("commerce_fulfillments").select("id", { count: "exact", head: true }).in("status", ["required", "reviewing"]),
    supabase.from("commerce_returns").select("id", { count: "exact", head: true }).in("status", ["requested", "reviewing", "approved", "in_transit", "received", "refund_pending"]),
  ]);
  const qaByProduct = new Map((qa || []).map((item) => [item.product_id, item]));

  return <main className="main"><div className="content">
    <div className="header"><div><div className="eyebrow">COMMERCE / OPERATIONS</div><h1>Quincestone Commerce.</h1><p className="lede">The operational surface for products, launch evidence, orders, fulfillment and customer outcomes.</p></div><div className="status"><div className="status-label">Authority</div><div className="status-value">Operator</div></div></div>
    <div className="grid">
      <section className="section"><span className="nav-label">CATALOG</span><h2>{products?.length ?? 0}</h2><p>Internal product records. Only approved launch gates can enter the public catalog.</p></section>
      <section className="section"><span className="nav-label">ORDERS</span><h2>{orderCount ?? 0}</h2><p>Orders recorded in the commerce authority.</p></section>
      <section className="section"><span className="nav-label">FULFILLMENT QUEUE</span><h2>{fulfillmentCount ?? 0}</h2><p>Paid orders awaiting operational review or action.</p></section>
      <section className="section"><span className="nav-label">RETURNS</span><h2>{returnCount ?? 0}</h2><p>Open customer return workflows.</p></section>
    </div>
    <section className="section commerce-table" id="products"><div className="section-heading"><div><div className="eyebrow">PRODUCT QA</div><h2>Launch gate</h2></div><span>{products?.length ?? 0} candidates</span></div>
      <div className="commerce-product-list">{(products || []).map((product) => { const evidence = qaByProduct.get(product.id); const passed = evidence ? launchGateLabels.filter(([key]) => gatePassed(key, (evidence as Record<string, unknown>)[key])).length : 0; const ready = passed === launchGateLabels.length && evidence?.final_decision === "ready"; return <article key={product.id} className="commerce-product-row"><div><span className="product-collection">{product.collection.replace("-", " + ").toUpperCase()}</span><h3>{product.name}</h3><p>{product.slug}</p></div><div className="product-lifecycle"><span>{product.lifecycle_status}</span><strong>{ready ? "READY" : "BLOCKED"}</strong><small>{passed}/{launchGateLabels.length} launch gates passed</small></div></article>; })}</div>
    </section>
    <section className="section commerce-queue"><div className="section-heading"><div><div className="eyebrow">OPERATING MODEL</div><h2>Supplier fulfillment remains human-approved.</h2></div></div><p>Customer payment creates a fulfillment requirement. It does not authorize an automatic supplier purchase. Operators review supplier mapping, economics, exact SKU and operational terms before any supplier order is placed.</p><div className="commerce-flow"><span>PAID</span><b>→</b><span>FULFILLMENT REQUIRED</span><b>→</b><span>HUMAN REVIEW</span><b>→</b><span>SUPPLIER ORDER</span><b>→</b><span>TRACKING</span></div></section>
  </div></main>;
}
