'use client';
import { useEffect, useRef } from 'react';

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.2,
      alpha: Math.random(),
      delta: (Math.random() * 0.008) + 0.002,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
    }));

    // Nebula
    const drawNebula = () => {
      const grad1 = ctx.createRadialGradient(
        canvas.width * 0.2, canvas.height * 0.4, 0,
        canvas.width * 0.2, canvas.height * 0.4, canvas.width * 0.35
      );
      grad1.addColorStop(0, 'rgba(139,92,246,0.06)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const grad2 = ctx.createRadialGradient(
        canvas.width * 0.8, canvas.height * 0.3, 0,
        canvas.width * 0.8, canvas.height * 0.3, canvas.width * 0.3
      );
      grad2.addColorStop(0, 'rgba(0,195,255,0.04)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawNebula();

      stars.forEach(s => {
        s.alpha += s.delta;
        if (s.alpha >= 1 || s.alpha <= 0) s.delta *= -1;
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha * 0.8})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: 'radial-gradient(ellipse at 20% 50%, #0d0d2b 0%, #080808 60%)',
      }}
    />
  );
}
