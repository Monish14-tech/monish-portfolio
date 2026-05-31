import { Environment } from '@react-three/drei';
import SceneCanvas from './three/SceneCanvas';
import AnimatedFloat from './three/AnimatedFloat';
import { useCursorParallax } from './three/useCursorParallax';
import { NetworkGlobe, Robot, AIBrain } from './tech/TechShapes';
import { usePerformance } from '../context/PerformanceContext';

const SCENES = {
  globe: { Model: NetworkGlobe, scale: 0.55, position: [0, 0, 0], camera: { position: [0, 0, 3.6], fov: 42 } },
  robot: { Model: Robot, scale: 0.36, position: [0, -0.3, 0], camera: { position: [0, 0.15, 4], fov: 42 } },
  core: { Model: AIBrain, scale: 0.5, position: [0, 0, 0], camera: { position: [0, 0, 3.4], fov: 44 } },
};

const MiniScene = ({ variant }) => {
  const config = SCENES[variant];
  const { enableEnvironment } = usePerformance();
  const groupRef = useCursorParallax({ rotX: 0.12, rotY: 0.2, lerp: 0.06, autoRotateY: 0.025 });

  if (!config) return null;

  const { Model, scale, position } = config;

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={2} color="#a78bfa" />
      <pointLight position={[-3, -2, 3]} intensity={1.4} color="#22d3ee" />
      {enableEnvironment && <Environment preset="city" />}
      <AnimatedFloat speed={1} rotationIntensity={0.08} floatIntensity={0.12}>
        <group position={position}>
          <Model scale={scale} />
        </group>
      </AnimatedFloat>
    </group>
  );
};

const ProjectMini3D = ({ variant }) => {
  const { enableProject3D } = usePerformance();

  if (!enableProject3D) {
    return <div className={`project-model project-model--fallback project-model--${variant}`} aria-hidden />;
  }

  return (
    <div className="project-model">
      <SceneCanvas camera={SCENES[variant]?.camera} interactive={false} lazy>
        <MiniScene variant={variant} />
      </SceneCanvas>
    </div>
  );
};

export default ProjectMini3D;
