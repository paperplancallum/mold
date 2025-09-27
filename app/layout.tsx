import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MoldScope",
  description: "AI-powered mold analysis for DIY testing kits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Node;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}