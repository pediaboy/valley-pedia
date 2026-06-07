'use client';
import Navbar from "@/components/layout/Navbar";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, Star, Users, Shield, MessageCircle } from 'lucide-react';

const menuItems = [
  { label: 'Buy / Sell Account', href: '/buy-sell', icon: ShoppingCart, color: '#00c3ff', desc: 'Jual beli akun premium' },
  { label: 'Room Wangi Basic', href: '/room-wangi/basic', icon: Zap, color: '#8b5cf6', desc: 'Rp 20.000 / bulan' },
  { label: 'Room Wangi Premium', href: '/room-wangi/premium', icon: Star, color: '#ec4899', desc: 'Rp 45.000 / bulan' },
  { label: 'Room Wangi KYVIP', href: '/room-wangi/kyvip', icon: Shield, color: '#f59e0b', desc: 'Rp 75.000 / bulan' },
  { label: 'Joki Rank', href: '/joki-rank', icon: Zap, color: '#10b981', desc: 'Naik rank cepat & aman' },
  { label: 'Joki Akun', href: '/joki-akun', icon: Users, color: '#06b6d4', desc: 'Boost akun profesional' },
  { label: 'Starlight', href: '/starlight', icon: Star, color: '#f59e0b', desc: 'Starlight pass murah' },
  { label: 'Testimonial', href: '/testimonial', icon: MessageCircle, color: '#8b5cf6', desc: 'Review pelanggan' },
  { label: 'FAQ', href: '/faq', icon: Shield, color: '#00c3ff', desc: 'Pertanyaan umum' },
  { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan', icon: Shield, color: '#6b7280', desc: 'Baca sebelum order' },
  { label: 'Developer', href: '/developer', icon: Users, color: '#ec4899', desc: 'Tentang kami' },
  { label: 'Contact WhatsApp', href: '/contact', icon: MessageCircle, color: '#25d366', desc: 'Hubungi langsung' },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="galaxy-bg" />
      <div className="min-h-screen px-4 py-8" style={{ paddingTop: '5rem' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div style={{
              display: 'inline-block',
              background: 'rgba(0,195,255,0.08)',
              border: '1px solid rgba(0,195,255,0.2)',
              borderRadius: 8,
              padding: '4px 12px',
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              color: 'rgba(0,195,255,0.7)',
              marginBottom: '1rem',
            }}>VP</div>
            <h1 className="gradient-text" style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
              fontWeight: 800,
              marginBottom: '0.5rem',
            }}>VALLEY.PEDIA</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
              Sistem Online • Platform Gaming Premium Terpercaya
            </p>
          </motion.div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: '2rem' }}>
            {[
              { label: 'Total Order', value: '10.750+', color: '#00c3ff' },
              { label: 'User Aktif', value: '5.2K+', color: '#8b5cf6' },
              { label: 'Rating', value: '4.9 ★', color: '#f59e0b' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i }}
                className="glass-card" style={{ borderRadius: 12, padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ color: s.color, fontFamily: 'Orbitron,sans-serif', fontWeight: 700, fontSize: '1rem' }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', marginTop: 2 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Menu */}
          <div className="space-y-2">
            {menuItems.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                <Link href={item.href} className="menu-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${item.color}15`,
                      border: `1px solid ${item.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <item.icon size={16} style={{ color: item.color }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.label}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{item.desc}</div>
                    </div>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>›</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ marginTop: '2rem' }}>
            <a href="https://wa.me/6282172222494" target="_blank" rel="noopener noreferrer"
              className="btn-purple w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
              <MessageCircle size={18} />
              Contact WhatsApp
            </a>
          </motion.div>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
            © 2025 VALLEY.PEDIA — ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </>
  );
}
