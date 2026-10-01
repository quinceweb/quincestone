import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePlatformRole } from "@/lib/platform-authority";
import { createCommerceAuthorityClient, gatePassed, launchGateLabels } from "@/lib/commerce";
import { reviewProductMedia } from "./actions";
import { ShopifySyncControl } from "./shopify-sync-control";

export const dynamic = "force-dynamic";
function status(value: unknown) { return typeof value === "string" ? value.toUpperCase().replaceAll("_", " ") : value === true ? "PASSED" : "BLOCKED"; }

export default async function CommerceProductPage({ params }: { params: Promise<{ id: string }> }) {
  try { await requirePlatformRole("operator"); } catch { return <main className="main"><div className="content"><div className="eyebrow">COMMERCE / AUTHORITY REQUIRED</div><h1>Product operations are fail-closed.</h1><p className="lede">Sign in with an authorized Quincestone operations identity.</p></div></main>; }
  const { id } = await params; const supabase = createCommerceAuthorityClient();
  const { data: product } = await supabase.from("commerce_products").select("*").eq("id", id).maybeSingle();
  if (!product) notFound();
  const [{ data: qa }, { data: content }, { data: variants }, { data: media }] = await Promise.all([
    supabase.from("commerce_product_qa").select("*").eq("product_id", id).maybeSingle(),
    supabase.from("commerce_product_content").select("*").eq("product_id", id).maybeSingle(),
    supabase.from("commerce_variants").select("id,sku,status,price_amount,compare_at_amount,currency,option_values,weight_grams,dimensions").eq("product_id", id).order("sku"),
    supabase.from("commerce_product_media").select("*").eq("product_id", id).order("sort_order").order("created_at"),
  ]);
  const variantIds = (variants || []).map((v) => v.id);
  const { data: supplierLinks } = variantIds.length ? await supabase.from("commerce_supplier_products").select("id,supplier_id,supplier_sku,supplier_product_id,quoted_unit_cost,currency,moq,quote_date,media_rights_state,is_selected").in("variant_id", variantIds) : { data: [] };
  const passed = qa ? launchGateLabels.filter(([key]) => gatePassed(key, (qa as Record<string, unknown>)[key])).length : 0;
  const launchReady = passed === launchGateLabels.length && qa?.final_decision === "ready";
  return <main className="main"><div className="content">
    <div className="header"><div><Link className="text-link" href="/commerce">← Commerce</Link><div className="eyebrow">PRODUCT CONTROL / {product.collection.toUpperCase()}</div><h1>{product.name}</h1><p className="lede">{product.slug}</p></div><div className="status"><div className="status-label">Publication</div><div className="status-value">{status(product.publication_state)}</div></div></div>
    <div className="notice"><strong>{launchReady ? "ENGINEERING READY / COMMERCIAL READY" : "PUBLICATION BLOCKED"}</strong><span>{passed}/{launchGateLabels.length} launch gates pass. Database publication triggers remain authoritative.</span></div>
    <div className="grid"><section className="section"><span className="nav-label">LIFECYCLE</span><h2>{status(product.lifecycle_status)}</h2><p>Merchandising: {status(product.merchandising_status)} · Publication: {status(product.publication_state)}</p></section><section className="section"><span className="nav-label">VARIANTS</span><h2>{variants?.length ?? 0}</h2><p>Only active priced variants can participate in a final launch.</p></section><section className="section"><span className="nav-label">MEDIA</span><h2>{media?.length ?? 0}</h2><p>Every public asset requires rights, verification and publication state.</p></section><section className="section"><span className="nav-label">CONTENT</span><h2>{content ? "PRESENT" : "MISSING"}</h2><p>Public content is data-driven and remains subject to content approval.</p></section></div>
    <ShopifySyncControl productId={id} />
    <section className="section commerce-table"><div className="section-heading"><div><div className="eyebrow">LAUNCH READINESS</div><h2>Authoritative gates</h2></div><span>{passed}/{launchGateLabels.length}</span></div><div className="commerce-product-list">{launchGateLabels.map(([key,label]) => { const value = qa ? (qa as Record<string, unknown>)[key] : undefined; const ok = gatePassed(key,value); return <div className="commerce-product-row" key={key}><div><strong>{label}</strong><p>{key}</p></div><div className="product-lifecycle"><strong>{ok ? "PASS" : "BLOCKED"}</strong><small>{status(value)}</small></div></div>; })}</div></section>
    <section className="section commerce-table"><div className="section-heading"><div><div className="eyebrow">MEDIA REVIEW</div><h2>Rights and SKU evidence</h2></div><span>{media?.length ?? 0} assets</span></div>{!media?.length ? <p>No media is attached. This is safe but keeps media verification blocked.</p> : <div className="commerce-product-list">{media.map((asset) => <article className="commerce-product-row" key={asset.id}><div><strong>{asset.media_type.toUpperCase()}</strong><p>{asset.asset_url}</p><small>{status(asset.source)} · {status(asset.verification_status)} · {status(asset.publication_status)}</small></div><div className="media-actions"><form action={reviewProductMedia.bind(null,id,asset.id,"APPROVE")}><button type="submit">Approve</button></form><form action={reviewProductMedia.bind(null,id,asset.id,"REJECT")}><button type="submit">Reject</button></form><form action={reviewProductMedia.bind(null,id,asset.id,"MARK_CONCEPT")}><button type="submit">Concept</button></form><form action={reviewProductMedia.bind(null,id,asset.id,"MARK_VERIFIED")}><button type="submit">Verify</button></form><form action={reviewProductMedia.bind(null,id,asset.id,"RESTRICT")}><button type="submit">Restrict</button></form><form action={reviewProductMedia.bind(null,id,asset.id,"UNPUBLISH")}><button type="submit">Unpublish</button></form></div></article>)}</div>}</section>
    <section className="section"><div className="section-heading"><div><div className="eyebrow">ECONOMICS / SUPPLIER</div><h2>Internal commercial evidence</h2></div></div><p>{supplierLinks?.length ? `${supplierLinks.length} supplier mapping record(s) exist.` : "No supplier mapping is attached to a variant yet."} Supplier identity, costs, MOQ and commercial terms never enter the public catalog.</p></section>
    <section className="section"><div className="section-heading"><div><div className="eyebrow">CONTENT READINESS</div><h2>{content?.headline || "Content pending"}</h2></div></div>{content?.short_description ? <p>{content.short_description}</p> : <p>No public content is authored yet. Missing supplier-dependent claims remain omitted.</p>}<p className="admin-muted">SEO: {content?.seo_title || product.seo_title || "Pending"}</p></section>
  </div></main>;
}
