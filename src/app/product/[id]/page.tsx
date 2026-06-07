'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, ShoppingCart, MessageCircle, ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const defaultBenefits = [
  'Support iOS', 'Anti Banned', 'Musuh Bot', 'Musuh Low Tier',
  'MMR Deres', 'Support Solo Party', 'Bisa Ajak Teman', 'Jaringan Lancar', 'Full Pengajaran'
];

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div style={{ fontFamily: 'Orbitron', color: '#00c3ff', fontSize: '0.8rem', letterSpacing: '0.2em' }}>LOADING...</div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div style={{ color: 'rgba(255,255,255,0.3)' }}>Produk tidak ditemukan</div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 mb-6"
        style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
        <ChevronLeft size={18} /> Kembali
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="rounded-xl overflow-hidden mb-3" style={{ aspectRatio: '4/3', background: 'rgba(139,92,246,0.1)' }}>
            {product.images?.[activeImg] ? (
              <img src={product.images[activeImg]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingCart size={40} style={{ color: 'rgba(139,92,246,0.3)' }} />
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img: string, i: number) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className="flex-shrink-0 rounded-lg overflow-hidden"
                  style={{ width: '70px', height: '50px', border: i === activeImg ? '2px solid #00c3ff' : '2px solid transparent' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${product.status === 'ready' ? 'text-green-400' : 'text-red-400'}`}
            style={{ background: product.status === 'ready' ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${product.status === 'ready' ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
            {product.status === 'ready' ? '● Ready' : '● Sold'}
          </div>
          <h1 className="text-xl font-bold mb-2">{product.name}</h1>
          <div style={{ fontFamily: 'Orbitron', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }} className="gradient-text">
            Rp {product.price?.toLocaleString('id-ID')}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>{product.description}</p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {[{ label: 'Hero', value: product.hero }, { label: 'Rank', value: product.rank }, { label: 'Server', value: product.server }, { label: 'Skin', value: `${product.skin_count} Skin` }].map(d => (
              <div key={d.label} className="glass-card rounded-lg p-3">
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', marginBottom: '2px' }}>{d.label}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{d.value || '-'}</div>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-xl p-4 mb-5">
            <div style={{ color: '#00c3ff', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem', letterSpacing: '0.1em' }}>BENEFIT</div>
            <div className="grid grid-cols-1 gap-2">
              {(product.benefits?.length ? product.benefits : defaultBenefits).map((b: string) => (
                <div key={b} className="flex items-center gap-2" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                  <Check size={14} style={{ color: '#4ade80', flexShrink: 0 }} /> {b}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => product.status === 'ready' && router.push(`/checkout?product=${product.id}`)}
              disabled={product.status !== 'ready'}
              className="btn-purple flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
              style={{ opacity: product.status !== 'ready' ? 0.5 : 1 }}>
              <ShoppingCart size={16} /> Order Sekarang
            </button>
            <a href={`https://wa.me/62${process.env.NEXT_PUBLIC_WA_NUMBER}`} target="_blank" rel="noopener noreferrer"
              className="btn-neon px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <MessageCircle size={16} /> WA
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
