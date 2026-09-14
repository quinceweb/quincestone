import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { resolveCommerceCustomer } from "@/lib/account/customer";
import { listOrders } from "@/lib/account/orders";
import { listSavedProducts } from "@/lib/account/saved";

export default async function OverviewPage() {
  const [customer, orders, saved] = await Promise.all([resolveCommerceCustomer(), listOrders(), listSavedProducts()]);
  const firstName = customer.data?.name.split(/\s+/)[0] || null;
  return <main className="page-stack">
    <header className="hero"><p className="eyebrow">QUINCESTONE ACCOUNT</p><h1>{firstName ? `Hello, ${firstName}` : "Your Quincestone relationship, in one place."}</h1>{firstName ? <p>Your Quincestone relationship, in one place.</p> : null}</header>
    <div className="overview-grid">
      <section className="panel span-2"><p className="section-label">RECENT</p><p className="muted">{orders.error ? "Recent purchase activity is temporarily unavailable." : orders.data?.[0] ? `Order #${orders.data[0].order_number} · ${orders.data[0].status.replaceAll("_", " ")}` : "No recent purchase activity."}</p></section>
      <section className="panel"><p className="section-label">ORDERS</p>{orders.error ? <EmptyState title="Orders unavailable." body={orders.error} actionHref="/orders" actionLabel="View orders" /> : <EmptyState title={orders.data?.length ? `${orders.data.length} order${orders.data.length === 1 ? "" : "s"}` : "No orders yet."} body="Verified purchases and fulfillment state." actionHref="/orders" actionLabel="View orders" />}</section>
      <section className="panel"><p className="section-label">SAVED</p>{saved.error ? <EmptyState title="Saved unavailable." body={saved.error} actionHref="/saved" actionLabel="View saved" /> : <EmptyState title={saved.data?.length ? `${saved.data.length} saved product${saved.data.length === 1 ? "" : "s"}` : "Nothing saved yet."} body="Products you are considering." actionHref="/saved" actionLabel="View saved" />}</section>
      <section className="panel"><p className="section-label">ACCOUNT</p><div className="link-stack"><Link href="/profile">Profile</Link><Link href="/addresses">Addresses</Link><Link href="/security">Security</Link><Link href="/notifications">Notifications</Link></div></section>
      <section className="panel"><p className="section-label">SUPPORT</p><div className="link-stack"><Link href="/support">Get help</Link><a href="https://shop.quincestone.com">Continue shopping ↗</a></div></section>
    </div>
  </main>;
}
