'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building2, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const paymentMethods = [
  { id: 'qris', label: 'QRIS', icon: '⚡', gateway: 'midtrans' },
  { id: 'dana', label: 'DANA', icon: '💙', gateway: 'midtrans' },
  { id: 'ovo', label: 'OVO', icon: '💜', gateway: 'midtrans' },
  { id: 'gopay', label: 'GoPay', icon: '💚', gateway: 'midtrans' },
  { id: 'shopeepay', label: 'ShopeePay', icon: '🧡', gateway: 'midtrans' },
  { id: 'linkaja', label: 'LinkAja', icon: '❤️', gateway: 'midtrans' },
  { id: 'bca', label: 'VA BCA', icon: '🏦', gateway: 'xendit' },
  { id: 'bni', label: 'VA BNI', icon: '🏦', gateway: 'xendit' },
  { id: 'bri', label: 'VA BRI', icon: '🏦', gateway: 'xendit' },
  { id: 'mandiri', label: 'VA Mandiri', icon: '🏦', gateway: 'xendit' },
];

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', whatsapp: '', notes: '' });
  const [selectedPayment, setSelectedPayment] = useState('');
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const productId = searchParams.get('product');
  const type = searchParams.get('type');

  useEffect(() => {
    if (productId && !type) {
      supabase.from('products').select('*').eq('id', productId).single().then(({ data }) => setProduct(data));
    } else if (type === 'room-wangi') {
      const prices: Record<string, any> = {
        basic: { name: 'Room Wangi Basic', price: 20000 },
        premium: { name: 'Room Wangi Premium', price: 45000 },
        kyvip: { name: 'Room Wangi KYVIP', price: 75000 },
      };
      setProduct(prices[productId || 'basic']);
    }
  }, [productId, type]);

  const handleSubmit = async () => {
    if (!form.name || !form.whatsapp || !selectedPayment) return;
    setLoading(true);
    const orderId = `VP-${Date.now()}`;
    const { data, error } = await supabase.from('orders').insert({
      product_id: productId,
      customer_name: form.name,
      customer_whatsapp: form.whatsapp,
      notes: form.notes,
      payment_method: selectedPayment,
      payment_gateway: paymentMethods.find(p => p.id === selectedPayment)?.gateway,
      status: 'pending',
      total_amount: product?.price || 0,
      order_id: orderId,
    }).select().single();
    setLoading(false);
    if (!error && data) router.push(`/payment-success?order=${data.id}`);
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title gradient-text mb-6">Checkout</h1>

        {/* Product Summary */}
        {product && (
          <div className="glass-card rounded-xl p-4 mb-5">
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>DETAIL PRODUK</div>
            <div className="flex justify-between items-center">
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{product.name}</span>
              <span style={{ color: '#00c3ff', fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.9rem' }}>
                Rp {product.price?.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(139,92,246,0.2)' }}>
              <div className="flex justify-between items-center">
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Total</span>
                <span style={{ color: '#00c3ff', fontFamily: 'Orbitron', fontWeight: 800 }}>
                  Rp {product.price?.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="glass-card rounded-xl p-4 mb-5 space-y-4">
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>DATA PEMESAN</div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '0.5rem' }}>Nama Lengkap *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Masukkan nama kamu" className="input-galaxy" />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '0.5rem' }}>Nomor WhatsApp *</label>
            <input value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
              placeholder="08xxxxxxxxxx" className="input-galaxy" type="tel" />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '0.5rem' }}>Catatan (opsional)</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Catatan tambahan..." className="input-galaxy" rows={3} style={{ resize: 'none' }} />
          </div>
        </div>

        {/* Payment */}
        <div className="glass-card rounded-xl p-4 mb-6">
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '1rem' }}>PILIH METODE PEMBAYARAN</div>
          <div className="space-y-2">
            {paymentMethods.map(pm => (
              <button key={pm.id} onClick={() => setSelectedPayment(pm.id)}
                className={`payment-method w-full ${selectedPayment === pm.id ? 'selected' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{pm.icon}</span>
                  <div className="text-left">
                    <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{pm.label}</div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>via {pm.gateway}</div>
                  </div>
                </div>
                {selectedPayment === pm.id && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: '#00c3ff' }}>
                    <Check size={12} style={{ color: '#000' }} />
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="mt-3 text-center" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
            Powered by 💳 Midtrans & Xendit
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading || !form.name || !form.whatsapp || !selectedPayment}
          className="btn-purple w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2"
          style={{ opacity: (!form.name || !form.whatsapp || !selectedPayment) ? 0.5 : 1 }}>
          {loading ? 'Memproses...' : '💳 Bayar Sekarang'}
        </button>
      </motion.div>
    </div>
  );
}

export default function CheckoutPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div style={{ color: '#00c3ff', fontFamily: 'Orbitron', fontSize: '0.8rem', letterSpacing: '0.2em' }}>LOADING...</div></div>}><CheckoutForm /></Suspense>;
}
