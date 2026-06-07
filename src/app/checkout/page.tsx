'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Copy, Check, MessageCircle, Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ===== REKENING PEMBAYARAN =====
const REKENING = [
  { bank: 'BCA', no: '1234567890', atas: 'VALLEY PEDIA' },
  { bank: 'BRI', no: '009801012345678', atas: 'VALLEY PEDIA' },
  { bank: 'Dana', no: '082172222494', atas: 'VALLEY PEDIA' },
  { bank: 'GoPay', no: '082172222494', atas: 'VALLEY PEDIA' },
  { bank: 'OVO', no: '082172222494', atas: 'VALLEY PEDIA' },
];

const WA_CONFIRM = '6282172222494';

function pad(n: number) { return n.toString().padStart(2, '0'); }
function formatRp(n: number) { return 'Rp ' + n.toLocaleString('id-ID'); }

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', whatsapp: '', notes: '' });
  const [product, setProduct] = useState<any>(null);
  const [step, setStep] = useState<'form' | 'invoice'>('form');
  const [order, setOrder] = useState<any>(null);
  const [copied, setCopied] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState(0);

  const productId = searchParams.get('product');
  const type = searchParams.get('type');

  useEffect(() => {
    if (productId && !type) {
      supabase.from('products').select('*').eq('id', productId).single().then(({ data }) => setProduct(data));
    } else if (type === 'room-wangi') {
      const prices: Record<string, any> = {
        basic:   { name: 'Room Wangi Basic',   price: 20000 },
        premium: { name: 'Room Wangi Premium', price: 45000 },
        kyvip:   { name: 'Room Wangi KYVIP',   price: 75000 },
      };
      setProduct(prices[productId || 'basic']);
    }
  }, [productId, type]);

  const uniqueAmount = product ? product.price + Math.floor(Math.random() * 899 + 100) : 0;

  const handleSubmit = async () => {
    if (!form.name || !form.whatsapp) return;
    setLoading(true);
    const orderId = `VP-${Date.now()}`;
    const now = new Date();
    const deadline = new Date(now.getTime() + 60 * 60 * 1000); // +1 jam
    const { data, error } = await supabase.from('orders').insert({
      product_id: productId,
      customer_name: form.name,
      customer_whatsapp: form.whatsapp,
      notes: form.notes,
      payment_method: REKENING[selectedBank].bank,
      payment_gateway: 'manual',
      status: 'pending',
      total_amount: uniqueAmount,
      order_id: orderId,
    }).select().single();
    setLoading(false);
    if (!error && data) {
      setOrder({ ...data, orderId, deadline, uniqueAmount });
      setStep('invoice');
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const waMessage = order
    ? encodeURIComponent(
        `Halo kak, saya mau konfirmasi pembayaran:\n\n` +
        `Order ID: ${order.orderId}\n` +
        `Nama: ${form.name}\n` +
        `Produk: ${product?.name}\n` +
        `Nominal: ${formatRp(order.uniqueAmount)}\n` +
        `Bank: ${REKENING[selectedBank].bank}\n\n` +
        `Mohon dikonfirmasi, terima kasih!`
      )
    : '';

  if (step === 'invoice' && order) {
    const deadline = new Date(order.deadline);
    return (
      <div className="min-h-screen px-4 py-10" style={{ background: '#000008' }}>
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,195,255,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 480, margin: '0 auto' }}>

          {/* Header invoice */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{
            background: 'rgba(0,195,255,0.05)', border: '1px solid rgba(0,195,255,0.2)',
            borderRadius: 16, padding: '1.5rem', marginBottom: '1rem', textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
              INVOICE PEMBAYARAN
            </div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1rem', color: '#00c3ff', marginBottom: 4 }}>
              VALLEY.PEDIA
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
              Order ID: <span style={{ color: '#fff', fontWeight: 600 }}>{order.orderId}</span>
            </div>
          </motion.div>

          {/* Detail order */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '1.2rem', marginBottom: '1rem',
          }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>DETAIL PESANAN</div>
            {[
              { label: 'Produk', value: product?.name },
              { label: 'Nama', value: form.name },
              { label: 'WhatsApp', value: form.whatsapp },
              { label: 'Tanggal', value: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) },
              { label: 'Status', value: '⏳ Menunggu Pembayaran' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
                <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>{row.value}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>TOTAL</span>
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.1rem', color: '#00c3ff', fontWeight: 700 }}>
                {formatRp(order.uniqueAmount)}
              </span>
            </div>
            <div style={{ marginTop: 6, textAlign: 'right', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
              * Nominal unik untuk verifikasi otomatis
            </div>
          </motion.div>

          {/* Pilih bank */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '1.2rem', marginBottom: '1rem',
          }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>PILIH REKENING TUJUAN</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {REKENING.map((r, i) => (
                <button key={r.bank} onClick={() => setSelectedBank(i)} style={{
                  padding: '6px 16px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                  background: selectedBank === i ? 'rgba(0,195,255,0.2)' : 'rgba(255,255,255,0.04)',
                  border: selectedBank === i ? '1px solid #00c3ff' : '1px solid rgba(255,255,255,0.1)',
                  color: selectedBank === i ? '#00c3ff' : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.2s',
                }}>{r.bank}</button>
              ))}
            </div>

            {/* Info rekening */}
            <div style={{
              background: 'rgba(0,195,255,0.05)', border: '1px solid rgba(0,195,255,0.15)',
              borderRadius: 12, padding: '1rem',
            }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>BANK / E-WALLET</div>
              <div style={{ fontSize: '1rem', color: '#00c3ff', fontWeight: 700, marginBottom: 12 }}>{REKENING[selectedBank].bank}</div>

              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>NOMOR REKENING</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', letterSpacing: '0.1em' }}>
                  {REKENING[selectedBank].no}
                </span>
                <button onClick={() => copyText(REKENING[selectedBank].no, 'norek')} style={{
                  background: 'rgba(0,195,255,0.1)', border: '1px solid rgba(0,195,255,0.3)',
                  borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: '#00c3ff',
                }}>
                  {copied === 'norek' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>

              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>ATAS NAMA</div>
              <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, marginBottom: 16 }}>{REKENING[selectedBank].atas}</div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>TRANSFER NOMINAL TEPAT</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.3rem', fontWeight: 700, color: '#00c3ff' }}>
                    {formatRp(order.uniqueAmount)}
                  </span>
                  <button onClick={() => copyText(String(order.uniqueAmount), 'nominal')} style={{
                    background: 'rgba(0,195,255,0.1)', border: '1px solid rgba(0,195,255,0.3)',
                    borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: '#00c3ff',
                  }}>
                    {copied === 'nominal' ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                  Transfer TEPAT sesuai nominal agar terverifikasi otomatis
                </div>
              </div>
            </div>
          </motion.div>

          {/* Deadline */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{
            background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 12, padding: '0.8rem 1rem', marginBottom: '1rem',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <Clock size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>Batas Waktu Pembayaran</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                {deadline.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} pukul {pad(deadline.getHours())}.{pad(deadline.getMinutes())} WIB
              </div>
            </div>
          </motion.div>

          {/* Warning */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }} style={{
            background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: 12, padding: '0.8rem 1rem', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <AlertTriangle size={16} style={{ color: '#f87171', flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              Pastikan transfer <strong style={{ color: '#f87171' }}>TEPAT</strong> sesuai nominal termasuk angka uniknya. Order otomatis batal jika melewati batas waktu.
            </div>
          </motion.div>

          {/* Tombol konfirmasi WA */}
          <motion.a
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            href={`https://wa.me/${WA_CONFIRM}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: 'linear-gradient(135deg, #25d366, #128c7e)',
              borderRadius: 14, padding: '1rem', fontWeight: 700,
              fontSize: '0.9rem', color: '#fff', textDecoration: 'none',
              boxShadow: '0 0 20px rgba(37,211,102,0.3)', marginBottom: '1rem',
            }}
          >
            <MessageCircle size={20} />
            Konfirmasi Pembayaran via WhatsApp
          </motion.a>

          <div style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
            Setelah transfer, klik tombol di atas untuk konfirmasi ke admin.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: '#000008' }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,195,255,0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>
            VALLEY.PEDIA
          </div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.2rem', color: '#00c3ff' }}>CHECKOUT</div>
        </div>

        {/* Produk */}
        {product && (
          <div style={{
            background: 'rgba(0,195,255,0.05)', border: '1px solid rgba(0,195,255,0.15)',
            borderRadius: 14, padding: '1rem 1.2rem', marginBottom: '1.5rem',
          }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>DETAIL PRODUK</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{product.name}</span>
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.95rem', color: '#00c3ff', fontWeight: 700 }}>
                {formatRp(product.price)}
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem',
        }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>DATA PEMESAN</div>
          <div className="space-y-4">
            <div>
              <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Nama Lengkap *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Masukkan nama kamu" className="input-galaxy w-full mt-1" />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Nomor WhatsApp *</label>
              <input value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="08xxxxxxxxxx" className="input-galaxy w-full mt-1" type="tel" />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Catatan (opsional)</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Misal: ID in-game, server, dll." className="input-galaxy w-full mt-1" rows={3} style={{ resize: 'none' }} />
            </div>
          </div>
        </div>

        {/* Info pembayaran */}
        <div style={{
          background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)',
          borderRadius: 12, padding: '0.9rem 1.2rem', marginBottom: '1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)',
        }}>
          💡 Setelah klik <strong style={{ color: '#fff' }}>Buat Invoice</strong>, kamu akan mendapat detail rekening dan nominal transfer yang sudah dikonfirmasi ke WhatsApp admin.
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !form.name || !form.whatsapp}
          className="btn-neon w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2"
          style={{ opacity: (!form.name || !form.whatsapp) ? 0.5 : 1 }}
        >
          {loading ? 'Membuat Invoice...' : '📋 Buat Invoice'}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div style={{ color: '#00c3ff', fontFamily: 'Orbitron', fontSize: '0.8rem', letterSpacing: '0.2em' }}>LOADING...</div>
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
