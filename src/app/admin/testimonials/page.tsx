'use client';
import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const emptyForm = { name: '', rating: 5, comment: '', image_url: '' };

export default function AdminTestimonials() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetch(); }, []);
  const fetch = async () => { const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false }); setItems(data || []); };

  const handleSubmit = async () => {
    setLoading(true);
    await supabase.from('testimonials').insert(form);
    setLoading(false); setShowForm(false); setForm({ ...emptyForm }); fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus?')) return;
    await supabase.from('testimonials').delete().eq('id', id); fetch();
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: 'Orbitron', fontSize: '1.1rem', fontWeight: 800 }} className="gradient-text">Testimoni</h1>
        <button onClick={() => setShowForm(true)} className="btn-purple px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> Tambah
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 style={{ fontFamily: 'Orbitron', fontSize: '0.9rem', color: '#00c3ff' }}>TAMBAH TESTIMONI</h2>
              <button onClick={() => setShowForm(false)}><X size={18} style={{ color: 'rgba(255,255,255,0.5)' }} /></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Nama" className="input-galaxy" />
              <input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} placeholder="URL Foto (opsional)" className="input-galaxy" />
              <div>
                <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.5rem' }}>Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => setForm(p => ({ ...p, rating: s }))}>
                      <Star size={24} fill={s <= form.rating ? '#f59e0b' : 'none'} style={{ color: '#f59e0b' }} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea value={form.comment} onChange={e => setForm(p => ({ ...p, comment: e.target.value }))} placeholder="Komentar..." className="input-galaxy" rows={4} style={{ resize: 'none' }} />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-xl text-sm" style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>Batal</button>
              <button onClick={handleSubmit} disabled={loading} className="btn-purple flex-1 py-2 rounded-xl text-sm font-semibold">{loading ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(t => (
          <div key={t.id} className="glass-card rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden" style={{ background: 'linear-gradient(135deg, #8b5cf6, #00c3ff)' }}>
                  {t.image_url ? <img src={t.image_url} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold">{t.name?.[0]}</div>
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.name}</div>
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= t.rating ? '#f59e0b' : 'none'} style={{ color: '#f59e0b' }} />)}</div>
                </div>
              </div>
              <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><Trash2 size={14} /></button>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', lineHeight: '1.6' }}>{t.comment}</p>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Belum ada testimoni</div>}
    </div>
  );
}
