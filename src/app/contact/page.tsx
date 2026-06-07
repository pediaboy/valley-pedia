'use client';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Clock, Shield } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="section-title gradient-text mb-2">Contact</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Hubungi tim kami langsung</p>
      </motion.div>

      <div className="space-y-4">
        <motion.a href="https://wa.me/62" target="_blank" rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="block glass-card glass-card-hover rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)' }}>
              <MessageCircle size={28} style={{ color: '#25d366' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>WhatsApp</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Respon cepat</div>
            </div>
          </div>
          <div className="btn-purple py-3 px-6 rounded-xl font-semibold text-sm text-center flex items-center justify-center gap-2"
            style={{ background: 'rgba(37,211,102,0.2)', border: '1px solid rgba(37,211,102,0.4)', color: '#25d366' }}>
            <MessageCircle size={16} /> Chat di WhatsApp
          </div>
        </motion.a>

        <motion.a href="https://t.me/" target="_blank" rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="block glass-card glass-card-hover rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,195,255,0.15)', border: '1px solid rgba(0,195,255,0.3)' }}>
              <Send size={28} style={{ color: '#00c3ff' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Telegram</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Official channel</div>
            </div>
          </div>
          <div className="py-3 px-6 rounded-xl font-semibold text-sm text-center flex items-center justify-center gap-2"
            style={{ background: 'rgba(0,195,255,0.1)', border: '1px solid rgba(0,195,255,0.3)', color: '#00c3ff' }}>
            <Send size={16} /> Open Telegram
          </div>
        </motion.a>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { icon: Clock, color: '#f59e0b', label: 'Response Time', value: '< 5 menit' },
            { icon: Shield, color: '#4ade80', label: 'Terpercaya', value: '10.750+ Order' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              className="glass-card rounded-xl p-4 text-center">
              <item.icon size={24} style={{ color: item.color, margin: '0 auto 0.5rem' }} />
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>{item.label}</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: item.color }}>{item.value}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
