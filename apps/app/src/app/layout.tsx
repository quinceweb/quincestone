import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quincestone — Control Plane",
  description: "Authenticated operating application for Quincestone intelligence.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
