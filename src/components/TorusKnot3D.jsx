import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, MeshTransmissionMaterial } from '@react-three/drei';

const KnotMesh = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.x = t * 0.18;
      meshRef.current.rotation.y = t * 0.28;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1, 0.35, 128, 32, 2, 3]} />
        <MeshTransmissionMaterial
          color="#8b5cf6"
          thickness={0.6}
          roughness={0}
          transmission={1}
          ior={1.8}
          chromaticAberration={0.06}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
        />
      </mesh>
    </Float>
  );
};

const TorusKnot3D = () => {
  return (
    <div style={{ width: '100%', height: '280px' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 5]} intensity={3} color="#a78bfa" />
        <pointLight position={[-5, -5, -5]} intensity={2} color="#ec4899" />
        <pointLight position={[0, 0, 8]} intensity={1} color="#06b6d4" />
        <Environment preset="studio" />
        <KnotMesh />
      </Canvas>
    </div>
  );
};

export default TorusKnot3D;
