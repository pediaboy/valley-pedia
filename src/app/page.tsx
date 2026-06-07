'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, ShoppingCart, Zap, Star, Users, Shield, MessageCircle } from 'lucide-react';

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
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
          style={{ background: 'linear-gradient(135deg, rgba(0,195,255,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(0,195,255,0.3)', boxShadow: '0 0 40px rgba(0,195,255,0.2)' }}>
          <span style={{ fontFamily: 'Orbitron', fontSize: '1.1rem', fontWeight: 900 }} className="gradient-text">VP</span>
        </div>
        <h1 style={{ fontFamily: 'Orbitron', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '0.1em' }}
          className="gradient-text mb-1">VALLEY.PEDIA</h1>
        <div className="badge-online mx-auto w-fit mb-3">Sistem Online</div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Platform Gaming Premium Terpercaya</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Order', value: '10.750+', color: '#00c3ff' },
          { label: 'User Aktif', value: '5.2K+', color: '#8b5cf6' },
          { label: 'Rating', value: '4.9 ★', color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-3 text-center">
            <div style={{ color: s.color, fontFamily: 'Orbitron', fontSize: '1rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Menu */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="space-y-2">
        {menuItems.map((item, i) => (
          <motion.div key={item.href}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.04 }}>
            <Link href={item.href} className="menu-item group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}18`, border: `1px solid ${item.color}40` }}>
                  <item.icon size={16} style={{ color: item.color }} />
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>{item.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{item.desc}</div>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: '#8b5cf6', flexShrink: 0 }} />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="mt-8 text-center">
        <Link href="/contact"
          className="btn-purple inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold">
          <MessageCircle size={16} />
          Contact WhatsApp
        </Link>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', marginTop: '1.5rem', letterSpacing: '0.15em' }}>
          © 2025 VALLEY.PEDIA — ALL RIGHTS RESERVED
        </p>
      </motion.div>
    </div>
  );
}
