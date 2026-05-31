import { Environment } from '@react-three/drei';
import SceneCanvas from './three/SceneCanvas';
import AnimatedFloat from './three/AnimatedFloat';
import { useCursorParallax } from './three/useCursorParallax';
import { AIBrain } from './tech/TechShapes';
import { usePerformance } from '../context/PerformanceContext';

const AIScene = () => {
  const groupRef = useCursorParallax({ rotX: 0.2, rotY: 0.3, lerp: 0.06, autoRotateY: 0.03 });
  const { tier, enableEnvironment } = usePerformance();
  const scale = tier === 'low' ? 0.62 : tier === 'medium' ? 0.7 : 0.78;

  return (
    <group ref={groupRef}>
      <AnimatedFloat speed={1} rotationIntensity={0.08} floatIntensity={0.15}>
        <AIBrain scale={scale} />
      </AnimatedFloat>
      {enableEnvironment && <Environment preset="city" />}
    </group>
  );
};

const Crystal3D = () => {
  const { release3DWhenHidden } = usePerformance();

  return (
  <SceneCanvas camera={{ position: [0, 0, 4.8], fov: 46 }} interactive={false} lazy releaseWhenHidden={release3DWhenHidden}>
    <ambientLight intensity={0.45} />
    <pointLight position={[4, 4, 4]} intensity={2.5} color="#f472b6" />
    <pointLight position={[-4, -2, 4]} intensity={1.8} color="#22d3ee" />
    <AIScene />
  </SceneCanvas>
  );
};

export default Crystal3D;
