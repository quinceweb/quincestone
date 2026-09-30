import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/app/account/actions";

const primary = [["Overview", "/account"], ["Orders", "/account/orders"], ["Saved", "/account/saved"], ["Addresses", "/account/addresses"], ["Businesses", "/account/businesses"], ["Support", "/account/support"]] as const;
const secondary = [["Profile", "/account/profile"], ["Security", "/account/security"], ["Notifications", "/account/notifications"], ["Payments", "/account/payments"], ["Settings", "/account/settings"]] as const;

export function AccountShell({ email, children }: { email?: string | null; children: ReactNode }) {
  return <div className="account-shell">
    <aside className="account-sidebar">
      <Link href="/account" className="account-brand" aria-label="Quincestone Account home"><span>QUINCESTONE</span><strong>Account</strong></Link>
      <nav aria-label="Account navigation" className="account-nav">{primary.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      <div className="account-sidebar-bottom">
        <a className="account-shop-link" href="https://shop.quincestone.com">Continue shopping <span aria-hidden>↗</span></a>
        <details className="account-menu"><summary>{email ?? "Account"}</summary><div>{secondary.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}<form action={signOut}><button type="submit">Sign out</button></form></div></details>
      </div>
    </aside>
    <header className="account-mobile-header"><Link href="/account" className="account-brand"><span>QUINCESTONE</span><strong>Account</strong></Link><a href="https://shop.quincestone.com">Shop ↗</a></header>
    <div className="account-content">{children}</div>
    <nav className="account-mobile-nav" aria-label="Mobile account navigation">{primary.slice(0,5).map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
  </div>;
}