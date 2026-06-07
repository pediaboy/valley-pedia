'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const statusTabs = ['all', 'pending', 'paid', 'completed', 'cancelled'];
const statusColor: Record<string, string> = { pending: '#f59e0b', paid: '#4ade80', completed: '#00c3ff', cancelled: '#ef4444', expired: '#6b7280', failed: '#ef4444' };

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, [tab]);

  const fetchOrders = async () => {
    setLoading(true);
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (tab !== 'all') query = query.eq('status', tab);
    const { data } = await query;
    setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchOrders();
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <h1 style={{ fontFamily: 'Orbitron', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }} className="gradient-text">Manajemen Order</h1>
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
        {statusTabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-xl text-sm font-semibold capitalize flex-shrink-0 transition-all duration-200"
            style={{ background: tab === t ? 'rgba(0,195,255,0.15)' : 'rgba(15,15,31,0.8)', border: `1px solid ${tab === t ? 'rgba(0,195,255,0.5)' : 'rgba(139,92,246,0.2)'}`, color: tab === t ? '#00c3ff' : 'rgba(255,255,255,0.5)' }}>
            {t}
          </button>
        ))}
      </div>
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-galaxy" style={{ minWidth: '700px' }}>
            <thead>
              <tr><th>Order ID</th><th>Pelanggan</th><th>Nominal</th><th>Metode</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {!loading && orders.map(o => (
                <tr key={o.id}>
                  <td style={{ color: '#00c3ff', fontSize: '0.75rem', fontFamily: 'Orbitron' }}>{o.order_id}</td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>{o.customer_name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{o.customer_whatsapp}</div>
                  </td>
                  <td style={{ color: '#4ade80', fontFamily: 'Orbitron', fontSize: '0.8rem' }}>Rp {o.total_amount?.toLocaleString('id-ID')}</td>
                  <td style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase' }}>{o.payment_method}</td>
                  <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{new Date(o.created_at).toLocaleDateString('id-ID')}</td>
                  <td><span style={{ color: statusColor[o.status] || 'white', fontSize: '0.75rem', fontWeight: 600 }}>{o.status?.toUpperCase()}</span></td>
                  <td>
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                      className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(15,15,31,0.9)', border: '1px solid rgba(139,92,246,0.3)', color: 'white', cursor: 'pointer' }}>
                      {['pending','paid','completed','cancelled','expired'].map(s => <option key={s} value={s} style={{ background: '#0a0a1a' }}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <div className="text-center py-8" style={{ color: 'rgba(255,255,255,0.3)' }}>Loading...</div>}
        {!loading && orders.length === 0 && <div className="text-center py-8" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Tidak ada order</div>}
      </div>
    </div>
  );
}
