import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/empty-state";

export default async function OverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const firstName = typeof user?.user_metadata?.first_name === "string" ? user.user_metadata.first_name : null;
  return <main className="page-stack">
    <header className="hero"><p className="eyebrow">QUINCESTONE ACCOUNT</p><h1>{firstName ? `Hello, ${firstName}` : "Your Quincestone relationship, in one place."}</h1>{firstName ? <p>Your Quincestone relationship, in one place.</p> : null}</header>
    <div className="overview-grid">
      <section className="panel span-2"><p className="section-label">RECENT</p><p className="muted">Recent account activity is not connected yet.</p></section>
      <section className="panel"><p className="section-label">ORDERS</p><EmptyState title="Order history unavailable." body="The canonical order source is not connected to Account yet." actionHref="/orders" actionLabel="View orders" /></section>
      <section className="panel"><p className="section-label">SAVED</p><EmptyState title="Saved products unavailable." body="Saved-product persistence is not connected to Account yet." actionHref="/saved" actionLabel="View saved" /></section>
      <section className="panel"><p className="section-label">ACCOUNT</p><div className="link-stack"><Link href="/profile">Profile</Link><Link href="/addresses">Addresses</Link><Link href="/security">Security</Link><Link href="/notifications">Notifications</Link></div></section>
      <section className="panel"><p className="section-label">SUPPORT</p><div className="link-stack"><Link href="/support">Get help</Link><a href="https://shop.quincestone.com">Continue shopping ↗</a></div></section>
    </div>
  </main>;
}
