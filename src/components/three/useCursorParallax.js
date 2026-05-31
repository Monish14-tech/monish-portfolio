import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePerformance } from '../../context/PerformanceContext';

export function useCursorParallax({
  rotX = 0.22,
  rotY = 0.32,
  posX = 0,
  posY = 0,
  lerp = 0.07,
  autoRotateY = 0,
} = {}) {
  const groupRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const { enableParallax } = usePerformance();

  useEffect(() => {
    if (!enableParallax) return undefined;

    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [enableParallax]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();
    const rotateSpeed = autoRotateY || 0.04;

    if (enableParallax) {
      smooth.current.x += (mouse.current.x - smooth.current.x) * lerp;
      smooth.current.y += (mouse.current.y - smooth.current.y) * lerp;
      groupRef.current.rotation.y = smooth.current.x * rotY + t * rotateSpeed;
      groupRef.current.rotation.x = smooth.current.y * rotX;
      if (posX) groupRef.current.position.x = smooth.current.x * posX;
      if (posY) groupRef.current.position.y = smooth.current.y * posY;
    } else {
      groupRef.current.rotation.y = t * rotateSpeed;
    }
  });

  return groupRef;
}
