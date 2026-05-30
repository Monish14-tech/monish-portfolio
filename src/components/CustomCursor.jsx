import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './CustomCursor.css';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('');

  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  // Tight spring for the reticle dot
  const dotX = useSpring(cursorX, { damping: 30, stiffness: 900 });
  const dotY = useSpring(cursorY, { damping: 30, stiffness: 900 });

  // Medium spring for the bracket ring
  const ringX = useSpring(cursorX, { damping: 35, stiffness: 220 });
  const ringY = useSpring(cursorY, { damping: 35, stiffness: 220 });

  // Loose spring for the outer glow
  const glowX = useSpring(cursorX, { damping: 50, stiffness: 90 });
  const glowY = useSpring(cursorY, { damping: 50, stiffness: 90 });

  useEffect(() => {
    const onMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onOver = (e) => {
      const target = e.target;
      const isBtn = target.closest('button') || target.tagName === 'BUTTON';
      const isLink = target.closest('a') || target.tagName === 'A';
      const isInteractive = target.classList.contains('interactive');

      if (isBtn || isLink || isInteractive) {
        setIsHovering(true);
        if (isLink) setCursorLabel('OPEN');
        else setCursorLabel('');
      } else {
        setIsHovering(false);
        setCursorLabel('');
      }
    };

    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const reticleScale = isClicking ? 0.6 : isHovering ? 1.7 : 1;
  const reticleOpacity = isHovering ? 1 : 0.75;

  return (
    <>
      {/* Outer glow halo — slowest */}
      <motion.div
        className="cursor-glow"
        style={{ translateX: '-50%', translateY: '-50%', x: glowX, y: glowY }}
        animate={{ opacity: isHovering ? 0.7 : 0.35, scale: isHovering ? 1.6 : 1 }}
        transition={{ duration: 0.35 }}
      />

      {/* Targeting reticle (bracket square) — medium speed */}
      <motion.div
        className="cursor-ring"
        style={{ translateX: '-50%', translateY: '-50%', x: ringX, y: ringY }}
        animate={{
          scale: reticleScale,
          opacity: reticleOpacity,
          rotate: isHovering ? 45 : 0,
        }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        {/* Top-right bracket */}
        <span className="cursor-bracket-tr" />
        {/* Bottom-left bracket */}
        <span className="cursor-bracket-bl" />
        {cursorLabel && (
          <motion.span
            className="cursor-label"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {cursorLabel}
          </motion.span>
        )}
      </motion.div>

      {/* Center dot — fastest */}
      <motion.div
        className="cursor-dot"
        style={{ translateX: '-50%', translateY: '-50%', x: dotX, y: dotY }}
        animate={{
          scale: isClicking ? 2.5 : isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.12 }}
      />
    </>
  );
};

export default CustomCursor;
