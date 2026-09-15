import type { Metadata } from "next";
import Link from "next/link";
import "../../../../packages/config/src/brand.css";
import "./globals.css";
import "./qde.css";
export const metadata: Metadata={title:{default:"Quincestone Deals — Negotiated commerce, resolved",template:"%s — Quincestone Deals"},description:"A negotiated-commerce operating environment built around one living commercial record."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><header className="site-header"><Link className="brand" href="/"><span className="brand-mark">Q</span><span><strong>Quincestone</strong><small>Deals</small></span></Link><nav className="nav"><Link href="/deals">Deals</Link><Link href="/inbox">Inbox</Link><Link href="/security">Trust</Link><Link className="nav-cta" href="/new">Create deal</Link></nav></header>{children}<footer className="footer"><div><strong>Quincestone Deals</strong><p>Commercial truth is the product.</p></div><div className="footer-links"><Link href="https://quincestone.com">Quincestone</Link><Link href="https://shop.quincestone.com">Shop</Link><Link href="/security">Trust</Link></div></footer></body></html>}
