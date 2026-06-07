'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const defaultFaqs = [
  {
    question: 'Apa itu Room Wangi dan bagaimana cara kerjanya?',
    answer: 'Room Wangi adalah layanan bot khusus yang mempertemukan kamu dengan bot di room terpisah sehingga kamu bisa farming MMR dengan lebih efisien. Sistem kami tidak menggunakan script berbahaya — metode yang dipakai sudah diuji berbulan-bulan dan tidak pernah ada kasus banned. Begitu kamu order dan pembayaran dikonfirmasi, tim kami langsung setup akses dalam hitungan menit. Kamu tidak perlu install apapun atau memberikan password akun game kamu.',
  },
  {
    question: 'Apakah layanan ini aman dan tidak melanggar ToS?',
    answer: 'Pertanyaan ini paling sering masuk dan kami mengerti kenapa. Jawaban singkatnya: aman. Kami tidak menyentuh akun kamu secara langsung dan tidak menggunakan third-party software yang bisa terdeteksi sistem anti-cheat. Metode Room Wangi sudah dipakai ribuan user sejak platform ini berdiri. Sampai sekarang, tidak ada satupun laporan banned dari user aktif kami yang mengikuti panduan penggunaan. Tapi ya, seperti layanan gaming manapun, selalu ada risiko kecil yang tidak bisa dikontrol 100% — makanya kami transparan soal ini.',
  },
  {
    question: 'Support iOS atau hanya Android?',
    answer: 'Support dua-duanya. Tidak ada perbedaan fitur antara user iOS dan Android. Kalau kamu pakai iPhone, iPad, Android low-end, atau emulator PC pun tidak masalah. Yang penting koneksi internet kamu stabil saat sesi berlangsung. Kalau ada kendala teknis terkait device, langsung WA kami dan tim support akan bantu troubleshoot.',
  },
  {
    question: 'Berapa lama aktivasi setelah bayar?',
    answer: 'Biasanya 5–15 menit setelah konfirmasi pembayaran diterima. Tim kami aktif dari pagi sampai malam hari (07.00–23.00 WIB). Di luar jam tersebut, konfirmasi masuk ke queue dan diproses pertama kali saat tim aktif kembali. Makanya kami sarankan kirim bukti transfer segera setelah bayar supaya antrian kamu masuk lebih awal. Untuk order yang masuk malam, estimasi aktivasi biasanya pagi hari berikutnya paling lambat jam 9.',
  },
  {
    question: 'Gimana cara konfirmasi pembayaran?',
    answer: 'Setelah transfer, kamu akan diarahkan ke WhatsApp admin kami di 082172222494. Format konfirmasi sudah otomatis terisi dari halaman invoice — kamu tinggal klik kirim. Sertakan screenshot bukti transfer supaya proses verifikasi lebih cepat. Nominal transfer harus tepat sesuai yang tertera di invoice (termasuk angka uniknya) agar sistem bisa mencocokkan pembayaran kamu secara otomatis.',
  },
  {
    question: 'Kenapa nominalnya ada angka uniknya?',
    answer: 'Angka unik di bagian belakang nominal (contoh: Rp 20.847 bukan Rp 20.000) itu bukan biaya tambahan — itu kode identifikasi otomatis untuk order kamu. Dengan nominal unik ini, tim kami bisa langsung tahu transfer mana milik kamu tanpa perlu konfirmasi manual berkepanjangan. Angka uniknya kecil, paling selisih ratusan rupiah, jadi tidak ada yang dirugikan.',
  },
  {
    question: 'Bisa refund kalau tidak puas?',
    answer: 'Refund bisa dilakukan dalam kondisi tertentu. Kalau layanan kami gagal diaktivasi dalam waktu 24 jam setelah konfirmasi pembayaran tanpa ada penjelasan dari tim kami, kamu berhak minta refund penuh. Tapi kalau layanan sudah aktif dan berjalan, refund tidak berlaku. Untuk kasus khusus seperti gangguan teknis dari sisi kami, kami biasanya menawarkan perpanjangan masa aktif sebagai kompensasi. Semua proses refund ditangani via WhatsApp dan diproses dalam 1–3 hari kerja.',
  },
  {
    question: 'Apakah ada paket jangka panjang atau diskon?',
    answer: 'Ada. Kalau kamu order lebih dari 1 bulan sekaligus atau join sebagai member langganan, kami bisa kasih harga lebih murah dari harga satuan. Untuk info promo terbaru dan harga bundling, tanyakan langsung ke WhatsApp kami karena promonya sering berganti. Sesekali ada juga flash sale yang diumumkan di channel Telegram kami — worth it untuk follow supaya tidak ketinggalan.',
  },
  {
    question: 'Joki Rank beda dengan Room Wangi?',
    answer: 'Iya, beda. Room Wangi itu kamu main sendiri tapi di room yang sudah disiapkan agar lebih mudah naik MMR. Joki Rank itu tim kami yang main di akun kamu sampai target rank tercapai. Keduanya punya risiko masing-masing — untuk Joki Rank kami minta kamu ubah password sementara dan kembalikan setelah selesai sebagai keamanan bersama. Semua detail dan prosedur joki akan dijelaskan lebih lengkap setelah order dikonfirmasi.',
  },
  {
    question: 'Bisa dihubungi kalau ada masalah teknis mendadak?',
    answer: 'Bisa. WA admin kami di 082172222494 aktif setiap hari. Untuk masalah teknis mendadak yang butuh respons cepat, sebut saja di pesan pertama bahwa ini "urgent" supaya diprioritaskan. Kami juga punya bot Telegram untuk cek status order kamu secara otomatis kapanpun. Tim support kami tidak sempurna tapi kami komit untuk merespons semua pesan dalam waktu yang wajar.',
  },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState(defaultFaqs);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    supabase.from('faqs').select('*').order('order', { ascending: true }).then(({ data }) => {
      if (data?.length) setFaqs(data.map((d: any) => ({ question: d.question, answer: d.answer })));
    });
  }, []);

  return (
    <div className="min-h-screen px-4 py-16" style={{ background: '#000008' }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,195,255,0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
            VALLEY.PEDIA
          </div>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.6rem', color: '#00c3ff', marginBottom: 12 }}>FAQ</h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Hal-hal yang paling sering ditanyakan sebelum order. Kalau pertanyaan kamu belum terjawab di sini, langsung WA kami.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: open === i ? '1px solid rgba(0,195,255,0.25)' : '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14,
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1.1rem 1.3rem', background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', gap: 12,
                }}
              >
                <span style={{ fontSize: '0.88rem', color: open === i ? '#00c3ff' : '#fff', fontWeight: 500, lineHeight: 1.5 }}>
                  {faq.question}
                </span>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: open === i ? 'rgba(0,195,255,0.15)' : 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: open === i ? '#00c3ff' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s',
                }}>
                  {open === i ? <Minus size={14} /> : <Plus size={14} />}
                </div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      padding: '0 1.3rem 1.2rem', fontSize: '0.83rem',
                      color: 'rgba(255,255,255,0.55)', lineHeight: 1.8,
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      paddingTop: '1rem',
                    }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
            Masih ada yang mau ditanyain?
          </p>
          <a
            href="https://wa.me/6282172222494?text=Halo%20Valley.Pedia%2C%20saya%20punya%20pertanyaan%20mengenai%20layanan"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #25d366, #128c7e)',
              color: '#fff', padding: '0.75rem 2rem', borderRadius: 12,
              fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
              boxShadow: '0 0 16px rgba(37,211,102,0.25)',
            }}
          >
            <MessageCircle size={16} />
            Chat WhatsApp Admin
          </a>
        </div>
      </div>
    </div>
  );
}
