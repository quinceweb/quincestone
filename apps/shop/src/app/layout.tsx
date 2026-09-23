import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../../../../packages/config/src/brand.css";
import "../styles.css";
import "../commerce-product.css";
import "../shop-commerce.css";
import "../commerce-godmode.css";
import "../shop-elite.css";
import "../shop-elite-experience.css";
import "../shop-navigation.css";
import "../footer-commerce-premium.css";
import { ShopLayout } from "../components/ShopLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://shop.quincestone.com"),
  title: { default: "Quincestone Shop — Better things, chosen carefully.", template: "%s | Quincestone Shop" },
  description: "Useful products selected through evidence, utility and experience.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Quincestone Shop",
    title: "Quincestone Shop — Better things, chosen carefully.",
    description: "Useful products selected through evidence, utility and experience.",
    url: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F3F0E9",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body><ShopLayout>{children}</ShopLayout></body></html>;
}
