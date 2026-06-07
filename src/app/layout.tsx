import type { Metadata } from "next";
import "./globals.css";
import StarBackground from "@/components/ui/StarBackground";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "VALLEY.PEDIA - Premium Gaming Platform",
  description: "Platform gaming premium terpercaya. Buy/Sell Account, Room Wangi, Joki Rank & lebih banyak lagi.",
  keywords: "valley pedia, buy sell akun ml, room wangi, joki rank, gaming",
  openGraph: {
    title: "VALLEY.PEDIA",
    description: "Platform gaming premium terpercaya",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <LoadingScreen />
        <StarBackground />
        <Navbar />
        <main style={{ paddingTop: '64px', minHeight: '100vh' }}>
          {children}
        </main>
        <footer style={{ borderTop: '1px solid rgba(139,92,246,0.15)', padding: '2rem', textAlign: 'center', background: 'rgba(8,8,8,0.8)' }}>
          <p style={{ fontFamily: 'Orbitron', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>
            © 2025 VALLEY.PEDIA — ALL RIGHTS RESERVED
          </p>
        </footer>
      </body>
    </html>
  );
}
