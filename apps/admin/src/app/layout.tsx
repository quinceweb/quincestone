import type { Metadata } from "next";
import "../../../../packages/config/src/brand.css";
import "../../../../packages/config/src/stability.css";
import "./globals.css";

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
