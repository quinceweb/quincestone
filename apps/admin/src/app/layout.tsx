import type { Metadata } from "next";
import "../../../../packages/config/src/brand.css";
import "./globals.css";
import "./qvs.css";

export const metadata: Metadata = {
  title: "Quincestone Control Plane",
  description: "Internal platform administration for Quincestone.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
