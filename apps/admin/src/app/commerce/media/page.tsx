import { requirePlatformRole } from "@/lib/platform-authority";
import { createCommerceAuthorityClient } from "@/lib/commerce";
import { reviewProductMedia, uploadProductMedia } from "../products/[id]/actions";

export const dynamic = "force-dynamic";

function status(value: unknown) { return typeof value === "string" ? value.toUpperCase().replaceAll("_", " ") : value === true ? "PASSED" : "BLOCKED"; }

export default async function CommerceMediaPage() {
  try { await requirePlatformRole("operator"); } catch { return <main className="main"><div className="content"><div className="eyebrow">COMMERCE / AUTHORITY REQUIRED</div><h1>Media operations are fail-closed.</h1><p className="lede">Sign in with an authorized Quincestone operations identity.</p></div></main>; }
  const supabase = createCommerceAuthorityClient();
  const [{ data: products }, { data: media }] = await Promise.all([
    supabase.from("commerce_products").select("id,name,slug,lifecycle_status,merchandising_status,publication_state").order("name"),
    supabase.from("commerce_product_media").select("id,product_id,asset_url,media_type,source,rights_status,verification_status,publication_status,publication_permission,sku_association,sort_order,storage_path,products:commerce_products(name,slug)").order("created_at", { ascending: false }),
  ]);

  return <main className="main"><div className="content">
    <div className="header"><div><div className="eyebrow">COMMERCE / MEDIA</div><h1>Product image operations.</h1><p className="lede">Create the imagery in Photoroom. Upload the finished assets here. Quincestone stores them in Supabase, associates them to the exact product, and keeps publication behind the existing review gates.</p></div><div className="status"><div className="status-label">Assets</div><div className="status-value">{media?.length ?? 0}</div></div></div>

    <section className="section commerce-table">
      <div className="section-heading"><div><div className="eyebrow">UPLOAD</div><h2>Drop in a finished product-image set.</h2><p className="lede">JPEG, PNG, WebP or AVIF · maximum 10 MB each · up to 20 images per batch.</p></div></div>
      <form action={uploadProductMedia} className="commerce-media-upload">
        <label><span>Product</span><select name="productId" required defaultValue=""><option value="" disabled>Select a product</option>{products?.map((product) => <option key={product.id} value={product.id}>{product.name} · {product.slug}</option>)}</select></label>
        <label><span>Image role</span><select name="mediaType" defaultValue="product"><option value="product">Primary product</option><option value="detail">Detail / material</option><option value="lifestyle">Lifestyle</option><option value="demonstration">Demonstration / use</option></select></label>
        <label className="commerce-media-upload__files"><span>Finished Photoroom images</span><input name="files" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple required /><small>Use the final product images, not supplier originals. Uploading marks them pending review; it does not publish them automatically.</small></label>
        <button className="button" type="submit">Upload image set</button>
      </form>
    </section>

    <section className="section commerce-table"><div className="section-heading"><div><div className="eyebrow">REVIEW QUEUE</div><h2>Every asset has an explicit state.</h2></div></div>{!media?.length ? <p>No media records exist.</p> : <div className="commerce-product-list">{media.map((asset) => { const product = Array.isArray(asset.products) ? asset.products[0] : asset.products; return <article className="commerce-product-row" key={asset.id}><div className="commerce-media-row"><div className="commerce-media-preview">{asset.asset_url ? <img src={asset.asset_url} alt="" loading="lazy" /> : null}</div><div><strong>{product?.name || "Unknown product"}</strong><p>{asset.asset_url}</p><small>{status(asset.media_type)} · {status(asset.source)} · rights {status(asset.rights_status)} · verification {status(asset.verification_status)} · publication {status(asset.publication_status)}</small></div></div><div className="media-actions"><form action={reviewProductMedia.bind(null,asset.product_id,asset.id,"APPROVE")}><button type="submit">Approve</button></form><form action={reviewProductMedia.bind(null,asset.product_id,asset.id,"REJECT")}><button type="submit">Reject</button></form><form action={reviewProductMedia.bind(null,asset.product_id,asset.id,"MARK_CONCEPT")}><button type="submit">Concept</button></form><form action={reviewProductMedia.bind(null,asset.product_id,asset.id,"MARK_VERIFIED")}><button type="submit">Verify</button></form><form action={reviewProductMedia.bind(null,asset.product_id,asset.id,"RESTRICT")}><button type="submit">Restrict</button></form><form action={reviewProductMedia.bind(null,asset.product_id,asset.id,"UNPUBLISH")}><button type="submit">Unpublish</button></form></div></article>; })}</div>}</section>
  </div></main>;
}
