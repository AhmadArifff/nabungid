'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function GoldenVaultModel({ mousePos }: { mousePos: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth idle rotation
      groupRef.current.rotation.y += delta * 0.4;
      // Parallax mouse tilt
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePos.y * 0.35,
        0.05
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        -mousePos.x * 0.35,
        0.05
      );
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.6;
      ringRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Golden Vault Box */}
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1.2}>
        {/* Main Vault Body */}
        <RoundedBox args={[2.2, 2.2, 2.2]} radius={0.3} smoothness={4} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#f59e0b"
            metalness={0.85}
            roughness={0.2}
            envMapIntensity={1.5}
          />
        </RoundedBox>

        {/* Emerald Crystal Inset */}
        <mesh position={[0, 0, 1.12]}>
          <circleGeometry args={[0.65, 32]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#047857"
            emissiveIntensity={0.6}
            metalness={0.3}
            roughness={0.1}
          />
        </mesh>

        {/* Coin Slot on Top */}
        <mesh position={[0, 1.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.2, 0.18]} />
          <meshBasicMaterial color="#78350f" />
        </mesh>

        {/* Dome Roof on Top (Islamic Arch/Dome Inspiration) */}
        <mesh position={[0, 1.45, 0]}>
          <coneGeometry args={[1.1, 0.7, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Orbiting Golden Ring */}
        <mesh ref={ringRef} position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[2.0, 0.06, 16, 100]} />
          <meshStandardMaterial color="#fcd34d" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Floating Little Gold Coins */}
        <group position={[1.8, 1.2, 0.5]}>
          <cylinderGeometry args={[0.3, 0.3, 0.06, 24]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </group>
        <group position={[-1.7, -1.0, 0.8]}>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 24]} />
          <meshStandardMaterial color="#fcd34d" metalness={0.9} roughness={0.2} />
        </group>
      </Float>
    </group>
  );
}

export const ThreeHeroCanvas: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!hasWebGL) {
    // 2D Fallback
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-600 via-amber-400 to-amber-200 opacity-80 blur-3xl animate-pulse" />
        <div className="absolute z-10 flex h-48 w-48 items-center justify-center rounded-3xl border border-amber-400/40 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
          <span className="text-6xl">🪙</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[380px] w-full sm:h-[460px] lg:h-[520px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#fffbeb" />
        <pointLight position={[-5, -5, -2]} intensity={1.2} color="#10b981" />
        <pointLight position={[4, -2, 3]} intensity={1.5} color="#f59e0b" />

        <Sparkles count={45} scale={6} size={3} speed={0.4} color="#fbbf24" opacity={0.6} />

        <GoldenVaultModel mousePos={mousePos} />
      </Canvas>
    </div>
  );
};
