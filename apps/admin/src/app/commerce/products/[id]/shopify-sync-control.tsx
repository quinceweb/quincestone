import { syncProductToShopify } from "./shopify-actions";

export function ShopifySyncControl({ productId }: { productId: string }) {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <div className="eyebrow">SHOPIFY / DOWNSTREAM CHANNEL</div>
          <h2>Controlled projection</h2>
        </div>
      </div>
      <p>Quincestone remains authoritative. A sync can only project a launch-ready product and will force the Shopify product to remain a draft.</p>
      <form action={syncProductToShopify.bind(null, productId)}>
        <button type="submit">Sync to Shopify draft</button>
      </form>
    </section>
  );
}
