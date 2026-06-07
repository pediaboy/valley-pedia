import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
