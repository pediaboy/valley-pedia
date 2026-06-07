'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, Star, FileText, Settings, Image, HelpCircle, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const adminMenus = [
  { label: 'Produk', href: '/admin/products', icon: Package, color: '#00c3ff' },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag, color: '#8b5cf6' },
  { label: 'Testimoni', href: '/admin/testimonials', icon: Star, color: '#f59e0b' },
  { label: 'Banner', href: '/admin/banners', icon: Image, color: '#ec4899' },
  { label: 'FAQ', href: '/admin/faqs', icon: HelpCircle, color: '#10b981' },
  { label: 'Syarat & Ket.', href: '/admin/terms', icon: FileText, color: '#06b6d4' },
  { label: 'Pengaturan', href: '/admin/settings', icon: Settings, color: '#6b7280' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, users: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('orders').select('id, total_amount, status, customer_name, payment_method, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('orders').select('total_amount', { count: 'exact' }).eq('status', 'paid'),
      supabase.from('products').select('id', { count: 'exact' }),
    ]).then(([ordersRes, revenueRes, productsRes]) => {
      setRecentOrders(ordersRes.data || []);
      const rev = revenueRes.data?.reduce((a, b) => a + (b.total_amount || 0), 0) || 0;
      setStats({
        orders: revenueRes.count || 0,
        revenue: rev,
        products: productsRes.count || 0,
        users: 0,
      });
      setLoading(false);
    });
  }, []);

  const statusColor: Record<string, string> = {
    pending: '#f59e0b', paid: '#4ade80', completed: '#00c3ff',
    cancelled: '#ef4444', expired: '#6b7280', failed: '#ef4444',
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.15em', marginBottom: '0.25rem' }}>VALLEY.PEDIA</div>
          <h1 style={{ fontFamily: 'Orbitron', fontSize: '1.25rem', fontWeight: 800 }} className="gradient-text">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-xl glass-card">
          <div className="w-8 h-8 rounded-full" style={{ background: 'linear-gradient(135deg, #00c3ff, #8b5cf6)' }} />
          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Admin Valley</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Order', value: stats.orders.toLocaleString(), icon: ShoppingBag, color: '#00c3ff', bg: 'rgba(0,195,255,0.08)' },
          { label: 'Pending', value: recentOrders.filter(o => o.status === 'pending').length, icon: TrendingUp, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
          { label: 'Total Produk', value: stats.products, icon: Package, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
          { label: 'Pendapatan', value: `Rp ${(stats.revenue/1000000).toFixed(1)}Jt`, icon: DollarSign, color: '#4ade80', bg: 'rgba(74,222,128,0.08)' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="stat-card" style={{ '--color': s.color } as any}>
            <div className="flex items-start justify-between">
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{s.label}</div>
                <div style={{ fontFamily: 'Orbitron', fontSize: '1.25rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
              <div className="p-2 rounded-lg" style={{ background: s.bg }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: 'Orbitron', fontSize: '0.8rem', color: '#00c3ff', letterSpacing: '0.1em' }}>ORDER TERBARU</h2>
            <Link href="/admin/orders" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Lihat Semua →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-14 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
            </div>
          ) : (
            <table className="table-galaxy">
              <thead>
                <tr><th>Pelanggan</th><th>Nominal</th><th>Metode</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ color: 'rgba(255,255,255,0.8)' }}>{order.customer_name}</td>
                    <td style={{ color: '#00c3ff', fontFamily: 'Orbitron', fontSize: '0.8rem' }}>Rp {order.total_amount?.toLocaleString('id-ID')}</td>
                    <td style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontSize: '0.75rem' }}>{order.payment_method}</td>
                    <td><span style={{ color: statusColor[order.status] || 'white', fontSize: '0.75rem', fontWeight: 600 }}>{order.status?.toUpperCase()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Admin Menu */}
        <div className="glass-card rounded-xl p-5">
          <h2 style={{ fontFamily: 'Orbitron', fontSize: '0.8rem', color: '#8b5cf6', letterSpacing: '0.1em', marginBottom: '1rem' }}>MENU ADMIN</h2>
          <div className="space-y-2">
            {adminMenus.map((item, i) => (
              <Link key={item.href} href={item.href} className="menu-item">
                <div className="flex items-center gap-3">
                  <item.icon size={16} style={{ color: item.color }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.label}</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>→</span>
              </Link>
            ))}
          </div>
          <Link href="/" className="btn-neon mt-4 py-2 px-4 rounded-lg text-xs w-full text-center block">← Kembali ke Website</Link>
        </div>
      </div>
    </div>
  );
}
