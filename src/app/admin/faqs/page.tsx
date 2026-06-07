'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { X, Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminFaqs() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '', order: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchFaqs(); }, []);
  const fetchFaqs = async () => { const { data } = await supabase.from('faqs').select('*').order('order'); setItems(data || []); };

  const handleSubmit = async () => {
    setLoading(true);
    await supabase.from('faqs').insert({ ...form, order: items.length });
    setLoading(false); setShowForm(false); setForm({ question: '', answer: '', order: 0 }); fetchFaqs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus?')) return;
    await supabase.from('faqs').delete().eq('id', id); fetchFaqs();
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: 'Orbitron', fontSize: '1.1rem', fontWeight: 800 }} className="gradient-text">FAQ</h1>
        <button onClick={() => setShowForm(true)} className="btn-purple px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"><Plus size={16} /> Tambah</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between mb-4">
              <h2 style={{ fontFamily: 'Orbitron', fontSize: '0.9rem', color: '#00c3ff' }}>TAMBAH FAQ</h2>
              <button onClick={() => setShowForm(false)}><X size={18} style={{ color: 'rgba(255,255,255,0.5)' }} /></button>
            </div>
            <div className="space-y-3">
              <input value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} placeholder="Pertanyaan" className="input-galaxy" />
              <textarea value={form.answer} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))} placeholder="Jawaban..." className="input-galaxy" rows={5} style={{ resize: 'none' }} />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-xl text-sm" style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>Batal</button>
              <button onClick={handleSubmit} disabled={loading} className="btn-purple flex-1 py-2 rounded-xl text-sm font-semibold">{loading ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="glass-card rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#00c3ff', marginBottom: '0.5rem' }}>Q: {item.question}</div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', lineHeight: '1.6' }}>A: {item.answer}</p>
              </div>
              <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Belum ada FAQ</div>}
    </div>
  );
}
