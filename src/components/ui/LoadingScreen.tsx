'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setDone(true), 400);
          return 100;
        }
        return p + Math.random() * 12 + 3;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'radial-gradient(ellipse at center, #0d0d2b 0%, #080808 70%)' }}
        >
          {/* Galaxy orb */}
          <div className="relative mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #00c3ff, #8b5cf6, #ec4899, #00c3ff)',
                padding: '2px',
                borderRadius: '50%',
                width: '120px',
                height: '120px',
              }}
            />
            <div className="relative w-28 h-28 rounded-full flex items-center justify-center m-1"
              style={{ background: '#0d0d2b', boxShadow: 'inset 0 0 30px rgba(139,92,246,0.3)' }}>
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center"
              >
                <div style={{ fontFamily: 'Orbitron', fontSize: '0.7rem', color: '#00c3ff', letterSpacing: '0.15em', fontWeight: 700 }}>
                  VALLEY
                </div>
                <div style={{ fontFamily: 'Orbitron', fontSize: '0.55rem', color: '#8b5cf6', letterSpacing: '0.2em' }}>
                  .PEDIA
                </div>
              </motion.div>
            </div>
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontFamily: 'Orbitron', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.2em' }}
            className="gradient-text mb-2"
          >
            VALLEY.PEDIA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.6 }}
            style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}
          >
            INITIALIZING VALLEY.PEDIA
          </motion.p>

          {/* Progress bar */}
          <div className="w-64 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #00c3ff, #8b5cf6, #ec4899)',
                backgroundSize: '200% 100%',
              }}
              animate={{ width: `${Math.min(progress, 100)}%`, backgroundPosition: ['0% 0%', '100% 0%'] }}
              transition={{ width: { duration: 0.1 }, backgroundPosition: { duration: 2, repeat: Infinity } }}
            />
          </div>

          <motion.p
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: '0.75rem', color: '#00c3ff', marginTop: '1rem', letterSpacing: '0.1em' }}
          >
            {Math.min(Math.round(progress), 100)}%
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1 }}
            style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: '2rem', letterSpacing: '0.15em' }}
          >
            PREPARE YOUR EXPERIENCE
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
