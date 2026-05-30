import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

const GeometryGroup = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Left — Icosahedron */}
      <Float speed={3} rotationIntensity={2} floatIntensity={1} position={[-2.8, 0.2, 0]}>
        <mesh>
          <icosahedronGeometry args={[0.85, 0]} />
          <MeshDistortMaterial
            color="#8b5cf6"
            distort={0.25}
            speed={2.5}
            roughness={0.05}
            metalness={0.9}
          />
        </mesh>
      </Float>

      {/* Center — Octahedron (largest) */}
      <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1.5} position={[0, 0.4, 0]}>
        <mesh>
          <octahedronGeometry args={[1.1, 0]} />
          <MeshDistortMaterial
            color="#ec4899"
            distort={0.15}
            speed={1.5}
            roughness={0}
            metalness={1}
          />
        </mesh>
      </Float>

      {/* Right — Dodecahedron */}
      <Float speed={2.5} rotationIntensity={2} floatIntensity={1} position={[2.8, 0, 0]}>
        <mesh>
          <dodecahedronGeometry args={[0.8, 0]} />
          <MeshDistortMaterial
            color="#06b6d4"
            distort={0.2}
            speed={2}
            roughness={0.02}
            metalness={0.95}
          />
        </mesh>
      </Float>

      {/* Top — Tetrahedron small */}
      <Float speed={4} rotationIntensity={3} floatIntensity={2} position={[-1.3, 1.6, 0.5]}>
        <mesh>
          <tetrahedronGeometry args={[0.5, 0]} />
          <MeshDistortMaterial
            color="#f59e0b"
            distort={0.1}
            speed={3}
            roughness={0}
            metalness={1}
          />
        </mesh>
      </Float>

      {/* Bottom right — small sphere */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5} position={[1.4, -1.4, 0]}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <MeshDistortMaterial
            color="#10b981"
            distort={0.35}
            speed={4}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      </Float>
    </group>
  );
};

const FloatingGeometry3D = () => {
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <ambientLight intensity={0.35} />
        <pointLight position={[10, 10, 5]} intensity={3} color="#8b5cf6" />
        <pointLight position={[-10, -5, -5]} intensity={2} color="#ec4899" />
        <pointLight position={[0, -10, 5]} intensity={1.5} color="#06b6d4" />
        <pointLight position={[5, 5, -5]} intensity={1} color="#f59e0b" />
        <GeometryGroup />
      </Canvas>
    </div>
  );
};

export default FloatingGeometry3D;
