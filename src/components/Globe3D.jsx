import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const GlobeCore = () => {
  const globeRef = useRef();
  const ringRef = useRef();
  const satRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.004;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.003;
    }
    if (satRef.current) {
      // Satellite orbits in a tilted circle
      satRef.current.position.x = Math.cos(t * 0.8) * 2.3;
      satRef.current.position.z = Math.sin(t * 0.8) * 2.3;
      satRef.current.position.y = Math.sin(t * 0.8) * 0.6;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.4}>
      <group>
        {/* Main globe body */}
        <Sphere ref={globeRef} args={[1.5, 96, 96]}>
          <MeshDistortMaterial
            color="#4f46e5"
            distort={0.18}
            speed={0.8}
            roughness={0.05}
            metalness={0.95}
          />
        </Sphere>

        {/* Outer atmosphere glow */}
        <Sphere args={[1.7, 32, 32]}>
          <meshStandardMaterial
            color="#818cf8"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </Sphere>

        {/* Second atmosphere layer */}
        <Sphere args={[1.85, 32, 32]}>
          <meshStandardMaterial
            color="#6366f1"
            transparent
            opacity={0.04}
            side={THREE.BackSide}
          />
        </Sphere>

        {/* Equatorial ring */}
        <mesh ref={ringRef} rotation={[Math.PI * 0.35, 0, 0]}>
          <torusGeometry args={[2.15, 0.025, 16, 120]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#7c3aed"
            emissiveIntensity={0.8}
            roughness={0}
            metalness={1}
          />
        </mesh>

        {/* Second ring */}
        <mesh rotation={[Math.PI * 0.55, 0.3, 0]}>
          <torusGeometry args={[2.5, 0.012, 16, 120]} />
          <meshStandardMaterial
            color="#c4b5fd"
            emissive="#8b5cf6"
            emissiveIntensity={0.5}
            roughness={0}
            metalness={1}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Orbiting satellite */}
        <mesh ref={satRef}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#f0abfc"
            emissive="#c026d3"
            emissiveIntensity={2}
          />
        </mesh>

        {/* Satellite glow */}
        <mesh ref={satRef}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial
            color="#f0abfc"
            transparent
            opacity={0.15}
            emissive="#c026d3"
            emissiveIntensity={1}
          />
        </mesh>
      </group>
    </Float>
  );
};

const Globe3D = () => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '450px' }}>
      <Canvas camera={{ position: [0, 0, 5.5], fov: 42 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[8, 8, 4]} intensity={2.5} color="#818cf8" />
        <pointLight position={[-8, -6, -4]} intensity={1} color="#c026d3" />
        <pointLight position={[0, -8, 6]} intensity={0.8} color="#06b6d4" />
        <Stars radius={120} depth={60} count={4000} factor={5} saturation={0} fade speed={0.5} />
        <GlobeCore />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          rotateSpeed={0.4}
          maxPolarAngle={Math.PI * 0.75}
          minPolarAngle={Math.PI * 0.25}
        />
      </Canvas>
    </div>
  );
};

export default Globe3D;
