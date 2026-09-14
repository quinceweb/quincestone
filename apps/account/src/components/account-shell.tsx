import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/app/actions";

const primary = [["Overview", "/"], ["Orders", "/orders"], ["Saved", "/saved"], ["Addresses", "/addresses"], ["Support", "/support"]] as const;
const account = [["Profile", "/profile"], ["Security", "/security"], ["Notifications", "/notifications"], ["Payments", "/payments"], ["Settings", "/settings"]] as const;

export function AccountShell({ email, children }: { email?: string | null; children: ReactNode }) {
  return <div className="shell">
    <aside className="sidebar">
      <Link href="/" className="brand" aria-label="Quincestone Account home"><span>QUINCESTONE</span><strong>Account</strong></Link>
      <nav aria-label="Account navigation" className="nav-list">{primary.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      <div className="sidebar-bottom">
        <a className="shop-link" href="https://shop.quincestone.com">Continue shopping <span aria-hidden>↗</span></a>
        <details className="account-menu"><summary>{email ?? "Account"}</summary><div>{account.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}<form action={signOut}><button type="submit">Sign out</button></form></div></details>
      </div>
    </aside>
    <div className="mobile-header"><Link href="/" className="brand"><span>QUINCESTONE</span><strong>Account</strong></Link><a href="https://shop.quincestone.com">Shop ↗</a></div>
    <div className="content">{children}</div>
    <nav className="mobile-nav" aria-label="Mobile account navigation">{primary.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
  </div>;
}
