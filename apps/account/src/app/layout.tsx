import type { Metadata } from "next";
import "../../../../packages/config/src/brand.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Quincestone Account", template: "%s — Quincestone Account" },
  description: "Your Quincestone identity, purchases, saved products, settings, security, and support.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
