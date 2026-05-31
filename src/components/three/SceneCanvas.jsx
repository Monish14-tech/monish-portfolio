import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { usePerformance } from '../../context/PerformanceContext';

function detectWebGL() {
  if (typeof document === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

const SceneCanvas = ({
  children,
  camera = { position: [0, 0, 5], fov: 45 },
  className = '',
  interactive = true,
  style,
  lazy = true,
  rootMargin = '120px',
  releaseWhenHidden = false,
}) => {
  const containerRef = useRef(null);
  const [webglOk] = useState(detectWebGL);
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
      if (lazy && visible) setIsMounted(true);
      else if (lazy && releaseWhenHidden && !visible) setIsMounted(false);
    };

    const observer = new IntersectionObserver(onIntersect, {
      rootMargin,
      threshold: 0.01,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [lazy, rootMargin, releaseWhenHidden]);

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
      else if (lazy && releaseWhenHidden && !visible) setIsMounted(false);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [lazy, releaseWhenHidden]);

  const shouldRender = webglOk && (lazy ? isMounted : true);
  const frameloop = inView && tabActive ? 'always' : 'never';

  const onCreated = useCallback(({ gl }) => {
    gl.setClearColor(0x000000, 0);
    gl.setPixelRatio(Math.min(window.devicePixelRatio, dpr[1]));
    gl.powerPreference = 'high-performance';
  }, [dpr]);

  if (!webglOk) {
    return <div className={`scene-canvas scene-canvas--fallback${className ? ` ${className}` : ''}`} />;
  }

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
