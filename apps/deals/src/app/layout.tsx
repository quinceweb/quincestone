import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Quincestone Deals — Negotiated commerce, resolved",
    template: "%s — Quincestone Deals",
  },
  description:
    "A commercial deal workspace for creating, negotiating, approving and closing business deals with clarity.",
  metadataBase: new URL("https://quincestonedeals.com"),
  openGraph: {
    title: "Quincestone Deals",
    description: "Negotiate. Approve. Pay. Close.",
    url: "https://quincestonedeals.com",
    siteName: "Quincestone Deals",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="Quincestone Deals home">
            <span className="brand-mark" aria-hidden="true">Q</span>
            <span>
              <strong>Quincestone</strong>
              <small>Deals</small>
            </span>
          </Link>
          <nav className="nav" aria-label="Primary navigation">
            <Link href="/#product">Product</Link>
            <Link href="/#principles">Principles</Link>
            <Link href="/security">Trust</Link>
            <Link className="nav-cta" href="/new">Create a deal</Link>
          </nav>
        </header>
        {children}
        <footer className="footer">
          <div>
            <strong>Quincestone Deals</strong>
            <p>Negotiated commerce, with a single commercial record.</p>
          </div>
          <div className="footer-links">
            <Link href="https://quincestone.com">Quincestone</Link>
            <Link href="https://shop.quincestone.com">Shop</Link>
            <Link href="/security">Trust</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
