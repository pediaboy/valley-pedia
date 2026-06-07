'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Copy, Check, MessageCircle, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';

const REKENING = [
  { bank: 'BCA', no: '1234567890', atas: 'VALLEY PEDIA', icon: '🏦' },
  { bank: 'BRI', no: '009801012345678', atas: 'VALLEY PEDIA', icon: '🏦' },
  { bank: 'Mandiri', no: '1400099887766', atas: 'VALLEY PEDIA', icon: '🏦' },
  { bank: 'Dana', no: '082172222494', atas: 'VALLEY PEDIA', icon: '💙' },
  { bank: 'GoPay', no: '082172222494', atas: 'VALLEY PEDIA', icon: '💚' },
  { bank: 'OVO', no: '082172222494', atas: 'VALLEY PEDIA', icon: '💜' },
  { bank: 'ShopeePay', no: '082172222494', atas: 'VALLEY PEDIA', icon: '🧡' },
];

const WA = '6282172222494';

function pad(n: number) { return n.toString().padStart(2, '0'); }
function rp(n: number) { return 'Rp ' + n.toLocaleString('id-ID'); }
function genUniq(price: number) { return price + Math.floor(Math.random() * 899 + 100); }
function genOrderId() { return `VP-${Date.now()}`; }

function CheckoutContent() {
  const sp = useSearchParams();
  const [step, setStep] = useState<'form'|'invoice'>('form');
  const [form, setForm] = useState({ name: '', whatsapp: '', notes: '' });
  const [product, setProduct] = useState<any>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [selBank, setSelBank] = useState(0);
  const [copied, setCopied] = useState('');
  const [loading, setLoading] = useState(false);
  const [settingsWa, setSettingsWa] = useState(WA);

  const productId = sp.get('product');
  const type = sp.get('type');

  useEffect(() => {
    // Load product info
    if (type === 'room-wangi') {
      const map: Record<string, any> = {
        basic: { name: 'Room Wangi Basic', price: 20000 },
        premium: { name: 'Room Wangi Premium', price: 45000 },
        kyvip: { name: 'Room Wangi KYVIP', price: 75000 },
      };
      setProduct(map[productId || 'basic']);
    } else if (productId) {
      // Fetch from Supabase
      import('@supabase/supabase-js').then(({ createClient }) => {
        const db = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        db.from('products').select('*').eq('id', productId).single().then(({ data }) => {
          if (data) setProduct(data);
        });
        // Load WA from settings
        db.from('settings').select('value').eq('key', 'wa_number').single().then(({ data }) => {
          if (data?.value) setSettingsWa(data.value);
        });
      });
    }
  }, [productId, type]);

  const handleSubmit = async () => {
    if (!form.name || !form.whatsapp || !product) return;
    setLoading(true);
    
    const orderId = genOrderId();
    const uniqueAmount = genUniq(product.price);
    const deadline = new Date(Date.now() + 60 * 60 * 1000);

    // Save to Supabase (non-blocking - jangan block UI)
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const db = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await db.from('orders').insert({
        product_id: productId,
        customer_name: form.name,
        customer_whatsapp: form.whatsapp,
        notes: form.notes,
        payment_method: REKENING[selBank].bank,
        payment_gateway: 'manual',
        status: 'pending',
        total_amount: uniqueAmount,
        order_id: orderId,
      });
    } catch (e) { /* continue even if DB fails */ }

    setInvoice({ orderId, uniqueAmount, deadline });
    setLoading(false);
    setStep('invoice');
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  if (step === 'invoice' && invoice) {
    const dl = new Date(invoice.deadline);
    const waMsg = encodeURIComponent(
      `Halo admin, saya mau konfirmasi pembayaran:\n\n` +
      `📋 Order ID: ${invoice.orderId}\n` +
      `👤 Nama: ${form.name}\n` +
      `📱 WA: ${form.whatsapp}\n` +
      `🎮 Produk: ${product?.name}\n` +
      `💰 Nominal: ${rp(invoice.uniqueAmount)}\n` +
      `🏦 Bank: ${REKENING[selBank].bank} - ${REKENING[selBank].no}\n\n` +
      `Mohon segera dikonfirmasi, terima kasih!`
    );

    return (
      <div style={{ minHeight: '100vh', background: '#080808', padding: '1rem' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', paddingTop: '1.5rem' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <img src="/logo-rw.jpg" alt="Valley Pedia" style={{ width: 72, height: 72, objectFit: 'contain', margin: '0 auto 0.75rem', borderRadius: 12 }} />
            <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)' }}>VALLEY.PEDIA</div>
            <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: '1rem', color: '#00c3ff', marginTop: 4 }}>INVOICE PEMBAYARAN</div>
          </div>

          {/* Order Info */}
          <div style={{ background: 'rgba(0,195,255,0.05)', border: '1px solid rgba(0,195,255,0.2)', borderRadius: 16, padding: '1.2rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>DETAIL PESANAN</div>
            {[
              ['Order ID', invoice.orderId, true],
              ['Produk', product?.name, false],
              ['Nama', form.name, false],
              ['WhatsApp', form.whatsapp, false],
              ['Status', '⏳ Menunggu Pembayaran', false],
            ].map(([label, val, mono]: any) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, gap: 8 }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 500, textAlign: 'right', fontFamily: mono ? 'monospace' : 'inherit' }}>{val}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Orbitron,sans-serif', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>TOTAL TRANSFER</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'Orbitron,sans-serif', fontSize: '1.2rem', fontWeight: 700, color: '#00c3ff' }}>{rp(invoice.uniqueAmount)}</span>
                <button onClick={() => copy(String(invoice.uniqueAmount), 'amt')} style={{ background: 'rgba(0,195,255,0.1)', border: '1px solid rgba(0,195,255,0.3)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: '#00c3ff' }}>
                  {copied === 'amt' ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
            </div>
            <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', textAlign: 'right', marginTop: 4 }}>* Transfer TEPAT sesuai nominal untuk verifikasi otomatis</div>
          </div>

          {/* Pilih Bank */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.2rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>PILIH REKENING TUJUAN</div>
            
            {/* Bank tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {REKENING.map((r, i) => (
                <button key={r.bank} onClick={() => setSelBank(i)} style={{
                  padding: '5px 12px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                  background: selBank === i ? 'rgba(0,195,255,0.15)' : 'rgba(255,255,255,0.04)',
                  border: selBank === i ? '1px solid #00c3ff' : '1px solid rgba(255,255,255,0.1)',
                  color: selBank === i ? '#00c3ff' : 'rgba(255,255,255,0.5)',
                }}>
                  {r.icon} {r.bank}
                </button>
              ))}
            </div>

            {/* Rekening detail */}
            <div style={{ background: 'rgba(0,195,255,0.04)', border: '1px solid rgba(0,195,255,0.15)', borderRadius: 12, padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#00c3ff' }}>{REKENING[selBank].icon} {REKENING[selBank].bank}</span>
              </div>
              
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>NOMOR REKENING / DOMPET</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', letterSpacing: '0.08em', fontFamily: 'monospace' }}>{REKENING[selBank].no}</span>
                  <button onClick={() => copy(REKENING[selBank].no, 'norek')} style={{ background: 'rgba(0,195,255,0.1)', border: '1px solid rgba(0,195,255,0.3)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: '#00c3ff' }}>
                    {copied === 'norek' ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>ATAS NAMA</div>
                <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{REKENING[selBank].atas}</div>
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: '0.85rem 1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 600 }}>Batas Waktu Pembayaran</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>
                {dl.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} pukul {pad(dl.getHours())}.{pad(dl.getMinutes())} WIB
              </div>
            </div>
          </div>

          {/* Warning */}
          <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12, padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', gap: 8 }}>
            <AlertTriangle size={15} style={{ color: '#f87171', flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
              Transfer <strong style={{ color: '#f87171' }}>TEPAT</strong> sesuai nominal termasuk 3 digit angka unik di belakangnya. Order otomatis batal jika melebihi batas waktu.
            </div>
          </div>

          {/* Tombol Konfirmasi WA */}
          <a href={`https://wa.me/${settingsWa || WA}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: 'linear-gradient(135deg, #25d366, #128c7e)',
              borderRadius: 14, padding: '1rem 1.5rem', fontWeight: 700, fontSize: '0.9rem',
              color: '#fff', textDecoration: 'none', marginBottom: '0.75rem',
              boxShadow: '0 0 24px rgba(37,211,102,0.3)',
            }}>
            <MessageCircle size={20} />
            Konfirmasi Pembayaran via WhatsApp
          </a>
          
          <div style={{ textAlign: 'center', fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)', marginTop: 8 }}>
            Admin WA: {settingsWa || WA} • VALLEY.PEDIA
          </div>
        </div>
      </div>
    );
  }

  // Form step
  return (
    <div style={{ minHeight: '100vh', background: '#080808', padding: '1rem' }}>
      <div style={{ maxWidth: 440, margin: '0 auto', paddingTop: '1.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo-rw.jpg" alt="Valley Pedia" style={{ width: 72, height: 72, objectFit: 'contain', margin: '0 auto 0.75rem', borderRadius: 12 }} />
          <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)' }}>VALLEY.PEDIA</div>
          <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: '1rem', color: '#00c3ff', marginTop: 4 }}>CHECKOUT</div>
        </div>

        {product && (
          <div style={{ background: 'rgba(0,195,255,0.05)', border: '1px solid rgba(0,195,255,0.2)', borderRadius: 14, padding: '1rem 1.2rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>PRODUK DIPILIH</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{product.name}</span>
              <span style={{ fontFamily: 'Orbitron,sans-serif', fontSize: '0.95rem', color: '#00c3ff', fontWeight: 700 }}>{rp(product.price)}</span>
            </div>
          </div>
        )}

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>DATA PEMESAN</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Nama Lengkap *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Masukkan nama kamu" className="input-galaxy" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Nomor WhatsApp *</label>
              <input value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="08xxxxxxxxxx" type="tel" className="input-galaxy" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Catatan (opsional)</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="ID in-game, server, info tambahan..." className="input-galaxy" rows={3} style={{ width: '100%', resize: 'none' }} />
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 12, padding: '0.85rem 1rem', marginBottom: '1.25rem', fontSize: '0.73rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
          💡 Setelah klik <strong style={{ color: '#fff' }}>Buat Invoice</strong>, kamu akan mendapat detail rekening + nominal transfer. Konfirmasi ke WhatsApp admin setelah transfer.
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !form.name || !form.whatsapp || !product}
          className="btn-neon"
          style={{
            width: '100%', padding: '1rem', borderRadius: 14, fontWeight: 700, fontSize: '0.9rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: (!form.name || !form.whatsapp || !product) ? 0.45 : 1,
          }}
        >
          {loading ? '⏳ Membuat Invoice...' : '📋 Buat Invoice'}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#00c3ff', fontFamily: 'Orbitron', fontSize: '0.8rem', letterSpacing: '0.2em' }}>LOADING...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
