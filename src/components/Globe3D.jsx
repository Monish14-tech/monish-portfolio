import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import SceneCanvas from './three/SceneCanvas';
import AnimatedFloat from './three/AnimatedFloat';
import { useCursorParallax } from './three/useCursorParallax';
import { NetworkGlobe } from './tech/TechShapes';
import { usePerformance } from '../context/PerformanceContext';

const NetworkScene = () => {
  const groupRef = useCursorParallax({ rotX: 0.15, rotY: 0.25, lerp: 0.06, autoRotateY: 0.03 });
  const floatRef = useRef();
  const { tier } = usePerformance();
  const scale = tier === 'low' ? 0.72 : tier === 'medium' ? 0.82 : 0.92;

  useFrame((state) => {
    if (floatRef.current && tier !== 'low') {
      floatRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      {tier === 'high' && (
        <Stars radius={50} depth={35} count={350} factor={3} saturation={0.2} fade speed={0.3} />
      )}
      <group ref={floatRef}>
        <AnimatedFloat speed={0.6} rotationIntensity={0.05} floatIntensity={0.08}>
          <NetworkGlobe scale={scale} />
        </AnimatedFloat>
      </group>
    </group>
  );
};

const Globe3D = () => {
  const { release3DWhenHidden } = usePerformance();

  return (
    <SceneCanvas camera={{ position: [0, 0, 4], fov: 46 }} interactive={false} lazy releaseWhenHidden={release3DWhenHidden}>
      <ambientLight intensity={0.35} />
      <pointLight position={[6, 6, 3]} intensity={2.2} color="#818cf8" />
      <pointLight position={[-5, -4, -3]} intensity={1.5} color="#f472b6" />
      <NetworkScene />
    </SceneCanvas>
  );
};

export default Globe3D;
