import React, { useEffect, useRef } from 'react';
import './Background.css';

const Background = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animFrame;
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let smoothMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ripples = [];

    // ─── Resize ───
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ─── Mouse ───
    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    // ─── Click ripple ───
    const onClick = (e) => {
      ripples.push({ x: e.clientX, y: e.clientY, r: 0, maxR: 180, alpha: 0.6 });
    };
    window.addEventListener('click', onClick);

    // ─── Particles ───
    const N = 90;
    const particles = Array.from({ length: N }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      ox: 0, oy: 0, // origin
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.5 + 0.15,
      // color variant: purple, cyan, pink
      color: ['167,139,250', '6,182,212', '236,72,153'][Math.floor(Math.random() * 3)],
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // ─── Draw helpers ───
    const drawOrb = (x, y, r, color, alpha = 1) => {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(${color},${alpha})`);
      grad.addColorStop(0.4, `rgba(${color},${alpha * 0.3})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawGlowLine = (x1, y1, x2, y2, color, alpha) => {
      ctx.strokeStyle = `rgba(${color},${alpha})`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    // ─── Main draw loop ───
    let t = 0;
    const draw = () => {
      t += 0.008;
      const W = canvas.width;
      const H = canvas.height;

      // Smooth mouse follow
      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.06;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.06;

      ctx.clearRect(0, 0, W, H);

      // === 1. Background gradient ===
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, '#050505');
      bgGrad.addColorStop(0.5, '#08080f');
      bgGrad.addColorStop(1, '#050505');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // === 2. Ambient orbs (slow pulse + follow mouse) ===
      const orbPulse = Math.sin(t * 0.5) * 0.015 + 0.07;
      drawOrb(W * 0.15 + smoothMouse.x * 0.04, H * 0.2 + smoothMouse.y * 0.025, 500, '88,28,135', orbPulse);
      drawOrb(W * 0.85 - smoothMouse.x * 0.03, H * 0.75 - smoothMouse.y * 0.02, 420, '6,182,212', orbPulse * 0.8);
      drawOrb(W * 0.5 + Math.sin(t * 0.4) * 80, H * 0.5 + Math.cos(t * 0.3) * 60, 280, '139,92,246', 0.035);
      // Cursor-tracking orb
      drawOrb(smoothMouse.x, smoothMouse.y, 220, '139,92,246', 0.055);
      drawOrb(smoothMouse.x, smoothMouse.y, 80, '196,181,253', 0.07);

      // === 3. Interactive dot grid ===
      const gridSize = 70;
      const cols = Math.ceil(W / gridSize);
      const rows = Math.ceil(H / gridSize);

      for (let col = 0; col <= cols; col++) {
        for (let row = 0; row <= rows; row++) {
          const gx = col * gridSize;
          const gy = row * gridSize;
          const dx = smoothMouse.x - gx;
          const dy = smoothMouse.y - gy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(0, 1 - dist / 200);

          // Dot at intersection
          const dotR = 0.8 + proximity * 2.5;
          const dotAlpha = 0.12 + proximity * 0.6;
          const dotColor = proximity > 0.3
            ? `rgba(167,139,250,${dotAlpha})`
            : `rgba(255,255,255,${dotAlpha * 0.4})`;

          ctx.beginPath();
          ctx.arc(gx, gy, dotR, 0, Math.PI * 2);
          ctx.fillStyle = dotColor;
          ctx.fill();

          // Glow ring on close intersections
          if (proximity > 0.55) {
            ctx.beginPath();
            ctx.arc(gx, gy, dotR * 2.5, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(139,92,246,${proximity * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // === 4. Grid lines (faint) ===
      for (let col = 0; col <= cols; col++) {
        const gx = col * gridSize;
        const lineAlpha = 0.025 + Math.max(0, 1 - Math.abs(smoothMouse.x - gx) / 300) * 0.04;
        ctx.strokeStyle = `rgba(139,92,246,${lineAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let row = 0; row <= rows; row++) {
        const gy = row * gridSize;
        const lineAlpha = 0.025 + Math.max(0, 1 - Math.abs(smoothMouse.y - gy) / 300) * 0.04;
        ctx.strokeStyle = `rgba(6,182,212,${lineAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }

      // === 5. Particles ===
      particles.forEach((p) => {
        const pulseFactor = 0.8 + Math.sin(t * 2 + p.pulsePhase) * 0.2;

        // Mouse repulsion / attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          // Repel
          p.vx -= (dx / dist) * 0.06;
          p.vy -= (dy / dist) * 0.06;
        } else if (dist < 350) {
          // Gentle attract
          p.vx += (dx / dist) * 0.008;
          p.vy += (dy / dist) * 0.008;
        }

        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        // Draw particle with pulse glow
        const finalAlpha = p.alpha * pulseFactor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${finalAlpha})`;
        ctx.fill();

        // Glow halo for bright particles
        if (finalAlpha > 0.45) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * pulseFactor * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color},${finalAlpha * 0.12})`;
          ctx.fill();
        }
      });

      // === 6. Particle connection lines ===
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            const a = 0.12 * (1 - d / 110);
            drawGlowLine(particles[i].x, particles[i].y, particles[j].x, particles[j].y, particles[i].color, a);
          }
        }
      }

      // === 7. Cursor-to-nearby-particle beams ===
      particles.forEach((p) => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          drawGlowLine(mouse.x, mouse.y, p.x, p.y, p.color, 0.18 * (1 - d / 120));
        }
      });

      // === 8. Ripple effects on click ===
      ripples = ripples.filter((rip) => rip.alpha > 0.01);
      ripples.forEach((rip) => {
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(139,92,246,${rip.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner ring
        if (rip.r > 30) {
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.r * 0.6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(6,182,212,${rip.alpha * 0.6})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        rip.r += 3.5;
        rip.alpha *= 0.93;
      });

      // === 9. Flowing aurora lines ===
      for (let i = 0; i < 3; i++) {
        const baseY = H * (0.2 + i * 0.3);
        const amp = 40 + i * 20;
        const freq = 0.003 + i * 0.001;
        const speed = t * (0.4 + i * 0.15);
        const colors = ['139,92,246', '6,182,212', '236,72,153'];

        ctx.beginPath();
        for (let x = 0; x <= W; x += 4) {
          const y = baseY + Math.sin(x * freq + speed) * amp + Math.sin(x * freq * 2.1 + speed * 1.3) * (amp * 0.4);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${colors[i]},0.04)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return <canvas ref={canvasRef} className="bg-canvas" />;
};

export default Background;
