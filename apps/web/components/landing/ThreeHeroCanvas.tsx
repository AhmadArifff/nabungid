'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Single Floating Animated Gold Coin
function FloatingCoin({
  position,
  rotationSpeed = 1,
  scale = 1,
  orbitRadius = 2.2,
  orbitSpeed = 0.8,
  phase = 0,
}: {
  position?: [number, number, number];
  rotationSpeed?: number;
  scale?: number;
  orbitRadius?: number;
  orbitSpeed?: number;
  phase?: number;
}) {
  const coinRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (coinRef.current) {
      const t = state.clock.getElapsedTime() * orbitSpeed + phase;
      coinRef.current.position.x = Math.cos(t) * orbitRadius;
      coinRef.current.position.z = Math.sin(t) * orbitRadius;
      coinRef.current.position.y = (position ? position[1] : 0) + Math.sin(t * 2) * 0.25;
      coinRef.current.rotation.y += 0.03 * rotationSpeed;
      coinRef.current.rotation.x = Math.sin(t) * 0.3;
    }
  });

  return (
    <group ref={coinRef} scale={scale}>
      {/* Coin Outer Rim */}
      <mesh>
        <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
        <meshStandardMaterial
          color="#FFE066"
          metalness={0.9}
          roughness={0.15}
          emissive="#D97706"
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* Coin Inner Emboss */}
      <mesh position={[0, 0.045, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.02, 32]} />
        <meshStandardMaterial color="#FFB800" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Star Symbol on Coin */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color="#FFF9C4" metalness={0.95} roughness={0.1} />
      </mesh>
    </group>
  );
}

// Mini Cute Ketupat Charm
function MiniKetupat({ position }: { position: [number, number, number] }) {
  const ketupatRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ketupatRef.current) {
      const t = state.clock.getElapsedTime();
      ketupatRef.current.rotation.y = Math.sin(t * 1.5) * 0.4;
      ketupatRef.current.rotation.z = Math.cos(t * 1.2) * 0.2;
    }
  });

  return (
    <group ref={ketupatRef} position={position} scale={0.75}>
      {/* Diamond Body */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.45, 0.45, 0.2]} />
        <meshStandardMaterial
          color="#10B981"
          metalness={0.2}
          roughness={0.4}
          emissive="#047857"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Cross Ribbon */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.47, 0.12, 0.22]} />
        <meshStandardMaterial color="#34D399" metalness={0.1} roughness={0.3} />
      </mesh>
      {/* Hanging Ribbons */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.02, 0.05, 0.35, 8]} />
        <meshStandardMaterial color="#6EE7B7" roughness={0.5} />
      </mesh>
    </group>
  );
}

// Cute 3D Golden Celengan Character ("Si Berkah")
function CuteGoldenPiggy({
  mousePos,
  isWobbling,
  triggerWobble,
}: {
  mousePos: { x: number; y: number };
  isWobbling: boolean;
  triggerWobble: () => void;
}) {
  const mascotGroup = useRef<THREE.Group>(null);
  const headGroup = useRef<THREE.Group>(null);
  const coinTopRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (mascotGroup.current) {
      // Gentle idle breathing / floating
      const t = state.clock.getElapsedTime();
      mascotGroup.current.position.y = Math.sin(t * 2) * 0.12;

      // Mouse Parallax Look-At
      mascotGroup.current.rotation.y = THREE.MathUtils.lerp(
        mascotGroup.current.rotation.y,
        mousePos.x * 0.45,
        0.08
      );
      mascotGroup.current.rotation.x = THREE.MathUtils.lerp(
        mascotGroup.current.rotation.x,
        -mousePos.y * 0.25,
        0.08
      );

      // Happy Wobble reaction when clicked
      if (isWobbling) {
        mascotGroup.current.rotation.z = Math.sin(t * 25) * 0.2;
      } else {
        mascotGroup.current.rotation.z = THREE.MathUtils.lerp(
          mascotGroup.current.rotation.z,
          0,
          0.1
        );
      }
    }

    // Floating Coin into Slot animation
    if (coinTopRef.current) {
      const t = state.clock.getElapsedTime();
      coinTopRef.current.position.y = 1.65 + Math.sin(t * 3) * 0.15;
      coinTopRef.current.rotation.y += delta * 1.5;
    }
  });

  return (
    <group ref={mascotGroup} onClick={triggerWobble}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
        {/* ================= BODY ================= */}
        {/* Plump Chubby Golden Body */}
        <mesh position={[0, 0, 0]} scale={[1.35, 1.2, 1.3]}>
          <sphereGeometry args={[1.2, 48, 48]} />
          <meshStandardMaterial
            color="#FFC72C"
            metalness={0.78}
            roughness={0.16}
            emissive="#B45309"
            emissiveIntensity={0.22}
          />
        </mesh>

        {/* Chubby Cute White/Gold Tummy */}
        <mesh position={[0, -0.25, 0.75]} scale={[1.05, 0.95, 0.7]}>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial
            color="#FFFBEB"
            metalness={0.25}
            roughness={0.3}
            emissive="#FEF3C7"
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* ================= HEAD & FACE ================= */}
        <group ref={headGroup} position={[0, 0.2, 0.5]}>
          {/* Cute Snout */}
          <mesh position={[0, -0.05, 0.95]} rotation={[Math.PI / 2, 0, 0]} scale={[1.15, 0.75, 0.85]}>
            <cylinderGeometry args={[0.42, 0.46, 0.45, 32]} />
            <meshStandardMaterial
              color="#FFAE19"
              metalness={0.65}
              roughness={0.25}
              emissive="#D97706"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Snout Nostrils */}
          <mesh position={[-0.14, -0.05, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.05, 16]} />
            <meshBasicMaterial color="#78350F" />
          </mesh>
          <mesh position={[0.14, -0.05, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.05, 16]} />
            <meshBasicMaterial color="#78350F" />
          </mesh>

          {/* Cute Big Cartoon Eyes (Left Eye) */}
          <group position={[-0.52, 0.35, 0.95]}>
            {/* Eye Base (Glossy Black) */}
            <mesh scale={[1, 1.2, 0.8]}>
              <sphereGeometry args={[0.22, 32, 32]} />
              <meshStandardMaterial color="#0F172A" roughness={0.05} metalness={0.1} />
            </mesh>
            {/* Big Shiny White Highlight */}
            <mesh position={[-0.06, 0.08, 0.16]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
            {/* Secondary Small Highlight */}
            <mesh position={[0.07, -0.07, 0.15]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
          </group>

          {/* Cute Big Cartoon Eyes (Right Eye) */}
          <group position={[0.52, 0.35, 0.95]}>
            <mesh scale={[1, 1.2, 0.8]}>
              <sphereGeometry args={[0.22, 32, 32]} />
              <meshStandardMaterial color="#0F172A" roughness={0.05} metalness={0.1} />
            </mesh>
            <mesh position={[-0.06, 0.08, 0.16]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
            <mesh position={[0.07, -0.07, 0.15]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
          </group>

          {/* Cheerful Pink Cheeks / Blush */}
          <mesh position={[-0.75, 0.08, 0.82]} rotation={[0, -0.4, 0]}>
            <circleGeometry args={[0.18, 24]} />
            <meshBasicMaterial color="#FF6584" transparent opacity={0.65} />
          </mesh>
          <mesh position={[0.75, 0.08, 0.82]} rotation={[0, 0.4, 0]}>
            <circleGeometry args={[0.18, 24]} />
            <meshBasicMaterial color="#FF6584" transparent opacity={0.65} />
          </mesh>

          {/* Cute Perky Golden Ears (Left Ear) */}
          <group position={[-0.78, 1.05, 0.1]} rotation={[0.2, -0.3, -0.45]}>
            <mesh scale={[0.8, 1.1, 0.35]}>
              <coneGeometry args={[0.42, 0.75, 24]} />
              <meshStandardMaterial color="#FFC72C" metalness={0.75} roughness={0.2} />
            </mesh>
            {/* Inner Ear Pink */}
            <mesh position={[0, 0.05, 0.1]} scale={[0.6, 0.8, 0.2]}>
              <coneGeometry args={[0.3, 0.6, 16]} />
              <meshStandardMaterial color="#FDA4AF" roughness={0.4} />
            </mesh>
          </group>

          {/* Cute Perky Golden Ears (Right Ear) */}
          <group position={[0.78, 1.05, 0.1]} rotation={[0.2, 0.3, 0.45]}>
            <mesh scale={[0.8, 1.1, 0.35]}>
              <coneGeometry args={[0.42, 0.75, 24]} />
              <meshStandardMaterial color="#FFC72C" metalness={0.75} roughness={0.2} />
            </mesh>
            {/* Inner Ear Pink */}
            <mesh position={[0, 0.05, 0.1]} scale={[0.6, 0.8, 0.2]}>
              <coneGeometry args={[0.3, 0.6, 16]} />
              <meshStandardMaterial color="#FDA4AF" roughness={0.4} />
            </mesh>
          </group>
        </group>

        {/* ================= ISLAMIC / LEBARAN ACCENTS ================= */}
        {/* Playful Green Peci / Songkok with Gold Accent */}
        <group position={[0, 1.32, 0.1]} rotation={[-0.15, 0, 0.1]}>
          <mesh>
            <cylinderGeometry args={[0.55, 0.62, 0.42, 32]} />
            <meshStandardMaterial
              color="#047857"
              roughness={0.35}
              metalness={0.2}
              emissive="#064E3B"
              emissiveIntensity={0.4}
            />
          </mesh>
          {/* Gold Trim Ribbon */}
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.63, 0.63, 0.06, 32]} />
            <meshStandardMaterial color="#FCD34D" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Crescent Moon & Star Emblem on Peci */}
          <mesh position={[0, 0.02, 0.58]} rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[0.1, 0.03, 12, 24, Math.PI * 1.5]} />
            <meshStandardMaterial color="#FFFBEB" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>

        {/* Mini Ketupat Hanging on the Side */}
        <MiniKetupat position={[1.4, 0.2, 0.3]} />

        {/* ================= COIN SLOT & TOP COIN ================= */}
        {/* Black Coin Slot on Top Back */}
        <mesh position={[0, 1.38, -0.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.8, 0.15]} />
          <meshBasicMaterial color="#451A03" />
        </mesh>

        {/* Floating Interactive Gold Coin with Star */}
        <group ref={coinTopRef} position={[0, 1.65, -0.3]}>
          <mesh rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.08, 32]} />
            <meshStandardMaterial
              color="#FFE066"
              metalness={0.95}
              roughness={0.1}
              emissive="#F59E0B"
              emissiveIntensity={0.35}
            />
          </mesh>
          <mesh position={[0, 0.045, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <octahedronGeometry args={[0.14, 0]} />
            <meshStandardMaterial color="#FFFBEB" metalness={0.98} roughness={0.05} />
          </mesh>
        </group>

        {/* ================= STUBBY CUTE FEET ================= */}
        {/* Front Left Foot */}
        <mesh position={[-0.6, -1.05, 0.6]} scale={[0.9, 0.8, 1]}>
          <capsuleGeometry args={[0.26, 0.28, 16, 16]} />
          <meshStandardMaterial color="#FFAE19" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Front Right Foot */}
        <mesh position={[0.6, -1.05, 0.6]} scale={[0.9, 0.8, 1]}>
          <capsuleGeometry args={[0.26, 0.28, 16, 16]} />
          <meshStandardMaterial color="#FFAE19" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Back Left Foot */}
        <mesh position={[-0.65, -1.05, -0.6]} scale={[0.9, 0.8, 1]}>
          <capsuleGeometry args={[0.26, 0.28, 16, 16]} />
          <meshStandardMaterial color="#FFAE19" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Back Right Foot */}
        <mesh position={[0.65, -1.05, -0.6]} scale={[0.9, 0.8, 1]}>
          <capsuleGeometry args={[0.26, 0.28, 16, 16]} />
          <meshStandardMaterial color="#FFAE19" metalness={0.7} roughness={0.2} />
        </mesh>

        {/* ================= CUTE CURLY TAIL ================= */}
        <mesh position={[0, -0.1, -1.38]} rotation={[0.4, 0, 0]}>
          <torusGeometry args={[0.2, 0.07, 16, 32, Math.PI * 1.8]} />
          <meshStandardMaterial color="#FFC72C" metalness={0.75} roughness={0.2} />
        </mesh>

        {/* ================= GLOWING GOLDEN PEDESTAL RING ================= */}
        <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.8, 48]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#10B981"
            emissiveIntensity={0.6}
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>

      {/* Orbiting Gold Coins */}
      <FloatingCoin orbitRadius={2.3} orbitSpeed={0.7} phase={0} position={[0, 0.4, 0]} scale={0.9} />
      <FloatingCoin orbitRadius={2.1} orbitSpeed={-0.6} phase={Math.PI * 0.7} position={[0, -0.5, 0]} scale={0.75} />
      <FloatingCoin orbitRadius={2.5} orbitSpeed={0.85} phase={Math.PI * 1.4} position={[0, 0.9, 0]} scale={0.8} />
    </group>
  );
}

export const ThreeHeroCanvas: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isWobbling, setIsWobbling] = useState(false);

  const triggerWobble = () => {
    setIsWobbling(true);
    setTimeout(() => setIsWobbling(false), 900);
  };

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
    <div
      className="relative h-[380px] w-full sm:h-[460px] lg:h-[520px] cursor-pointer select-none"
      onClick={triggerWobble}
    >
      <Canvas
        camera={{ position: [0, 0.3, 5.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        {/* Rich Warm Studio Lighting */}
        <ambientLight intensity={1.2} color="#FFFBEB" />
        {/* Key Light (Warm Sunlight) */}
        <directionalLight position={[4, 8, 5]} intensity={2.6} color="#FFFDF0" />
        {/* Emerald Soft Fill Light */}
        <pointLight position={[-4, -2, 2]} intensity={1.8} color="#10B981" />
        {/* Warm Gold Rim/Backlight for shiny golden edges */}
        <pointLight position={[3, 3, -3]} intensity={3.5} color="#F59E0B" />
        <pointLight position={[-3, 4, -2]} intensity={2.2} color="#FCD34D" />

        {/* Ambient Sparkles */}
        <Sparkles count={55} scale={6.5} size={3.5} speed={0.5} color="#FDE68A" opacity={0.8} />
        <Sparkles count={25} scale={5} size={2.5} speed={0.3} color="#6EE7B7" opacity={0.6} />

        <CuteGoldenPiggy
          mousePos={mousePos}
          isWobbling={isWobbling}
          triggerWobble={triggerWobble}
        />
      </Canvas>
    </div>
  );
};
