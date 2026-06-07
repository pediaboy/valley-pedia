'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShoppingCart, MessageCircle, Check } from 'lucide-react';

const packages = [
  { name: 'Basic', price: 50000, desc: '1 rank up, estimasi 1-3 hari' },
  { name: 'Standard', price: 100000, desc: '3 rank up, estimasi 3-5 hari' },
  { name: 'Premium', price: 200000, desc: '5 rank up, estimasi 5-7 hari' },
];

export default function StarlightPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="section-title mb-2" style={{ color: '#f59e0b' }}>Starlight</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Dapatkan Starlight Pass dengan harga terbaik</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {packages.map((pkg, i) => (
          <motion.div key={pkg.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card glass-card-hover rounded-xl p-5 text-center cursor-pointer"
            onClick={() => router.push('/checkout?product=starlight-' + pkg.name.toLowerCase() + '&type=starlight')}>
            <div style={{ fontFamily: 'Orbitron', fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.5rem' }}>{pkg.name}</div>
            <div style={{ fontFamily: 'Orbitron', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }} className="gradient-text">
              Rp {pkg.price.toLocaleString('id-ID')}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '1rem' }}>{pkg.desc}</p>
            <button className="btn-purple w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
              <ShoppingCart size={14} /> Pilih Paket
            </button>
          </motion.div>
        ))}
      </div>
      <div className="glass-card rounded-xl p-5">
        <div style={{ color: '#00c3ff', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem', letterSpacing: '0.1em' }}>KEUNGGULAN</div>
        {['Tim profesional berpengalaman', 'Anti banned & aman 100%', 'Support 24 jam', 'Garansi selesai tepat waktu', 'Harga terjangkau'].map(b => (
          <div key={b} className="flex items-center gap-2 mb-2" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
            <Check size={14} style={{ color: '#4ade80' }} /> {b}
          </div>
        ))}
        <a href="/contact" className="btn-neon mt-4 py-3 px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
          <MessageCircle size={16} /> Tanya via WhatsApp
        </a>
      </div>
    </div>
  );
}
