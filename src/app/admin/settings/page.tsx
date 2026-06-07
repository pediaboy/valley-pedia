'use client';
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const defaultSettings = [
  { key: 'wa_number', label: 'Nomor WhatsApp (tanpa +)', placeholder: '628xxxxxxxxxx' },
  { key: 'telegram_username', label: 'Username Telegram', placeholder: '@valleypedia' },
  { key: 'instagram_url', label: 'URL Instagram', placeholder: 'https://instagram.com/...' },
  { key: 'tiktok_url', label: 'URL TikTok', placeholder: 'https://tiktok.com/...' },
  { key: 'midtrans_client_key', label: 'Midtrans Client Key', placeholder: 'Client-Key-...' },
  { key: 'xendit_public_key', label: 'Xendit Public Key', placeholder: 'xnd_public_...' },
  { key: 'telegram_bot_token', label: 'Telegram Bot Token', placeholder: '1234567:ABC...' },
  { key: 'telegram_chat_id', label: 'Telegram Chat ID (Admin)', placeholder: '-100xxxxxxxxx' },
];

export default function AdminSettings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('settings').select('key, value').then(({ data }) => {
      if (data) setValues(Object.fromEntries(data.map(d => [d.key, d.value])));
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const upserts = Object.entries(values).map(([key, value]) => ({ key, value }));
    await supabase.from('settings').upsert(upserts, { onConflict: 'key' });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: 'Orbitron', fontSize: '1.1rem', fontWeight: 800 }} className="gradient-text">Pengaturan</h1>
        <button onClick={handleSave} disabled={saving} className="btn-purple px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Save size={16} /> {saved ? 'Tersimpan ✓' : saving ? 'Menyimpan...' : 'Simpan Semua'}
        </button>
      </div>
      <div className="space-y-4">
        {defaultSettings.map(s => (
          <div key={s.key} className="glass-card rounded-xl p-4">
            <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.5rem' }}>{s.label}</label>
            <input value={values[s.key] || ''} onChange={e => setValues(p => ({ ...p, [s.key]: e.target.value }))}
              placeholder={s.placeholder} className="input-galaxy" type={s.key.includes('key') || s.key.includes('token') ? 'password' : 'text'} />
          </div>
        ))}
      </div>
    </div>
  );
}
