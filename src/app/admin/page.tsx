'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Credentials: bisa di-override via env variable di Vercel
  const ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USER || 'admin';
  const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || 'pedia123';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 500));
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem('vp_admin', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Username atau password salah.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: '#080808' }}>
      {/* BG */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,195,255,0.08) 0%, transparent 60%)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          width: '100%', maxWidth: 400,
          background: 'rgba(15,15,31,0.9)',
          border: '1px solid rgba(0,195,255,0.18)',
          borderRadius: 20,
          padding: '2.5rem 2rem',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%', margin: '0 auto 1rem',
            background: 'rgba(0,195,255,0.1)',
            border: '1px solid rgba(0,195,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={26} style={{ color: '#00c3ff' }} />
          </div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
            VALLEY.PEDIA
          </div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1rem', letterSpacing: '0.15em', color: '#00c3ff' }}>
            ADMIN PANEL
          </div>
        </div>

        <form onSubmit={handleLogin}>
          {/* Username */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              required
              className="input-galaxy"
              style={{ width: '100%' }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="input-galaxy"
                style={{ width: '100%', paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)',
                  display: 'flex', alignItems: 'center',
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10, padding: '0.65rem 1rem', marginBottom: '1rem',
              fontSize: '0.78rem', color: '#f87171', textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-neon"
            style={{
              width: '100%', padding: '0.85rem', borderRadius: 12,
              fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <Lock size={15} />
            {loading ? 'AUTHENTICATING...' : 'MASUK'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.6rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em' }}>
          SECURED ADMIN ACCESS • VALLEY.PEDIA © 2025
        </div>
      </motion.div>
    </div>
  );
}
