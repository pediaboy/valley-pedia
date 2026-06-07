'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Check, ShoppingCart, MessageCircle } from 'lucide-react';

const benefits = ['Support iOS', 'Anti Banned', 'Musuh Bot', 'Musuh Low Tier', 'MMR Deres', 'Support Solo Party', 'Bisa Ajak Teman', 'Jaringan Lancar', 'Full Pengajaran'];

export default function RoomWangiKyvipPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl overflow-hidden">
        <div className="p-1" style={{ background: 'linear-gradient(135deg, #f59e0b40, #f59e0b20)' }}>
          <div className="rounded-xl p-6" style={{ background: '#0f0f1f' }}>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: '#f59e0b20', border: '1px solid #f59e0b50', color: '#f59e0b' }}>KY VIP</div>
            <h1 className="section-title mb-2" style={{ color: 'white' }}>Room Wangi KYVIP</h1>
            <div style={{ fontFamily: 'Orbitron', fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.5rem' }}>
              Rp 75.000
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Durasi / Fitur: VPN Premium 1 Bulan</p>
            <div className="space-y-2 mb-6">
              {benefits.map(b => (
                <div key={b} className="flex items-center gap-3" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#f59e0b20', border: '1px solid #f59e0b50' }}>
                    <Check size={12} style={{ color: '#f59e0b' }} />
                  </div>
                  {b}
                </div>
              ))}
            </div>
            <div className="text-center mb-4" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
              10.290+ TRANSAKSI
            </div>
            <div className="flex gap-3">
              <button onClick={() => router.push('/checkout?product=kyvip&type=room-wangi')}
                className="btn-purple flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                <ShoppingCart size={16} /> Order Sekarang
              </button>
              <a href="https://wa.me/62" target="_blank" className="btn-neon px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
