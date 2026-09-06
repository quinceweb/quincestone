import type { Metadata } from "next";
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
