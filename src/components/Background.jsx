import React, { useEffect, useRef } from 'react';
import { usePerformance } from '../context/PerformanceContext';
import './Background.css';

const PARTICLE_COUNT = { low: 32, medium: 50, high: 70 };

const Background = () => {
  const canvasRef = useRef(null);
  const { tier, enableHeavyBackground } = usePerformance();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    let animFrame;
    let running = true;
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let smoothMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ripples = [];

    const N = PARTICLE_COUNT[tier] ?? 50;
    const frameMinMs = tier === 'low' ? 33 : tier === 'medium' ? 22 : 0;
    let lastDraw = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, tier === 'low' ? 1 : 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onClick = (e) => {
      if (tier !== 'low') {
        ripples.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 0.5 });
      }
    };

    const onVis = () => {
      running = !document.hidden;
      if (running) animFrame = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('click', onClick);
    document.addEventListener('visibilitychange', onVis);

    const particles = Array.from({ length: N }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.12,
      color: ['167,139,250', '6,182,212', '236,72,153'][Math.floor(Math.random() * 3)],
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    const drawOrb = (x, y, r, color, alpha = 1) => {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(${color},${alpha})`);
      grad.addColorStop(0.5, `rgba(${color},${alpha * 0.2})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawGlowLine = (x1, y1, x2, y2, color, alpha) => {
      ctx.strokeStyle = `rgba(${color},${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    let t = 0;

    const draw = (now = 0) => {
      if (!running) return;

      if (frameMinMs && now - lastDraw < frameMinMs) {
        animFrame = requestAnimationFrame(draw);
        return;
      }
      lastDraw = now;

      t += 0.008;
      const W = window.innerWidth;
      const H = window.innerHeight;

      smoothMouse.x += (mouse.x - smoothMouse.x) * (tier === 'low' ? 0.04 : 0.06);
      smoothMouse.y += (mouse.y - smoothMouse.y) * (tier === 'low' ? 0.04 : 0.06);

      ctx.clearRect(0, 0, W, H);

      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, '#050505');
      bgGrad.addColorStop(0.5, '#08080f');
      bgGrad.addColorStop(1, '#050505');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      const orbPulse = Math.sin(t * 0.5) * 0.012 + 0.06;
      drawOrb(W * 0.2, H * 0.25, 420, '88,28,135', orbPulse);
      drawOrb(W * 0.8, H * 0.7, 360, '6,182,212', orbPulse * 0.85);

      if (enableHeavyBackground) {
        drawOrb(W * 0.5, H * 0.5, 240, '139,92,246', 0.03);
        if (tier === 'high') {
          drawOrb(smoothMouse.x, smoothMouse.y, 160, '139,92,246', 0.04);
        }

        const gridSize = tier === 'high' ? 80 : 100;
        const cols = Math.ceil(W / gridSize);
        const rows = Math.ceil(H / gridSize);

        for (let col = 0; col <= cols; col += 1) {
          for (let row = 0; row <= rows; row += 1) {
            const gx = col * gridSize;
            const gy = row * gridSize;
            const dist = Math.hypot(smoothMouse.x - gx, smoothMouse.y - gy);
            const proximity = Math.max(0, 1 - dist / 180);
            if (proximity < 0.08) continue;

            ctx.beginPath();
            ctx.arc(gx, gy, 0.8 + proximity * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(167,139,250,${0.08 + proximity * 0.35})`;
            ctx.fill();
          }
        }
      }

      particles.forEach((p) => {
        if (enableHeavyBackground && tier !== 'low') {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120 && dist > 0) {
            p.vx -= (dx / dist) * 0.04;
            p.vy -= (dy / dist) * 0.04;
          }
        }

        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        const pulse = 0.85 + Math.sin(t * 2 + p.pulsePhase) * 0.15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha * pulse})`;
        ctx.fill();
      });

      if (enableHeavyBackground && tier !== 'low') {
        const step = tier === 'medium' ? 2 : 1;
        for (let i = 0; i < N; i += step) {
          for (let j = i + step; j < N; j += step) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d = Math.hypot(dx, dy);
            if (d < 100) {
              const a = 0.1 * (1 - d / 100);
              drawGlowLine(particles[i].x, particles[i].y, particles[j].x, particles[j].y, particles[i].color, a);
            }
          }
        }
      }

      if (tier === 'high') {
        ripples = ripples.filter((r) => r.alpha > 0.02);
        ripples.forEach((rip) => {
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(139,92,246,${rip.alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          rip.r += 3;
          rip.alpha *= 0.92;
        });
      }

      animFrame = requestAnimationFrame(draw);
    };

    animFrame = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [tier, enableHeavyBackground]);

  return <canvas ref={canvasRef} className="bg-canvas" />;
};

export default Background;
