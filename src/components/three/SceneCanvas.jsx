import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { usePerformance } from '../../context/PerformanceContext';

const SceneCanvas = ({
  children,
  camera = { position: [0, 0, 5], fov: 45 },
  className = '',
  interactive = true,
  style,
  lazy = true,
}) => {
  const containerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(!lazy);
  const [inView, setInView] = useState(!lazy);
  const [tabActive, setTabActive] = useState(
    () => typeof document === 'undefined' || !document.hidden
  );
  const { dpr, antialias } = usePerformance();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const onIntersect = ([entry]) => {
      const visible = entry.isIntersecting;
      setInView(visible);
      if (lazy) setIsMounted(visible);
    };

    const observer = new IntersectionObserver(onIntersect, {
      rootMargin: lazy ? '120px' : '80px',
      threshold: 0.01,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [lazy]);

  useEffect(() => {
    const onVis = () => {
      const active = !document.hidden;
      setTabActive(active);
      if (!active) return;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      setInView(visible);
      if (lazy && visible) setIsMounted(true);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [lazy]);

  const shouldRender = lazy ? isMounted : true;
  const frameloop = inView && tabActive ? 'always' : 'never';

  const onCreated = useCallback(({ gl }) => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, dpr[1]));
    gl.powerPreference = 'high-performance';
  }, [dpr]);

  return (
    <div
      ref={containerRef}
      className={`scene-canvas${interactive ? ' scene-canvas--interactive' : ''}${className ? ` ${className}` : ''}`}
      style={style}
    >
      {shouldRender && (
        <Canvas
          camera={camera}
          dpr={dpr}
          frameloop={frameloop}
          gl={{
            antialias,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            preserveDrawingBuffer: false,
          }}
          onCreated={onCreated}
        >
          {children}
        </Canvas>
      )}
    </div>
  );
};

export default SceneCanvas;
