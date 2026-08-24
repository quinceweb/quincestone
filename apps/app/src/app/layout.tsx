import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quincestone — Business Platform",
  description: "The authenticated Quincestone business platform for turning customer demand into structured operations and outcomes.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
