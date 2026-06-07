'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';

const ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || 'valleypedia2025';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem('vp_admin', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Username atau password salah.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#000008' }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,195,255,0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%', maxWidth: 400,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0,195,255,0.15)',
          borderRadius: 20,
          padding: '2.5rem 2rem',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(0,195,255,0.1)',
            border: '1px solid rgba(0,195,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            <Shield size={28} style={{ color: '#00c3ff' }} />
          </div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.7rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
            VALLEY.PEDIA
          </div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.1rem', letterSpacing: '0.15em', color: '#00c3ff' }}>
            ADMIN PANEL
          </div>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>USERNAME</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" autoComplete="username" className="input-galaxy w-full mt-1" required />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••" autoComplete="current-password" className="input-galaxy w-full mt-1" style={{ paddingRight: '3rem' }} required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '0.6rem 1rem', fontSize: '0.8rem', color: '#f87171', textAlign: 'center' }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-neon w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-2" style={{ opacity: loading ? 0.7 : 1 }}>
            <Lock size={16} />
            {loading ? 'AUTHENTICATING...' : 'MASUK'}
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
          SECURED ADMIN ACCESS • VALLEY.PEDIA © 2025
        </div>
      </motion.div>
    </div>
  );
}
