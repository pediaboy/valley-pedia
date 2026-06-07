'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';

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
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(139,92,246,0.15)',
        padding: '0.6rem 1rem',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/logo-rw.jpg" alt="Valley Pedia" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 8 }} />
            <div>
              <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#00c3ff', letterSpacing: '0.05em' }}>VALLEY.PEDIA</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', display: 'inline-block' }} />
                <span style={{ fontSize: '0.58rem', color: '#4ade80', letterSpacing: '0.1em' }}>Sistem Online</span>
              </div>
            </div>
          </Link>
          {/* Hamburger */}
          <button onClick={() => setOpen(true)} style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#00c3ff' }}>
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 99,
                width: 'min(85vw, 320px)',
                background: 'rgba(8,8,8,0.98)', backdropFilter: 'blur(30px)',
                borderLeft: '1px solid rgba(139,92,246,0.2)',
                padding: '1.5rem 1rem',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src="/logo-rw.jpg" alt="VP" style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 6 }} />
                  <span style={{ fontFamily: 'Orbitron,sans-serif', fontSize: '0.75rem', color: '#00c3ff' }}>MENU</span>
                </div>
                <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="menu-item" style={{ fontSize: '0.85rem' }}>
                    {item.label}
                    <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
