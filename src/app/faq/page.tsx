'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const defaultFaqs = [
  { question: 'Apa itu Room Wangi?', answer: 'Room Wangi adalah layanan bot yang membantu kamu bermain di room khusus dengan musuh yang mudah dikalahkan, sehingga MMR kamu naik dengan cepat dan konsisten.' },
  { question: 'Apakah aman?', answer: 'Ya, layanan kami 100% aman dan tidak melanggar ToS game. Kami menggunakan metode yang sudah teruji dan anti banned.' },
  { question: 'Support iOS?', answer: 'Ya! Semua layanan kami support untuk pengguna iOS maupun Android. Tidak ada perbedaan fitur.' },
  { question: 'Berapa lama proses pengerjaan?', answer: 'Proses aktivasi biasanya memakan waktu 5-15 menit setelah pembayaran dikonfirmasi. Tim kami aktif 24 jam.' },
  { question: 'Apakah bisa refund?', answer: 'Refund dapat dilakukan dalam kondisi tertentu sesuai Syarat & Ketentuan yang berlaku. Hubungi tim kami via WhatsApp untuk proses refund.' },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState(defaultFaqs);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    supabase.from('faqs').select('*').order('order', { ascending: true }).then(({ data }) => {
      if (data?.length) setFaqs(data.map(d => ({ question: d.question, answer: d.answer })));
    });
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="section-title gradient-text mb-2">FAQ</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Pertanyaan yang sering diajukan</p>
      </motion.div>

      <div className="space-y-3 mb-10">
        {faqs.map((faq, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="accordion-item">
            <button className="accordion-header w-full text-left" onClick={() => setOpen(open === i ? null : i)}>
              <span className="text-sm font-medium pr-4">{faq.question}</span>
              {open === i ? <Minus size={16} style={{ color: '#00c3ff', flexShrink: 0 }} /> : <Plus size={16} style={{ color: '#8b5cf6', flexShrink: 0 }} />}
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}>
                  <div className="accordion-content">{faq.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="glass-card rounded-xl p-6 text-center">
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '1rem' }}>Masih ada pertanyaan?</p>
        <a href="/contact" className="btn-purple inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold">
          <MessageCircle size={16} /> Hubungi Kami
        </a>
      </motion.div>
    </div>
  );
}
