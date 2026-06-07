'use client';
import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminBanners() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', image_url: '', link: '', active: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchBanners(); }, []);
  const fetchBanners = async () => { const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false }); setItems(data || []); };

  const handleSubmit = async () => {
    setLoading(true);
    await supabase.from('banners').insert(form);
    setLoading(false); setShowForm(false); setForm({ title: '', image_url: '', link: '', active: true }); fetchBanners();
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('banners').update({ active: !active }).eq('id', id); fetchBanners();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus banner?')) return;
    await supabase.from('banners').delete().eq('id', id); fetchBanners();
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: 'Orbitron', fontSize: '1.1rem', fontWeight: 800 }} className="gradient-text">Banner</h1>
        <button onClick={() => setShowForm(true)} className="btn-purple px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"><Plus size={16} /> Tambah Banner</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 style={{ fontFamily: 'Orbitron', fontSize: '0.9rem', color: '#00c3ff' }}>TAMBAH BANNER</h2>
              <button onClick={() => setShowForm(false)}><X size={18} style={{ color: 'rgba(255,255,255,0.5)' }} /></button>
            </div>
            <div className="space-y-3">
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Judul Banner" className="input-galaxy" />
              <input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} placeholder="URL Gambar" className="input-galaxy" />
              <input value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} placeholder="Link (opsional)" className="input-galaxy" />
              {form.image_url && <img src={form.image_url} alt="preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />}
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-xl text-sm" style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>Batal</button>
              <button onClick={handleSubmit} disabled={loading} className="btn-purple flex-1 py-2 rounded-xl text-sm font-semibold">{loading ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(banner => (
          <div key={banner.id} className="glass-card rounded-xl overflow-hidden">
            <div style={{ height: '140px', background: 'rgba(139,92,246,0.1)', position: 'relative' }}>
              {banner.image_url && <img src={banner.image_url} alt={banner.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold`}
                style={{ background: banner.active ? 'rgba(74,222,128,0.2)' : 'rgba(107,114,128,0.2)', color: banner.active ? '#4ade80' : '#6b7280', border: `1px solid ${banner.active ? 'rgba(74,222,128,0.4)' : 'rgba(107,114,128,0.4)'}` }}>
                {banner.active ? 'Aktif' : 'Nonaktif'}
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{banner.title}</div>
                {banner.link && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{banner.link}</div>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(banner.id, banner.active)} className="p-1.5 rounded-lg" style={{ background: 'rgba(0,195,255,0.1)', color: '#00c3ff' }}>
                  {banner.active ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => handleDelete(banner.id)} className="p-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Belum ada banner</div>}
    </div>
  );
}
