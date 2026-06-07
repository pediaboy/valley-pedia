'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Home, List } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const orderId = searchParams.get('order');

  useEffect(() => {
    if (orderId) {
      supabase.from('orders').select('*').eq('id', orderId).single().then(({ data }) => setOrder(data));
    }
  }, [orderId]);

  return (
    <div className="min-h-screen px-4 py-8 max-w-md mx-auto flex items-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }} className="w-full">
        <div className="glass-card rounded-2xl p-8 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(74,222,128,0.15)', border: '2px solid rgba(74,222,128,0.4)', boxShadow: '0 0 40px rgba(74,222,128,0.2)' }}>
            <CheckCircle size={40} style={{ color: '#4ade80' }} />
          </motion.div>

          <h1 style={{ fontFamily: 'Orbitron', fontSize: '1.2rem', fontWeight: 800, color: '#4ade80', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            TRANSACTION COMPLETED
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '2rem' }}>
            Pembayaran berhasil diproses
          </p>

          {order && (
            <div className="text-left space-y-3 mb-6 p-4 rounded-xl" style={{ background: 'rgba(15,15,31,0.8)', border: '1px solid rgba(139,92,246,0.2)' }}>
              {[
                { label: 'ITEM', value: order.product_id || 'Room Wangi' },
                { label: 'NOMINAL', value: `Rp ${order.total_amount?.toLocaleString('id-ID')}` },
                { label: 'TANGGAL', value: new Date(order.created_at).toLocaleDateString('id-ID') },
                { label: 'ORDER ID', value: order.order_id },
                { label: 'PAYMENT', value: order.payment_method?.toUpperCase() },
                { label: 'STATUS', value: order.status?.toUpperCase() },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center">
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>{item.label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: item.label === 'STATUS' ? '#4ade80' : 'rgba(255,255,255,0.9)' }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => router.push('/')}
              className="btn-neon flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
              <Home size={16} /> Ke Home
            </button>
            <button onClick={() => router.push('/admin/dashboard')}
              className="btn-purple flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
              <List size={16} /> Lihat Order
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div style={{ color: '#4ade80', fontFamily: 'Orbitron', fontSize: '0.8rem', letterSpacing: '0.2em' }}>LOADING...</div></div>}><PaymentSuccessContent /></Suspense>;
}
