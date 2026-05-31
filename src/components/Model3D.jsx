import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';
import SceneCanvas from './three/SceneCanvas';
import { useCursorParallax } from './three/useCursorParallax';
import { usePerformance } from '../context/PerformanceContext';

const HERO_SPHERE_RADIUS = 1.88;
const HERO_GROUP_SCALE = { low: 0.94, medium: 1.04, high: 1.12 };

/* Tight rings hugging the orb — 1 on low tier, 2 on medium/high */
const ORBIT_RING_PRESETS = [
  { radius: 2.55, tube: 0.022, color: '#8b5cf6', speed: 0.08, tiltX: 0.42, tiltZ: 0 },
  { radius: 3.05, tube: 0.015, color: '#06b6d4', speed: -0.06, tiltX: 0.28, tiltZ: 0.38 },
];

const DUST_LAYER_PRESETS = [
  { radius: 2.35, color: '#a78bfa', speed: 0.16, countMul: 1, tilt: [0.35, 0, 0.2] },
  { radius: 3.0, color: '#67e8f9', speed: -0.13, countMul: 0.9, tilt: [0.1, 0.4, 0] },
  { radius: 3.65, color: '#f0abfc', speed: 0.11, countMul: 0.8, tilt: [0.5, 0, 0.35] },
  { radius: 4.3, color: '#fbbf24', speed: -0.09, countMul: 0.7, tilt: [0.2, 0.25, 0.15] },
  { radius: 4.95, color: '#c4b5fd', speed: 0.07, countMul: 0.6, tilt: [0.4, 0.15, 0.25] },
];

const OrbitRing = ({ radius, tube, color, speed, tiltX, tiltZ, segments }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * speed;
  });
  return (
    <mesh ref={ref} rotation={[tiltX, 0, tiltZ]}>
      <torusGeometry args={[radius, tube, segments[0], segments[1]]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.65}
        roughness={0.12}
        metalness={0.88}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

const DustParticles = ({ count, radius, color, speed, tilt = [0, 0, 0] }) => {
  const points = useMemo(() => {
    const pts = [];
    const ringCount = Math.floor(count * 0.72);
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2 + Math.random() * 0.15;
      const r = radius + (Math.random() - 0.5) * 0.55;
      pts.push(
        Math.cos(angle) * r,
        (Math.random() - 0.5) * 1.1,
        Math.sin(angle) * r
      );
    }
    for (let i = ringCount; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const band = radius * (0.75 + Math.random() * 0.45);
      pts.push(
        Math.cos(angle) * band,
        (Math.random() - 0.5) * 1.4,
        Math.sin(angle) * band
      );
    }
    return new Float32Array(pts);
  }, [count, radius]);

  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * speed;
    ref.current.rotation.x = Math.sin(t * speed * 0.6) * 0.08 + tilt[0];
    ref.current.rotation.z = Math.cos(t * speed * 0.5) * 0.06 + tilt[2];
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.032}
        sizeAttenuation
        transparent
        opacity={0.58}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const TRANSMISSION_BY_TIER = {
  low: {
    thickness: 0.95,
    chromaticAberration: 0,
    distortion: 0,
    distortionScale: 0,
    temporalDistortion: 0,
    innerShell: false,
  },
  medium: {
    thickness: 1.1,
    chromaticAberration: 0.02,
    distortion: 0.12,
    distortionScale: 0.1,
    temporalDistortion: 0.01,
    innerShell: true,
  },
  high: {
    thickness: 1.2,
    chromaticAberration: 0.03,
    distortion: 0.2,
    distortionScale: 0.15,
    temporalDistortion: 0.02,
    innerShell: true,
  },
};

const CrystalSphere = () => {
  const meshRef = useRef();
  const { sphereSegments, enableFloat, transmissionSamples, tier } = usePerformance();
  const tx = TRANSMISSION_BY_TIER[tier] ?? TRANSMISSION_BY_TIER.medium;

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.x = t * 0.04;
      meshRef.current.rotation.y = t * 0.06;
    }
  });

  const shellOuter = HERO_SPHERE_RADIUS * 1.16;
  const shellFar = HERO_SPHERE_RADIUS * 1.32;

  const sphere = (
    <mesh ref={meshRef}>
      <sphereGeometry args={[HERO_SPHERE_RADIUS, sphereSegments, sphereSegments]} />
      <MeshTransmissionMaterial
        color="#c4b5fd"
        thickness={tx.thickness}
        roughness={0}
        transmission={1}
        ior={1.5}
        chromaticAberration={tx.chromaticAberration}
        distortion={tx.distortion}
        distortionScale={tx.distortionScale}
        temporalDistortion={tx.temporalDistortion}
        samples={transmissionSamples}
        resolution={tier === 'low' ? 256 : tier === 'medium' ? 512 : 1024}
      />
    </mesh>
  );

  const content = (
    <>
      {sphere}
      {tx.innerShell && (
        <>
          <mesh>
            <sphereGeometry args={[shellOuter, tier === 'high' ? 32 : 24, tier === 'high' ? 32 : 24]} />
            <meshStandardMaterial color="#8b5cf6" transparent opacity={0.06} side={THREE.BackSide} />
          </mesh>
          {tier === 'high' && (
            <mesh>
              <sphereGeometry args={[shellFar, 24, 24]} />
              <meshStandardMaterial color="#06b6d4" transparent opacity={0.025} side={THREE.BackSide} />
            </mesh>
          )}
        </>
      )}
    </>
  );

  if (!enableFloat) return content;

  return (
    <Float speed={0.9} rotationIntensity={0.12} floatIntensity={0.3}>
      {content}
    </Float>
  );
};

const Satellite = ({ orbitRadius, speed, color, startAngle }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() * speed + startAngle;
      ref.current.position.x = Math.cos(t) * orbitRadius;
      ref.current.position.z = Math.sin(t) * orbitRadius;
      ref.current.position.y = Math.sin(t * 0.7) * 0.6;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.08, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  );
};

const HeroClassicScene = () => {
  const groupRef = useCursorParallax({ rotX: 0.18, rotY: 0.26, lerp: 0.05 });
  const {
    stars,
    starsSaturation,
    dustLayers,
    particles,
    satellites,
    torusSegments,
    enableHeroEnvironment,
    tier,
  } = usePerformance();

  const activeDust = DUST_LAYER_PRESETS.slice(0, dustLayers);
  const orbitRingCount = tier === 'low' ? 1 : 2;
  const groupScale = HERO_GROUP_SCALE[tier] ?? HERO_GROUP_SCALE.medium;

  return (
    <group ref={groupRef} scale={groupScale}>
      <ambientLight intensity={0.12} />
      <pointLight position={[6, 6, 6]} intensity={3} color="#a78bfa" />
      <pointLight position={[-5, -3, 4]} intensity={2} color="#ec4899" />
      <pointLight position={[0, -5, 6]} intensity={1.5} color="#06b6d4" />

      {stars > 0 && (
        <Stars radius={60} depth={40} count={stars} factor={3} saturation={starsSaturation} fade speed={0.35} />
      )}

      <CrystalSphere />

      {ORBIT_RING_PRESETS.slice(0, orbitRingCount).map((ring) => (
        <OrbitRing key={ring.color} {...ring} segments={torusSegments} />
      ))}

      {activeDust.map((layer) => (
        <DustParticles
          key={layer.color}
          count={Math.max(12, Math.floor(particles * layer.countMul))}
          radius={layer.radius}
          color={layer.color}
          speed={layer.speed}
          tilt={layer.tilt}
        />
      ))}

      {satellites >= 1 && (
        <Satellite orbitRadius={2.75} speed={0.5} color="#f0abfc" startAngle={0} />
      )}
      {satellites >= 2 && (
        <Satellite orbitRadius={3.55} speed={-0.35} color="#fbbf24" startAngle={Math.PI} />
      )}
      {satellites >= 3 && (
        <Satellite orbitRadius={3.2} speed={0.6} color="#4ade80" startAngle={Math.PI * 0.5} />
      )}

      {enableHeroEnvironment && (
        <Environment preset="studio" background={false} environmentIntensity={tier === 'low' ? 0.85 : 1} />
      )}
    </group>
  );
};

const Model3D = () => {
  const { isMobile, release3DWhenHidden } = usePerformance();

  return (
    <SceneCanvas
      camera={{ position: [0, 0, 10.2], fov: 46 }}
      interactive={false}
      lazy={isMobile}
      releaseWhenHidden={release3DWhenHidden}
      rootMargin="80px"
    >
      <HeroClassicScene />
    </SceneCanvas>
  );
};

export default Model3D;
