'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Wifi } from 'lucide-react';

const navItems = [
  { label: 'Buy / Sell Account', href: '/buy-sell' },
  { label: 'Room Wangi Basic', href: '/room-wangi/basic' },
  { label: 'Room Wangi Premium', href: '/room-wangi/premium' },
  { label: 'Room Wangi KYVIP', href: '/room-wangi/kyvip' },
  { label: 'Joki Rank', href: '/joki-rank' },
  { label: 'Joki Akun', href: '/joki-akun' },
  { label: 'Starlight', href: '/starlight' },
  { label: 'Testimonial', href: '/testimonial' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
  { label: 'Developer', href: '/developer' },
  { label: 'Contact WhatsApp', href: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
        style={{ background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00c3ff, #8b5cf6)', boxShadow: '0 0 20px rgba(0,195,255,0.3)' }}>
              <span style={{ fontFamily: 'Orbitron', fontSize: '0.6rem', fontWeight: 900, color: 'white' }}>VP</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em' }}
                className="gradient-text">VALLEY.PEDIA</div>
              <div className="badge-online" style={{ fontSize: '0.55rem' }}>Sistem Online</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.slice(0, 6).map(item => (
              <Link key={item.href} href={item.href}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:text-cyan-400"
                style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.02em' }}>
                {item.label}
              </Link>
            ))}
            <button onClick={() => setOpen(true)}
              className="btn-neon px-4 py-1.5 rounded-lg text-xs ml-2">
              More ▾
            </button>
          </div>

          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg"
            style={{ border: '1px solid rgba(139,92,246,0.3)', color: '#00c3ff' }}>
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Full Menu Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[100]" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-[101] w-80 overflow-y-auto"
              style={{ background: '#0a0a1a', borderLeft: '1px solid rgba(139,92,246,0.3)' }}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <span style={{ fontFamily: 'Orbitron', fontSize: '0.8rem', color: '#00c3ff', letterSpacing: '0.15em' }}>MENU</span>
                  <button onClick={() => setOpen(false)} className="p-2 rounded-lg"
                    style={{ border: '1px solid rgba(139,92,246,0.3)', color: 'rgba(255,255,255,0.5)' }}>
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  {navItems.map((item, i) => (
                    <motion.div key={item.href}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}>
                      <Link href={item.href} onClick={() => setOpen(false)} className="menu-item">
                        <span className="text-sm font-medium">{item.label}</span>
                        <ChevronRight size={16} style={{ color: '#8b5cf6' }} />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
