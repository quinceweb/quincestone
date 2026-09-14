import type { Metadata } from "next";

export const metadata: Metadata = { title: "Trust & security" };

export default function SecurityPage() {
  return (
    <main className="shell trust-page">
      <div className="section-kicker">Trust architecture</div>
      <h1>Commercial truth is the product.</h1>
      <p className="trust-lead">Quincestone Deals is being built so that commercial status, ownership and authority are explicit. The foundation release does not claim server persistence, payment execution, identity verification or shared approval before those systems are connected and verified.</p>
      <div className="trust-grid">
        <article><span>01</span><h2>Truthful states</h2><p>Draft, proposed, revised, accepted, expired and settled states will be represented explicitly—not inferred from UI activity.</p></article>
        <article><span>02</span><h2>Scoped access</h2><p>Persistent deal records will require authenticated, role-aware access controls at the data layer before shared deal rooms go live.</p></article>
        <article><span>03</span><h2>Payment boundaries</h2><p>Payment providers will hold regulated payment credentials. Quincestone Deals will not store raw card numbers or security codes.</p></article>
        <article><span>04</span><h2>Durable history</h2><p>Material commercial changes are designed to become auditable events rather than silent overwrites once persistence is connected.</p></article>
      </div>
      <section className="trust-status"><strong>Current foundation state</strong><p>Local drafting: available. Server persistence: not connected. Authentication: not connected. Shared deal rooms: not connected. Payments: not connected.</p></section>
    </main>
  );
}
