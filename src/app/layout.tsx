import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Projekte — Vodafone Market Research",
  description: "Vodafone Market Research Project Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
