import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 80;

function makeParticle(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    r: Math.random() * 1.4 + 0.4,
    opacity: Math.random() * 0.45 + 0.1,
  };
}

export default function ParticleField() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
        makeParticle(canvas.width, canvas.height)
      );
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);

      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        // wrap around
        if (p.x < -5)  p.x = w + 5;
        if (p.x > w+5) p.x = -5;
        if (p.y < -5)  p.y = h + 5;
        if (p.y > h+5) p.y = -5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden
    />
  );
}
