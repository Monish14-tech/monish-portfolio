import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Particle Ring ─── */
const ParticleRing = ({ count = 120, radius = 3.3, color = '#a78bfa' }) => {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const spread = (Math.random() - 0.5) * 0.35;
      pts.push(
        Math.cos(angle) * (radius + spread),
        (Math.random() - 0.5) * 0.4,
        Math.sin(angle) * (radius + spread)
      );
    }
    return new Float32Array(pts);
  }, [count, radius]);

  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.12;
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.07) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.045} sizeAttenuation transparent opacity={0.75} />
    </points>
  );
};

/* ─── Glowing Torus Ring ─── */
const GlowRing = ({ radius = 3.6, tube = 0.018, color = '#7c3aed', speed = 0.05, tiltX = 0.4, tiltZ = 0 }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * speed;
    }
  });
  return (
    <mesh ref={ref} rotation={[tiltX, 0, tiltZ]}>
      <torusGeometry args={[radius, tube, 16, 200]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} roughness={0} metalness={1} />
    </mesh>
  );
};

/* ─── Core Crystal Sphere ─── */
const CrystalSphere = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.x = t * 0.04;
      meshRef.current.rotation.y = t * 0.06;
    }
  });

  return (
    <Float speed={0.9} rotationIntensity={0.15} floatIntensity={0.4}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.6, 128, 128]} />
        <MeshTransmissionMaterial
          color="#c4b5fd"
          thickness={2.0}
          roughness={0}
          transmission={1}
          ior={1.6}
          chromaticAberration={0.05}
          anisotropy={0.2}
          distortion={0.4}
          distortionScale={0.25}
          temporalDistortion={0.04}
          clearcoat={1}
          clearcoatRoughness={0}
          envMapIntensity={2}
        />
      </mesh>

      {/* Outer atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.85, 64, 64]} />
        <meshStandardMaterial color="#8b5cf6" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>

      {/* Second glow layer */}
      <mesh>
        <sphereGeometry args={[2.1, 32, 32]} />
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.025} side={THREE.BackSide} />
      </mesh>
    </Float>
  );
};

/* ─── Orbiting Satellite Dot ─── */
const Satellite = ({ orbitRadius = 2.8, speed = 0.55, color = '#f0abfc', startAngle = 0 }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() * speed + startAngle;
      ref.current.position.x = Math.cos(t) * orbitRadius;
      ref.current.position.z = Math.sin(t) * orbitRadius;
      ref.current.position.y = Math.sin(t * 0.7) * 0.8;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.09, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
    </mesh>
  );
};

/* ─── Mouse-reactive Scene ─── */
const InteractiveScene = () => {
  const groupRef = useRef();
  const { mouse } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += (mouse.y * -0.25 - groupRef.current.rotation.x) * 0.04;
      groupRef.current.rotation.y += (mouse.x * 0.35 - groupRef.current.rotation.y) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[6, 6, 6]}   intensity={4}   color="#a78bfa" />
      <pointLight position={[-6, -4, 4]} intensity={2.5} color="#ec4899" />
      <pointLight position={[0, -6, 8]}  intensity={2}   color="#06b6d4" />
      <pointLight position={[4, -4, -4]} intensity={1.5} color="#f59e0b" />
      <spotLight position={[0, 12, 0]} intensity={3} angle={0.3} penumbra={1} color="#ffffff" />

      {/* Deep-space stars */}
      <Stars radius={80} depth={50} count={3500} factor={4} saturation={0} fade speed={0.4} />

      {/* Core glass sphere */}
      <CrystalSphere />

      {/* Glowing orbital rings */}
      <GlowRing radius={2.6} tube={0.022} color="#8b5cf6" speed={0.08}  tiltX={0.5}  tiltZ={0} />
      <GlowRing radius={3.1} tube={0.014} color="#06b6d4" speed={-0.06} tiltX={0.2}  tiltZ={0.5} />
      <GlowRing radius={3.7} tube={0.010} color="#ec4899" speed={0.05}  tiltX={1.1}  tiltZ={0.3} />

      {/* Particle halos */}
      <ParticleRing count={140} radius={3.3} color="#a78bfa" />
      <ParticleRing count={90}  radius={4.1} color="#67e8f9" />

      {/* Orbiting satellites */}
      <Satellite orbitRadius={2.5} speed={0.55} color="#f0abfc" startAngle={0} />
      <Satellite orbitRadius={3.2} speed={-0.4} color="#fbbf24" startAngle={Math.PI} />
      <Satellite orbitRadius={2.9} speed={0.7}  color="#4ade80" startAngle={Math.PI * 0.5} />

      <Environment preset="studio" />
    </group>
  );
};

/* ─── Exported Component ─── */
const Model3D = () => (
  <div style={{
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    pointerEvents: 'none',
    opacity: 0.20,
    maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)',
    WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)',
  }}>
    <Canvas
      camera={{ position: [0, 0, 9], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <InteractiveScene />
    </Canvas>
  </div>
);

export default Model3D;
