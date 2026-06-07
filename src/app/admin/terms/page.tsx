'use client';
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminTerms() {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('settings').select('value').eq('key', 'terms_content').single().then(({ data }) => {
      if (data?.value) setContent(data.value);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('settings').upsert({ key: 'terms_content', value: content }, { onConflict: 'key' });
    setSaving(false);
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: 'Orbitron', fontSize: '1.1rem', fontWeight: 800 }} className="gradient-text">Syarat & Ketentuan</h1>
        <button onClick={handleSave} disabled={saving} className="btn-purple px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Save size={16} /> {saved ? 'Tersimpan ✓' : saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
      <div className="glass-card rounded-xl p-4">
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>Gunakan # untuk H1, ## untuk H2, - untuk bullet point</p>
        <textarea value={content} onChange={e => setContent(e.target.value)}
          className="input-galaxy w-full" rows={30} style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }}
          placeholder="# Syarat & Ketentuan&#10;&#10;## 1. Umum&#10;..." />
      </div>
    </div>
  );
}
