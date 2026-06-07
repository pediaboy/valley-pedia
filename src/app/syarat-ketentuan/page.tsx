'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const defaultContent = `
# Syarat & Ketentuan VALLEY.PEDIA

## 1. Umum
Dengan menggunakan layanan VALLEY.PEDIA, Anda menyetujui syarat dan ketentuan yang berlaku.

## 2. Layanan
- Semua layanan bersifat digital dan tidak dapat dikembalikan setelah diproses.
- VALLEY.PEDIA berhak menolak pesanan yang mencurigakan.
- Harga dapat berubah sewaktu-waktu tanpa pemberitahuan.

## 3. Pembayaran
- Pembayaran harus dilakukan dalam waktu 30 menit setelah order dibuat.
- Order yang melewati batas waktu akan otomatis dibatalkan.
- Bukti pembayaran wajib disimpan hingga layanan selesai.

## 4. Refund
- Refund hanya dapat dilakukan jika layanan belum diproses.
- Proses refund memakan waktu 1-3 hari kerja.
- Refund akan dikembalikan ke metode pembayaran yang sama.

## 5. Tanggung Jawab
- VALLEY.PEDIA tidak bertanggung jawab atas kerugian yang disebabkan oleh kesalahan pengguna.
- Pengguna bertanggung jawab atas keamanan akun mereka.

## 6. Privasi
- Data pribadi Anda akan dijaga kerahasiaannya.
- Kami tidak akan membagikan data Anda kepada pihak ketiga.

## Hubungi Kami
Jika ada pertanyaan, hubungi kami melalui WhatsApp atau Telegram.
`;

export default function SyaratPage() {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    supabase.from('settings').select('value').eq('key', 'terms_content').single().then(({ data }) => {
      if (data?.value) setContent(data.value);
    });
  }, []);

  const formatted = content.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i} style={{ fontFamily: 'Orbitron', fontSize: '1rem', fontWeight: 700, color: '#00c3ff', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{line.slice(3)}</h2>;
    if (line.startsWith('# ')) return <h1 key={i} style={{ fontFamily: 'Orbitron', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }} className="gradient-text">{line.slice(2)}</h1>;
    if (line.startsWith('- ')) return <li key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: '1.8', marginLeft: '1.5rem', marginBottom: '0.25rem' }}>{line.slice(2)}</li>;
    if (line.trim()) return <p key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: '1.8', marginBottom: '0.5rem' }}>{line}</p>;
    return <br key={i} />;
  });

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <div className="prose">{formatted}</div>
        </div>
      </motion.div>
    </div>
  );
}
