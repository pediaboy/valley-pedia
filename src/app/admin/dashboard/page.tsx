'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, ShoppingBag, DollarSign, TrendingUp, Star, FileText, Settings, Image, HelpCircle, LogOut } from 'lucide-react';
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
  const router = useRouter();
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Guard: cek apakah sudah login
    if (typeof window !== 'undefined') {
      const isAdmin = sessionStorage.getItem('vp_admin');
      if (!isAdmin) {
        router.replace('/admin');
        return;
      }
    }

    Promise.all([
      supabase.from('orders').select('id, total_amount, status, customer_name, payment_method, order_id, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('orders').select('total_amount').eq('status', 'paid'),
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('products').select('id', { count: 'exact', head: true }),
    ]).then(([ordersRes, revenueRes, pendingRes, productsRes]) => {
      setRecentOrders(ordersRes.data || []);
      const rev = (revenueRes.data || []).reduce((a: number, b: any) => a + (b.total_amount || 0), 0);
      setStats({
        orders: ordersRes.data?.length || 0,
        revenue: rev,
        products: productsRes.count || 0,
        pending: pendingRes.count || 0,
      });
      setLoading(false);
    });
  }, [router]);

  const statusColor: Record<string, string> = {
    pending: '#f59e0b', paid: '#4ade80', completed: '#00c3ff',
    cancelled: '#ef4444', expired: '#6b7280', failed: '#ef4444',
  };

  const handleLogout = () => {
    sessionStorage.removeItem('vp_admin');
    router.push('/admin');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080808', padding: '1.5rem 1rem' }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,195,255,0.06) 0%, transparent 60%)',
      }} />

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>
              VALLEY.PEDIA
            </div>
            <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: '1rem', color: '#00c3ff' }}>Admin Panel</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/" style={{
              padding: '6px 14px', borderRadius: 8, fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none',
            }}>← Website</Link>
            <button onClick={handleLogout} style={{
              padding: '6px 14px', borderRadius: 8, fontSize: '0.72rem', cursor: 'pointer',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171', display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Order', value: stats.orders, icon: ShoppingBag, color: '#00c3ff' },
            { label: 'Pending', value: stats.pending, icon: TrendingUp, color: '#f59e0b' },
            { label: 'Total Produk', value: stats.products, icon: Package, color: '#8b5cf6' },
            { label: 'Pendapatan', value: `Rp ${(stats.revenue / 1000).toFixed(0)}K`, icon: DollarSign, color: '#4ade80' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * i }}
              className="glass-card" style={{ borderRadius: 14, padding: '1.2rem', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}15`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: '1.1rem', fontWeight: 700, color: s.color }}>{loading ? '—' : s.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="glass-card" style={{ borderRadius: 16, padding: '1.2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>ORDER TERBARU</div>
            <Link href="/admin/orders" style={{ fontSize: '0.72rem', color: '#00c3ff', textDecoration: 'none' }}>Lihat Semua →</Link>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>Memuat...</div>
          ) : recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>Belum ada order</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>
                    {['Order ID', 'Pelanggan', 'Nominal', 'Metode', 'Status'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0 0.75rem 0.75rem', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: any) => (
                    <tr key={order.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.7rem 0.75rem', color: '#00c3ff', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{order.order_id || order.id?.slice(0,8)}</td>
                      <td style={{ padding: '0.7rem 0.75rem', color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap' }}>{order.customer_name}</td>
                      <td style={{ padding: '0.7rem 0.75rem', color: '#fff', whiteSpace: 'nowrap' }}>Rp {order.total_amount?.toLocaleString('id-ID')}</td>
                      <td style={{ padding: '0.7rem 0.75rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{order.payment_method}</td>
                      <td style={{ padding: '0.7rem 0.75rem' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 600,
                          color: statusColor[order.status] || '#fff',
                          background: `${statusColor[order.status] || '#fff'}18`,
                          border: `1px solid ${statusColor[order.status] || '#fff'}30`,
                          whiteSpace: 'nowrap',
                        }}>{order.status?.toUpperCase()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Menu Admin */}
        <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem' }}>MENU ADMIN</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
          {adminMenus.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * i }}>
              <Link href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '0.9rem 1rem',
                background: 'rgba(15,15,31,0.6)', border: '1px solid rgba(139,92,246,0.15)',
                borderRadius: 12, textDecoration: 'none', color: '#fff', fontSize: '0.82rem',
                transition: 'all 0.2s',
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon size={15} style={{ color: item.color }} />
                </div>
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
