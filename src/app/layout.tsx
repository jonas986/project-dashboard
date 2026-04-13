import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Projektübersicht — Vodafone",
  description: "Zentrale Projektübersicht für das Vodafone Team",
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
