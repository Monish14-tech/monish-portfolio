import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { usePerformance } from '../../context/PerformanceContext';

const PALETTE = ['#c084fc', '#22d3ee', '#f472b6', '#34d399', '#60a5fa', '#fbbf24', '#a78bfa', '#06b6d4'];

const vivid = (color, emissiveIntensity = 1.4, metalness = 0.35) => (
  <meshStandardMaterial
    color={color}
    emissive={color}
    emissiveIntensity={emissiveIntensity}
    metalness={metalness}
    roughness={0.25}
  />
);

const glow = (color, intensity = 1.8) => (
  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} metalness={0.2} roughness={0.2} />
);

/* ─── Laptop ─── */
export const Laptop = ({ scale = 1, rotation = [0, 0, 0], position = [0, 0, 0] }) => {
  const screenRef = useRef();
  const { tier } = usePerformance();
  const lineColors = ['#f472b6', '#22d3ee', '#facc15', '#a78bfa'];

  useFrame((state) => {
    if (screenRef.current && tier !== 'low') {
      screenRef.current.material.emissiveIntensity = 1 + Math.sin(state.clock.getElapsedTime() * 2.5) * 0.35;
    }
  });

  return (
    <group scale={scale} rotation={rotation} position={position}>
      <RoundedBox args={[2.4, 0.14, 1.6]} radius={0.04} smoothness={4}>
        {vivid('#6366f1', 0.6)}
      </RoundedBox>
      <mesh position={[0, 0.08, 0.05]}>
        <boxGeometry args={[2.1, 0.02, 1.3]} />
        {vivid('#818cf8', 0.8)}
      </mesh>
      <group rotation={[-0.55, 0, 0]} position={[0, 0.07, -0.78]}>
        <RoundedBox args={[2.4, 1.35, 0.08]} radius={0.03} smoothness={4} position={[0, 0.68, 0]}>
          {vivid('#312e81', 0.4)}
        </RoundedBox>
        <mesh ref={screenRef} position={[0, 0.68, 0.05]}>
          <planeGeometry args={[2.15, 1.2]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#22d3ee" emissiveIntensity={1.2} />
        </mesh>
        {[0.35, 0.1, -0.15, -0.4].map((y, i) => (
          <mesh key={i} position={[-0.3 + i * 0.15, 0.68 + y * 0.25, 0.06]}>
            <planeGeometry args={[1.2 - i * 0.2, 0.04]} />
            {glow(lineColors[i], 1.6)}
          </mesh>
        ))}
      </group>
    </group>
  );
};

/* ─── AI Brain / Neural Chip ─── */
export const AIBrain = ({ scale = 1, rotation = [0, 0, 0], position = [0, 0, 0] }) => {
  const groupRef = useRef();
  const coreRef = useRef();
  const { tier } = usePerformance();
  const nodeCount = tier === 'low' ? 6 : tier === 'medium' ? 8 : 12;

  const nodes = useMemo(
    () =>
      Array.from({ length: nodeCount }, (_, i) => {
        const phi = Math.acos(-1 + (2 * i) / nodeCount);
        const theta = Math.sqrt(nodeCount * Math.PI) * phi;
        const r = 1.35;
        return [r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi)];
      }),
    [nodeCount]
  );

  const connections = useMemo(() => {
    if (tier === 'low') return [];
    const lines = [];
    nodes.forEach((n, i) => {
      lines.push([0, 0, 0, ...n]);
      if (tier === 'high') lines.push([...n, ...nodes[(i + 3) % nodes.length]]);
    });
    return lines;
  }, [nodes, tier]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current && tier !== 'low') groupRef.current.rotation.y = t * 0.2;
    if (coreRef.current && tier !== 'low') {
      coreRef.current.material.emissiveIntensity = 1.2 + Math.sin(t * 3) * 0.4;
    }
  });

  return (
    <group ref={groupRef} scale={scale} rotation={rotation} position={position}>
      {connections.map((pts, i) => (
        <SafeLine
          key={i}
          points={[
            [pts[0], pts[1], pts[2]],
            [pts[3], pts[4], pts[5]],
          ]}
          color={PALETTE[i % PALETTE.length]}
          opacity={0.55}
          lineWidth={1.2}
        />
      ))}

      <mesh ref={coreRef}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        {glow('#e879f9', 1.4)}
      </mesh>

      {tier !== 'low' &&
        [-0.55, 0.55].map((x) =>
          [-0.55, 0.55].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0, z]}>
              <boxGeometry args={[0.08, 0.08, 0.08]} />
              {glow('#22d3ee', 2)}
            </mesh>
          ))
        )}

      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08, tier === 'low' ? 8 : 12, tier === 'low' ? 8 : 12]} />
          {glow(PALETTE[i % PALETTE.length], tier === 'low' ? 1.5 : 2.2)}
        </mesh>
      ))}

      {tier !== 'low' && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.6, 0.02, 8, tier === 'high' ? 48 : 32]} />
          {glow('#facc15', 1.2)}
        </mesh>
      )}
    </group>
  );
};

/* ─── Robot ─── */
export const Robot = ({ scale = 1, rotation = [0, 0, 0], position = [0, 0, 0] }) => {
  const groupRef = useRef();
  const eyeL = useRef();
  const eyeR = useRef();
  const { tier } = usePerformance();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current && tier !== 'low') {
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.12;
    }
    if (tier === 'high') {
      const blink = Math.sin(t * 4) > 0.95 ? 0.1 : 1;
      if (eyeL.current) eyeL.current.scale.y = blink;
      if (eyeR.current) eyeR.current.scale.y = blink;
    }
  });

  return (
    <group ref={groupRef} scale={scale} rotation={rotation} position={position}>
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
        {vivid('#94a3b8', 0.5)}
      </mesh>
      <mesh position={[0, 1.78, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        {glow('#facc15', 2.5)}
      </mesh>

      <RoundedBox args={[0.85, 0.7, 0.75]} radius={0.08} smoothness={4} position={[0, 1.05, 0]}>
        {vivid('#fb7185', 0.7)}
      </RoundedBox>

      <mesh ref={eyeL} position={[-0.2, 1.1, 0.38]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        {glow('#4ade80', 2.5)}
      </mesh>
      <mesh ref={eyeR} position={[0.2, 1.1, 0.38]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        {glow('#4ade80', 2.5)}
      </mesh>

      <RoundedBox args={[1, 1.1, 0.65]} radius={0.06} smoothness={4} position={[0, 0.15, 0]}>
        {vivid('#818cf8', 0.65)}
      </RoundedBox>

      <mesh position={[0, 0.2, 0.34]}>
        <planeGeometry args={[0.5, 0.5]} />
        {glow('#22d3ee', 1.4)}
      </mesh>

      {[-0.72, 0.72].map((x, i) => (
        <group key={x} position={[x, 0.35, 0]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.7, 8]} />
            {vivid(i === 0 ? '#f472b6' : '#a78bfa', 0.6)}
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            {glow(i === 0 ? '#fb923c' : '#facc15', 1.8)}
          </mesh>
        </group>
      ))}

      {[-0.28, 0.28].map((x, i) => (
        <group key={x} position={[x, -0.65, 0]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.14, 0.55, 8]} />
            {vivid(i === 0 ? '#38bdf8' : '#e879f9', 0.55)}
          </mesh>
          <RoundedBox args={[0.28, 0.1, 0.35]} radius={0.03} position={[0, -0.35, 0.05]}>
            {vivid('#6366f1', 0.5)}
          </RoundedBox>
        </group>
      ))}
    </group>
  );
};

function SafeLine({ points, color, opacity, lineWidth = 1 }) {
  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p)));
  }, [points]);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} linewidth={lineWidth} />
    </line>
  );
}

/* ─── Network Globe ─── */
export const NetworkGlobe = ({ scale = 1, rotation = [0, 0, 0], position = [0, 0, 0] }) => {
  const globeRef = useRef();
  const { tier } = usePerformance();
  const icoDetail = tier === 'low' ? 0 : 1;
  const maxNodes = tier === 'low' ? 8 : tier === 'medium' ? 12 : 18;
  const maxEdges = tier === 'low' ? 8 : tier === 'medium' ? 14 : 24;
  const packetCount = tier === 'low' ? 0 : tier === 'medium' ? 1 : 2;

  const { nodePositions, edges } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.2, icoDetail);
    const pos = geo.getAttribute('position');
    const nodes = [];
    if (pos) {
      for (let i = 0; i < pos.count; i++) {
        nodes.push([pos.getX(i), pos.getY(i), pos.getZ(i)]);
      }
    }
    const unique = nodes.filter(
      (n, i) => nodes.findIndex((m) => Math.abs(m[0] - n[0]) < 0.01 && Math.abs(m[1] - n[1]) < 0.01 && Math.abs(m[2] - n[2]) < 0.01) === i
    );
    const edgeList = [];
    unique.forEach((n, i) => {
      unique.forEach((m, j) => {
        if (j <= i) return;
        const d = Math.hypot(n[0] - m[0], n[1] - m[1], n[2] - m[2]);
        if (d < 0.85) edgeList.push([n, m]);
      });
    });
    return { nodePositions: unique.slice(0, maxNodes), edges: edgeList.slice(0, maxEdges) };
  }, [icoDetail, maxNodes, maxEdges]);

  useFrame((state) => {
    if (globeRef.current) globeRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
  });

  return (
    <group ref={globeRef} scale={scale} rotation={rotation} position={position}>
      <mesh>
        <icosahedronGeometry args={[1.15, icoDetail]} />
        <meshStandardMaterial color="#22d3ee" wireframe transparent opacity={0.4} emissive="#06b6d4" emissiveIntensity={0.25} />
      </mesh>

      {tier !== 'low' && (
        <mesh>
          <sphereGeometry args={[1.1, 24, 24]} />
          <meshStandardMaterial color="#a78bfa" transparent opacity={0.12} emissive="#8b5cf6" emissiveIntensity={0.15} side={THREE.BackSide} />
        </mesh>
      )}

      {edges.map(([a, b], i) => (
        <SafeLine key={i} points={[a, b]} color={PALETTE[i % PALETTE.length]} opacity={0.6} />
      ))}

      {nodePositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.07, 10, 10]} />
          {glow(PALETTE[i % PALETTE.length], 2.2)}
        </mesh>
      ))}

      {Array.from({ length: packetCount }, (_, i) => (
        <DataPacket key={i} radius={1.65} speed={0.6 + i * 0.2} offset={i * 2.1} color={PALETTE[i + 2]} />
      ))}
    </group>
  );
};

const DataPacket = ({ radius, speed, offset, color }) => {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + offset;
    if (ref.current) {
      ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.7) * 0.5, Math.sin(t) * radius);
    }
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.11, 0.11, 0.11]} />
      {glow(color, 2.5)}
    </mesh>
  );
};

/* ─── Server Stack ─── */
export const ServerStack = ({ scale = 1, rotation = [0, 0, 0], position = [0, 0, 0] }) => {
  const groupRef = useRef();
  const unitColors = ['#f472b6', '#22d3ee', '#facc15'];

  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
  });

  return (
    <group ref={groupRef} scale={scale} rotation={rotation} position={position}>
      {[0, 0.55, 1.1].map((y, i) => (
        <group key={i} position={[0, y - 0.55, 0]}>
          <RoundedBox args={[1.1, 0.45, 0.85]} radius={0.04} smoothness={4}>
            {vivid(unitColors[i], 0.55)}
          </RoundedBox>
          {[0.25, 0, -0.25].map((z, j) => (
            <mesh key={z} position={[0.42, 0, z]}>
              <sphereGeometry args={[0.045, 8, 8]} />
              {glow(PALETTE[(i + j) % PALETTE.length], 2)}
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

/* ─── Circuit Board ─── */
export const CircuitBoard = ({ scale = 1 }) => {
  const ref = useRef();

  const traces = useMemo(() => {
    const paths = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      paths.push([
        [0, 0, 0],
        [Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0],
        [Math.cos(angle) * 1.5 + Math.cos(angle + Math.PI / 2) * 0.8, Math.sin(angle) * 1.5 + Math.sin(angle + Math.PI / 2) * 0.8, 0],
      ]);
    }
    return paths;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.getElapsedTime() * 0.04;
  });

  return (
    <group ref={ref} scale={scale}>
      <mesh>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#1e1b4b" transparent opacity={0.5} emissive="#312e81" emissiveIntensity={0.2} />
      </mesh>
      {traces.map((pts, i) => (
        <SafeLine key={i} points={pts} color={PALETTE[i % PALETTE.length]} opacity={0.75} lineWidth={2} />
      ))}
      {traces.map((pts, i) => (
        <mesh key={`n-${i}`} position={pts[pts.length - 1]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          {glow(PALETTE[i % PALETTE.length], 2)}
        </mesh>
      ))}
      <RoundedBox args={[0.7, 0.7, 0.05]} radius={0.04} position={[0, 0, 0.03]}>
        {glow('#f472b6', 1.2)}
      </RoundedBox>
    </group>
  );
};
