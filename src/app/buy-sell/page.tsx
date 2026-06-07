'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Filter, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Product = {
  id: string; name: string; price: number; description: string;
  hero: string; skin_count: number; rank: string; server: string;
  status: 'ready' | 'sold'; images: string[];
};

const ranks = ['All', 'Warrior', 'Elite', 'Master', 'Grandmaster', 'Epic', 'Legend', 'Mythic', 'Mythical Glory'];

export default function BuySellPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filterRank, setFilterRank] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').eq('category', 'buy-sell').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const filtered = products
    .filter(p => {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.hero?.toLowerCase().includes(q);
    })
    .filter(p => filterRank === 'All' || p.rank === filterRank)
    .sort((a, b) => sortBy === 'price-asc' ? a.price - b.price : sortBy === 'price-desc' ? b.price - a.price : 0);

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="section-title gradient-text mb-2">Buy / Sell Account</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Jual beli akun Mobile Legends terpercaya</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-48 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.4)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari akun, hero, skin..." className="input-galaxy pl-10" />
        </div>
        <select value={filterRank} onChange={e => setFilterRank(e.target.value)} className="input-galaxy" style={{ width: 'auto' }}>
          {ranks.map(r => <option key={r} value={r} style={{ background: '#0a0a1a' }}>{r}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-galaxy" style={{ width: 'auto' }}>
          <option value="newest" style={{ background: '#0a0a1a' }}>Terbaru</option>
          <option value="price-asc" style={{ background: '#0a0a1a' }}>Harga ↑</option>
          <option value="price-desc" style={{ background: '#0a0a1a' }}>Harga ↓</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl overflow-hidden animate-pulse" style={{ height: '320px' }}>
              <div style={{ height: '180px', background: 'rgba(139,92,246,0.1)' }} />
              <div className="p-4 space-y-2">
                <div style={{ height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                <div style={{ height: '12px', width: '60%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag size={40} style={{ color: 'rgba(255,255,255,0.2)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Orbitron', fontSize: '0.8rem' }}>Belum ada produk</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product, i) => (
            <motion.div key={product.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}>
              <Link href={`/product/${product.id}`} className="product-card block">
                <div style={{ height: '180px', background: 'rgba(139,92,246,0.1)', position: 'relative', overflow: 'hidden' }}>
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={32} style={{ color: 'rgba(139,92,246,0.4)' }} />
                    </div>
                  )}
                  <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold ${product.status === 'ready' ? 'text-green-400' : 'text-red-400'}`}
                    style={{ background: product.status === 'ready' ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${product.status === 'ready' ? 'rgba(74,222,128,0.4)' : 'rgba(239,68,68,0.4)'}` }}>
                    {product.status === 'ready' ? 'Ready' : 'Sold'}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span style={{ color: '#00c3ff', fontWeight: 700, fontFamily: 'Orbitron', fontSize: '0.85rem' }}>
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{product.rank}</span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginTop: '4px' }}>
                    {product.hero} • {product.skin_count} Skin
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
