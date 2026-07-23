import type { Metadata } from "next";
import "./globals.css";
import MiaChat from "./MiaChat";

export const metadata: Metadata = {
  title: "Adversado | The Brand Behind The Brands",
  description: "A creative agency for brand strategy, identity, campaigns, digital, performance and experiences.",
  metadataBase: new URL("https://adversado.com"),
  openGraph: {
    title: "Adversado | The Brand Behind The Brands",
    description: "Strategy to execution. One team, end to end.",
    type: "website",
    images: [{ url: "/og.png", width: 1729, height: 910, alt: "Adversado - Build a brand people remember." }]
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}<MiaChat /></body>
    </html>
  );
}
