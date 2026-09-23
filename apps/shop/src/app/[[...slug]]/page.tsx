import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShopHomeEditorial, ShopStandardPage, ShopFieldNotesPage } from "../../views/ShopEditorialPages";
import { ShopEliteCollection, ShopEliteProduct, ShopEliteSearch, ShopEliteCompare } from "../../views/ShopElite";
import { ShopCartExperience } from "../../views/ShopExperience";

type PageProps = { params: Promise<{ slug?: string[] }> };

const collectionRoutes: Record<string, string | undefined> = {
  discover: undefined,
  featured: undefined,
  new: undefined,
  collections: undefined,
  products: "products",
  travel: "travel",
  drive: "drive",
  companion: "companion",
  "home-outdoor": "home-outdoor",
};

function TruthPage({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <section className="shop-status-page"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{text}</p></section>;
}

function OrderReturn() {
  return <section className="shop-status-page"><p className="eyebrow">ORDER RECEIVED</p><h1>Payment confirmation is being reconciled.</h1><p>A browser return is not payment proof. Your order will appear in Account only after the provider result is verified.</p><a className="button" href="https://account.quincestone.com/orders">View orders in Account</a></section>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const path = (await params).slug ?? [];
  if (path[0] === "product" && path[1]) return { title: "Product", alternates: { canonical: `/product/${path[1]}` } };
  const titles: Record<string, string> = { search: "Search", bag: "Bag", products: "Products", travel: "Travel", drive: "Drive", companion: "Pet", "home-outdoor": "Home" };
  return path[0] ? { title: titles[path[0]] ?? "Shop", alternates: { canonical: `/${path.join("/")}` } } : {};
}

export default async function ShopPage({ params }: PageProps) {
  const path = (await params).slug ?? [];
  if (!path.length) return <ShopHomeEditorial />;
  if (path[0] === "shop" && path[1] === "product" && path[2]) redirect(`/product/${path[2]}`);
  if (path[0] === "shop" || path[0] === "account") redirect("/");
  if (path[0] === "cart") redirect("/bag");
  if (path[0] in collectionRoutes) return <ShopEliteCollection collection={collectionRoutes[path[0]]} />;
  if (path[0] === "field-notes") return <ShopFieldNotesPage />;
  if (path[0] === "product" && path[1]) return <ShopEliteProduct slug={path[1]} />;
  if (path[0] === "search") return <ShopEliteSearch />;
  if (path[0] === "compare") return <ShopEliteCompare />;
  if (path[0] === "bag" || path[0] === "checkout") return <ShopCartExperience />;
  if (path[0] === "order" && path[1]) return <OrderReturn />;
  if (path[0] === "standard") return <ShopStandardPage />;
  if (path[0] === "shipping") return <TruthPage eyebrow="SHIPPING" title="Delivery should be evidence-led." text="Availability and timing are shown only from verified fulfillment information." />;
  if (path[0] === "returns") return <TruthPage eyebrow="RETURNS" title="A clear return path is part of the product." text="Returns follow the actual published product and order policy." />;
  if (path[0] === "support") return <TruthPage eyebrow="SUPPORT" title="Help stays close to the transaction." text="Account connects a request to the customer and order context needed to resolve it." />;
  return <TruthPage eyebrow="404 / SHOP" title="This route is outside the product house." text="Return to Shop to continue browsing published products." />;
}
