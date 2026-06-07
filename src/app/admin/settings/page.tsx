'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Check, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const FIELDS = [
  { key: 'wa_number', label: 'Nomor WhatsApp Admin (tanpa +)', placeholder: '6282172222494', type: 'text' },
  { key: 'telegram_username', label: 'Username Telegram Admin', placeholder: '@riqqboy', type: 'text' },
  { key: 'instagram_url', label: 'URL Instagram', placeholder: 'https://instagram.com/...', type: 'text' },
  { key: 'tiktok_url', label: 'URL TikTok', placeholder: 'https://tiktok.com/...', type: 'text' },
  { key: 'telegram_bot_token', label: 'Telegram Bot Token', placeholder: '123456:ABC...', type: 'password' },
  { key: 'site_name', label: 'Nama Website', placeholder: 'VALLEY.PEDIA', type: 'text' },
  { key: 'site_tagline', label: 'Tagline Website', placeholder: 'Platform Gaming Premium', type: 'text' },
  { key: 'hero_title', label: 'Hero Title Homepage', placeholder: 'VALLEY.PEDIA', type: 'text' },
  { key: 'hero_subtitle', label: 'Hero Subtitle Homepage', placeholder: 'Platform Gaming Premium Terpercaya', type: 'text' },
  { key: 'stat_orders', label: 'Statistik - Total Order', placeholder: '10.750+', type: 'text' },
  { key: 'stat_users', label: 'Statistik - User Aktif', placeholder: '5.2K+', type: 'text' },
  { key: 'stat_rating', label: 'Statistik - Rating', placeholder: '4.9 ★', type: 'text' },
];

export default function AdminSettings() {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Guard
    if (typeof window !== 'undefined' && !sessionStorage.getItem('vp_admin')) {
      router.replace('/admin');
      return;
    }

    // Load settings dari Supabase
    import('@supabase/supabase-js').then(({ createClient }) => {
      const db = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      db.from('settings').select('key, value').then(({ data, error }) => {
        if (data) {
          const map: Record<string, string> = {};
          data.forEach((d: any) => { map[d.key] = d.value; });
          setValues(map);
        }
        if (error) setError('Gagal load settings: ' + error.message);
        setLoading(false);
      });
    });
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const db = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      // Upsert satu per satu untuk reliabilitas
      const upserts = Object.entries(values)
        .filter(([_, v]) => v !== undefined)
        .map(([key, value]) => ({ key, value }));
      
      const { error } = await db.from('settings').upsert(upserts, { onConflict: 'key' });
      
      if (error) {
        setError('Error: ' + error.message);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (e: any) {
      setError('Error: ' + e.message);
    }
    setSaving(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080808', padding: '1.5rem 1rem' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>VALLEY.PEDIA</div>
            <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: '0.95rem', color: '#00c3ff' }}>Pengaturan</div>
          </div>
          <button onClick={() => router.push('/admin/dashboard')} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', cursor: 'pointer',
          }}>
            <ArrowLeft size={13} /> Dashboard
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#f87171' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'Orbitron,sans-serif', fontSize: '0.75rem', letterSpacing: '0.15em' }}>LOADING...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FIELDS.map(f => (
              <div key={f.key} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', marginBottom: 8, letterSpacing: '0.05em' }}>
                  {f.label}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={f.type === 'password' && !showPass[f.key] ? 'password' : 'text'}
                    value={values[f.key] || ''}
                    onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="input-galaxy"
                    style={{ width: '100%', paddingRight: f.type === 'password' ? '3rem' : undefined }}
                  />
                  {f.type === 'password' && (
                    <button type="button" onClick={() => setShowPass(s => ({ ...s, [f.key]: !s[f.key] }))}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
                      {showPass[f.key] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className={saved ? 'btn-purple' : 'btn-neon'}
          style={{
            width: '100%', marginTop: '1.5rem', padding: '1rem', borderRadius: 14,
            fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: (saving || loading) ? 'not-allowed' : 'pointer',
            opacity: (saving || loading) ? 0.7 : 1,
          }}
        >
          {saved ? <><Check size={16} /> TERSIMPAN!</> : saving ? 'MENYIMPAN...' : <><Save size={16} /> SIMPAN SEMUA PERUBAHAN</>}
        </button>
      </div>
    </div>
  );
}
