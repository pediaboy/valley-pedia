'use client';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Instagram, Music2 } from 'lucide-react';

const socialLinks = [
  { label: 'WhatsApp', icon: MessageCircle, color: '#25d366', href: 'https://wa.me/62', username: '@VALLEY.PEDIA' },
  { label: 'Telegram', icon: Send, color: '#00c3ff', href: 'https://t.me/', username: '@valleypedia' },
  { label: 'Instagram', icon: Instagram, color: '#ec4899', href: 'https://instagram.com/', username: '@valley.pedia' },
  { label: 'TikTok', icon: Music2, color: '#8b5cf6', href: 'https://tiktok.com/', username: '@valley.pedia' },
];

export default function DeveloperPage() {
  return (
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #00c3ff)', boxShadow: '0 0 40px rgba(139,92,246,0.4)' }}>
          <span style={{ fontFamily: 'Orbitron', fontSize: '1.2rem', fontWeight: 900, color: 'white' }}>VP</span>
        </div>

        <h1 className="section-title gradient-text mb-2">VALLEY.PEDIA</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '2rem', lineHeight: '1.7' }}>
          Kami adalah developer independen yang bergerak pada layanan game, dan terpercaya.
        </p>

        <div className="space-y-3 mb-8">
          {socialLinks.map((social, i) => (
            <motion.a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl transition-all duration-300"
              style={{ background: `${social.color}10`, border: `1px solid ${social.color}30` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = social.color + '60'; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${social.color}20`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = social.color + '30'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${social.color}20` }}>
                  <social.icon size={20} style={{ color: social.color }} />
                </div>
                <div className="text-left">
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{social.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{social.username}</div>
                </div>
              </div>
              <span style={{ color: social.color, fontSize: '0.75rem', fontWeight: 500 }}>Kontak →</span>
            </motion.a>
          ))}
        </div>

        <motion.a href="/contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="btn-purple inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold">
          <MessageCircle size={18} /> Kontak via WhatsApp
        </motion.a>

        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', marginTop: '3rem', letterSpacing: '0.15em' }}>
          © 2025 VALLEY.PEDIA
        </p>
      </motion.div>
    </div>
  );
}
