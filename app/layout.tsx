import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MOOCKY | AI Enhanced Learning",
  description: "A MOOCKY prototype for AI-guided course discovery and learning support.",
};

export const viewport: Viewport = {
  themeColor: "#F7F7F7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
