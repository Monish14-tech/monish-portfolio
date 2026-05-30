import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Environment } from '@react-three/drei';

const CrystalCluster = () => {
  const c1 = useRef();
  const c2 = useRef();
  const c3 = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (c1.current) {
      c1.current.rotation.y = t * 0.5;
      c1.current.rotation.x = Math.sin(t * 0.3) * 0.3;
    }
    if (c2.current) {
      c2.current.rotation.y = -t * 0.35;
      c2.current.rotation.z = Math.cos(t * 0.25) * 0.25;
    }
    if (c3.current) {
      c3.current.rotation.x = t * 0.4;
      c3.current.rotation.y = Math.sin(t * 0.4) * 0.4;
    }
  });

  const crystalMat = (color, ior = 2.2) => (
    <MeshTransmissionMaterial
      color={color}
      thickness={0.4}
      roughness={0}
      transmission={1}
      ior={ior}
      chromaticAberration={0.09}
      distortion={0.15}
      distortionScale={0.2}
      temporalDistortion={0.05}
    />
  );

  return (
    <>
      {/* Main large crystal */}
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8} position={[0, 0.2, 0]}>
        <mesh ref={c1} scale={1.3}>
          <octahedronGeometry args={[1, 0]} />
          {crystalMat('#a78bfa', 2.4)}
        </mesh>
      </Float>

      {/* Right medium crystal */}
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.6} position={[2, -0.3, -0.8]}>
        <mesh ref={c2} scale={0.75}>
          <octahedronGeometry args={[1, 0]} />
          {crystalMat('#f472b6', 2.0)}
        </mesh>
      </Float>

      {/* Left small crystal */}
      <Float speed={2.2} rotationIntensity={0.7} floatIntensity={1} position={[-2, 0.1, -0.5]}>
        <mesh ref={c3} scale={0.55}>
          <octahedronGeometry args={[1, 0]} />
          {crystalMat('#67e8f9', 1.9)}
        </mesh>
      </Float>

      {/* Tiny accent crystal top */}
      <Float speed={3} rotationIntensity={2} floatIntensity={1.5} position={[0.8, 1.6, 0.3]}>
        <mesh scale={0.35}>
          <octahedronGeometry args={[1, 0]} />
          {crystalMat('#fbbf24', 2.1)}
        </mesh>
      </Float>

      {/* Tiny accent crystal bottom */}
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1.2} position={[-0.5, -1.5, 0.2]}>
        <mesh scale={0.3}>
          <octahedronGeometry args={[1, 0]} />
          {crystalMat('#4ade80', 2.0)}
        </mesh>
      </Float>
    </>
  );
};

const Crystal3D = () => {
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={3} color="#a78bfa" />
        <pointLight position={[-5, -5, 5]} intensity={2} color="#f472b6" />
        <pointLight position={[0, 0, 8]} intensity={1.5} color="#67e8f9" />
        <Environment preset="studio" />
        <CrystalCluster />
      </Canvas>
    </div>
  );
};

export default Crystal3D;
