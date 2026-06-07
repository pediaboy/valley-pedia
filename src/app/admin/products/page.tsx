'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const emptyForm = { name: '', price: '', description: '', hero: '', skin_count: '', rank: '', server: '', status: 'ready', category: 'buy-sell', images: [] as string[] };

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const data = { ...form, price: Number(form.price), skin_count: Number(form.skin_count) };
    if (editing) {
      await supabase.from('products').update(data).eq('id', editing);
    } else {
      await supabase.from('products').insert(data);
    }
    setLoading(false);
    setShowForm(false);
    setEditing(null);
    setForm({ ...emptyForm });
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus produk ini?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const handleEdit = (p: any) => {
    setForm({ ...p, price: String(p.price), skin_count: String(p.skin_count) });
    setEditing(p.id);
    setShowForm(true);
  };

  const statusColor: Record<string, string> = { ready: '#4ade80', sold: '#ef4444' };

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: 'Orbitron', fontSize: '1.1rem', fontWeight: 800 }} className="gradient-text">Manajemen Produk</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ ...emptyForm }); }}
          className="btn-purple px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> Tambah Produk
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontFamily: 'Orbitron', fontSize: '0.9rem', color: '#00c3ff' }}>{editing ? 'EDIT PRODUK' : 'TAMBAH PRODUK'}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} style={{ color: 'rgba(255,255,255,0.5)' }} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Nama Produk', type: 'text', placeholder: 'Nama akun...' },
                { key: 'price', label: 'Harga (Rp)', type: 'number', placeholder: '100000' },
                { key: 'hero', label: 'Hero Utama', type: 'text', placeholder: 'Fanny, Gusion...' },
                { key: 'skin_count', label: 'Jumlah Skin', type: 'number', placeholder: '50' },
                { key: 'rank', label: 'Rank', type: 'text', placeholder: 'Mythic, Legend...' },
                { key: 'server', label: 'Server', type: 'text', placeholder: 'ID, PH...' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.5rem' }}>{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} className="input-galaxy" />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.5rem' }}>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="input-galaxy">
                  <option value="ready" style={{ background: '#0a0a1a' }}>Ready</option>
                  <option value="sold" style={{ background: '#0a0a1a' }}>Sold</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.5rem' }}>Kategori</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-galaxy">
                  <option value="buy-sell" style={{ background: '#0a0a1a' }}>Buy / Sell Account</option>
                  <option value="room-wangi" style={{ background: '#0a0a1a' }}>Room Wangi</option>
                </select>
              </div>
              <div className="col-span-2">
                <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.5rem' }}>Deskripsi</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Deskripsi produk..." className="input-galaxy" rows={4} style={{ resize: 'none' }} />
              </div>
              <div className="col-span-2">
                <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.5rem' }}>URL Gambar (satu per baris)</label>
                <textarea value={form.images.join('\n')} onChange={e => setForm(p => ({ ...p, images: e.target.value.split('\n').filter(Boolean) }))}
                  placeholder="https://..." className="input-galaxy" rows={3} style={{ resize: 'none' }} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl text-sm"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>Batal</button>
              <button onClick={handleSubmit} disabled={loading} className="btn-purple flex-1 py-3 rounded-xl text-sm font-semibold">
                {loading ? 'Menyimpan...' : 'Simpan Produk'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Product Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="table-galaxy">
          <thead>
            <tr><th>Produk</th><th>Harga</th><th>Rank</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>{p.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{p.hero} • {p.skin_count} skin</div>
                </td>
                <td style={{ color: '#00c3ff', fontFamily: 'Orbitron', fontSize: '0.8rem' }}>Rp {p.price?.toLocaleString('id-ID')}</td>
                <td style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>{p.rank}</td>
                <td><span style={{ color: statusColor[p.status], fontSize: '0.75rem', fontWeight: 600 }}>{p.status?.toUpperCase()}</span></td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg" style={{ background: 'rgba(0,195,255,0.1)', color: '#00c3ff' }}><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Belum ada produk</div>
        )}
      </div>
    </div>
  );
}
