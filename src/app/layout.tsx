import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

// Force all pages to be dynamically rendered (not statically prerendered)
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "VALLEY.PEDIA | Platform Gaming Premium",
  description: "Platform jual beli akun game, joki rank, room wangi, dan layanan gaming premium terpercaya",
  keywords: "jual beli akun, joki rank, room wangi, starlight, mobile legends",
  openGraph: {
    title: "VALLEY.PEDIA",
    description: "Platform Gaming Premium Terpercaya",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        <main style={{ paddingTop: '70px', minHeight: '100vh' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
