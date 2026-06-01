import React, { useEffect, useRef } from 'react';
import { usePerformance } from '../context/PerformanceContext';
import './Background.css';

const PARTICLE_COUNT = { low: 50, medium: 70, high: 90 };
const STAR_COUNT = { low: 120, medium: 200, high: 320 };
const SHOOT_MAX = { low: 2, medium: 4, high: 6 };
const STAR_COLORS = ['220,230,255', '167,139,250', '103,232,249', '196,181,253', '244,114,182'];

function createStars(count, w, h) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.4 + 0.25,
    alpha: Math.random() * 0.55 + 0.25,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    twinkle: Math.random() * Math.PI * 2,
    depth: Math.random(),
  }));
}

function createParticles(count, w, h) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    r: Math.random() * 1.4 + 0.4,
    alpha: Math.random() * 0.45 + 0.15,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    pulsePhase: Math.random() * Math.PI * 2,
  }));
}

function spawnShootingStar(w, h) {
  const edge = Math.random();
  let x;
  let y;
  if (edge < 0.5) {
    x = Math.random() * w;
    y = Math.random() * h * 0.35;
  } else {
    x = Math.random() * w * 0.6;
    y = Math.random() * h * 0.5;
  }
  return {
    x,
    y,
    len: 50 + Math.random() * 90,
    speed: 0.012 + Math.random() * 0.018,
    angle: Math.PI * 0.28 + (Math.random() - 0.5) * 0.35,
    alpha: 0.7 + Math.random() * 0.3,
    progress: 0,
  };
}

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
    let shootingStars = [];
    let nextShootIn = 1.2 + Math.random() * 2;
    let t = 0;

    const N = PARTICLE_COUNT[tier] ?? 50;
    const frameMinMs = tier === 'low' ? 33 : tier === 'medium' ? 22 : 0;
    let lastDraw = 0;
    let W = window.innerWidth;
    let H = window.innerHeight;

    let stars = createStars(STAR_COUNT[tier] ?? 100, W, H);
    let particles = createParticles(N, W, H);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, tier === 'low' ? 1 : 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = createStars(STAR_COUNT[tier] ?? 100, W, H);
      particles = createParticles(N, W, H);
      shootingStars = [];
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

    const drawShootingStar = (s) => {
      const dist = s.len * s.progress;
      const x2 = s.x + Math.cos(s.angle) * dist;
      const y2 = s.y + Math.sin(s.angle) * dist;
      const tail = Math.max(12, dist * 0.35);
      const x1 = x2 - Math.cos(s.angle) * tail;
      const y1 = y2 - Math.sin(s.angle) * tail;
      const fade = 1 - s.progress;
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.4, `rgba(200,230,255,${s.alpha * fade * 0.5})`);
      grad.addColorStop(1, `rgba(103,232,249,${s.alpha * fade})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x2, y2, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.alpha * fade * 0.9})`;
      ctx.fill();
    };

    const draw = (now = 0) => {
      if (!running) return;

      if (frameMinMs && now - lastDraw < frameMinMs) {
        animFrame = requestAnimationFrame(draw);
        return;
      }
      lastDraw = now;

      t += 0.008;

      smoothMouse.x += (mouse.x - smoothMouse.x) * (tier === 'low' ? 0.04 : 0.06);
      smoothMouse.y += (mouse.y - smoothMouse.y) * (tier === 'low' ? 0.04 : 0.06);

      ctx.clearRect(0, 0, W, H);

      const bgGrad = ctx.createLinearGradient(0, 0, W, H * 0.6);
      bgGrad.addColorStop(0, '#02020f');
      bgGrad.addColorStop(0.45, '#0a0828');
      bgGrad.addColorStop(1, '#030318');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      const orbPulse = Math.sin(t * 0.5) * 0.014 + 0.07;
      drawOrb(W * 0.12, H * 0.18, 500, '79,70,229', orbPulse);
      drawOrb(W * 0.88, H * 0.72, 420, '14,165,233', orbPulse * 0.9);
      drawOrb(W * 0.5, H * 0.45, 380, '192,132,252', orbPulse * 0.55);

      stars.forEach((s) => {
        const tw = 0.65 + Math.sin(t * 1.5 + s.twinkle) * 0.35;
        const size = s.r * (0.85 + s.depth * 0.3);
        ctx.beginPath();
        ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${s.alpha * tw})`;
        ctx.fill();
        if (s.depth > 0.7 && tw > 0.9) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.color},${s.alpha * tw * 0.15})`;
          ctx.fill();
        }
      });

      nextShootIn -= 0.008;
      const shootMax = SHOOT_MAX[tier] ?? 3;
      if (nextShootIn <= 0 && shootingStars.length < shootMax) {
        shootingStars.push(spawnShootingStar(W, H));
        nextShootIn = (tier === 'low' ? 2.8 : tier === 'medium' ? 1.8 : 1.1) + Math.random() * 2.5;
      }

      shootingStars = shootingStars.filter((s) => {
        s.progress += s.speed;
        if (s.progress >= 1) return false;
        drawShootingStar(s);
        return true;
      });

      if (enableHeavyBackground) {
        if (tier === 'high') {
          drawOrb(smoothMouse.x, smoothMouse.y, 140, '103,232,249', 0.05);
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
            ctx.fillStyle = `rgba(103,232,249,${0.06 + proximity * 0.3})`;
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
          ctx.strokeStyle = `rgba(103,232,249,${rip.alpha})`;
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
