'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function TestimonialPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [avg, setAvg] = useState(0);

  useEffect(() => {
    supabase.from('testimonials').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setTestimonials(data || []);
      if (data?.length) setAvg(data.reduce((a, b) => a + b.rating, 0) / data.length);
    });
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="section-title gradient-text mb-2">Testimonial</h1>
        <div className="flex items-center justify-center gap-2 mb-1">
          <span style={{ fontFamily: 'Orbitron', fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>{avg.toFixed(1)}</span>
          <div className="flex">
            {[1,2,3,4,5].map(s => <Star key={s} size={20} fill={s <= Math.round(avg) ? '#f59e0b' : 'none'} style={{ color: '#f59e0b' }} />)}
          </div>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{testimonials.length} Review</p>
      </motion.div>

      <div className="space-y-4 mb-8">
        {testimonials.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card glass-card-hover rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #00c3ff)' }}>
                {t.image_url ? <img src={t.image_url} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                    {t.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>{new Date(t.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex mb-2">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= t.rating ? '#f59e0b' : 'none'} style={{ color: '#f59e0b' }} />)}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: '1.6' }}>{t.comment}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-16">
          <Star size={40} style={{ color: 'rgba(255,255,255,0.2)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Orbitron', fontSize: '0.8rem' }}>Belum ada testimonial</p>
        </div>
      )}
    </div>
  );
}
