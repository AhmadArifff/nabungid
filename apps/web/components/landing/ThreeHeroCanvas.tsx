'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Orbiting Shiny Gold Coin
function OrbitingCoin({
  radius = 2.4,
  speed = 0.8,
  yOffset = 0,
  phase = 0,
  scale = 0.7,
}: {
  radius?: number;
  speed?: number;
  yOffset?: number;
  phase?: number;
  scale?: number;
}) {
  const coinRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (coinRef.current) {
      const t = state.clock.getElapsedTime() * speed + phase;
      coinRef.current.position.x = Math.cos(t) * radius;
      coinRef.current.position.z = Math.sin(t) * radius;
      coinRef.current.position.y = yOffset + Math.sin(t * 2.5) * 0.2;
      coinRef.current.rotation.y += 0.04;
      coinRef.current.rotation.x = Math.sin(t) * 0.3;
    }
  });

  return (
    <group ref={coinRef} scale={scale}>
      <mesh>
        <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
        <meshStandardMaterial
          color="#FFE066"
          metalness={0.92}
          roughness={0.12}
          emissive="#D97706"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0, 0.045, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.02, 32]} />
        <meshStandardMaterial color="#FFB800" metalness={0.88} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color="#FFFBEB" metalness={0.98} roughness={0.05} />
      </mesh>
    </group>
  );
}

// 3D Dompet Berkah (Wallet with Banknotes & Spilling Coins)
function DompetBerkah({ position }: { position: [number, number, number] }) {
  const walletRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (walletRef.current) {
      const t = state.clock.getElapsedTime();
      walletRef.current.position.y = position[1] + Math.sin(t * 2 + 1) * 0.08;
      walletRef.current.rotation.y = -0.4 + Math.sin(t * 1.5) * 0.1;
    }
  });

  return (
    <group ref={walletRef} position={position} scale={0.95}>
      {/* Wallet Leather Body (Emerald Green & Gold Buckle) */}
      <RoundedBox args={[1.1, 0.75, 0.45]} radius={0.12} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#064E3B"
          metalness={0.3}
          roughness={0.4}
          emissive="#047857"
          emissiveIntensity={0.25}
        />
      </RoundedBox>

      {/* Wallet Flap / Lipatan Dompet */}
      <mesh position={[0, 0.25, 0.24]} scale={[1.05, 0.4, 0.08]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#047857" metalness={0.35} roughness={0.35} />
      </mesh>

      {/* Gold Clasp / Kancing Emas */}
      <mesh position={[0, 0.12, 0.29]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#FCD34D" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Green & Blue Banknotes Peeking Out (Uang Kertas Rupiah) */}
      <group position={[0, 0.42, 0]} rotation={[-0.15, 0.2, 0.1]}>
        {/* Bill 1 (Green 20k/100k vibe) */}
        <mesh position={[-0.15, 0, 0]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.75, 0.45, 0.02]} />
          <meshStandardMaterial color="#10B981" roughness={0.6} />
        </mesh>
        {/* Bill 2 (Blue 50k vibe) */}
        <mesh position={[0.1, 0.05, -0.04]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.75, 0.45, 0.02]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.6} />
        </mesh>
        {/* Bill 3 (Red 100k vibe) */}
        <mesh position={[0, 0.08, -0.08]} rotation={[0, 0, -0.05]}>
          <boxGeometry args={[0.75, 0.45, 0.02]} />
          <meshStandardMaterial color="#EF4444" roughness={0.6} />
        </mesh>
      </group>

      {/* Shiny Coins Spilling in Front of Wallet */}
      <group position={[0.3, -0.32, 0.35]} rotation={[0.4, 0.6, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.15} />
      </group>
      <group position={[-0.25, -0.34, 0.32]} rotation={[-0.2, 0.3, 0.8]}>
        <cylinderGeometry args={[0.16, 0.16, 0.04, 24]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.15} />
      </group>
    </group>
  );
}

// 3D Paket Sembako & Hampers Basket (Rice, Oil, Eggs, Biscuit Tin, Ketupat)
function PaketSembakoHampers({ position }: { position: [number, number, number] }) {
  const basketRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (basketRef.current) {
      const t = state.clock.getElapsedTime();
      basketRef.current.position.y = position[1] + Math.sin(t * 2 + 2) * 0.08;
      basketRef.current.rotation.y = 0.3 + Math.sin(t * 1.3) * 0.1;
    }
  });

  return (
    <group ref={basketRef} position={position} scale={0.9}>
      {/* Woven Basket Container (Keranjang Anyaman) */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.85, 0.65, 0.6, 32]} />
        <meshStandardMaterial
          color="#92400E"
          metalness={0.1}
          roughness={0.8}
          emissive="#78350F"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Basket Rim */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[0.86, 0.06, 16, 32]} />
        <meshStandardMaterial color="#B45309" roughness={0.7} />
      </mesh>

      {/* 1. Mini Rice Sack (Karung Beras Putih/Krem dengan Pita Hijau) */}
      <group position={[-0.32, 0.35, -0.15]} rotation={[0.1, 0.3, -0.1]}>
        <mesh>
          <capsuleGeometry args={[0.26, 0.45, 16, 16]} />
          <meshStandardMaterial color="#FEF3C7" roughness={0.6} />
        </mesh>
        {/* Green Label on Rice */}
        <mesh position={[0, 0, 0.25]}>
          <planeGeometry args={[0.3, 0.2]} />
          <meshBasicMaterial color="#059669" />
        </mesh>
      </group>

      {/* 2. Cooking Oil Bottle (Botol Minyak Goreng Kuning Transparan) */}
      <group position={[0.35, 0.42, -0.1]} rotation={[-0.1, -0.2, 0.1]}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.18, 0.55, 24]} />
          <meshStandardMaterial
            color="#FACC15"
            roughness={0.1}
            metalness={0.3}
            transparent
            opacity={0.88}
            emissive="#EAB308"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Bottle Red Cap */}
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.1, 16]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
      </group>

      {/* 3. Red Biscuit Tin (Kaleng Kue Khong Guan / Nastar Merah) */}
      <group position={[0.25, 0.18, 0.32]} rotation={[0, 0.4, 0]}>
        <mesh>
          <boxGeometry args={[0.42, 0.38, 0.42]} />
          <meshStandardMaterial color="#B91C1C" metalness={0.65} roughness={0.25} />
        </mesh>
        {/* Gold Tin Lid */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.44, 0.05, 0.44]} />
          <meshStandardMaterial color="#FCD34D" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* 4. Fresh Eggs (Telur Ayam Cokelat) */}
      <group position={[-0.25, 0.15, 0.38]}>
        <mesh position={[-0.1, 0, 0]} scale={[0.8, 1.1, 0.8]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#D97706" roughness={0.5} />
        </mesh>
        <mesh position={[0.1, 0, 0]} scale={[0.8, 1.1, 0.8]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#D97706" roughness={0.5} />
        </mesh>
      </group>

      {/* 5. Mini Ketupat Hanging on Basket */}
      <group position={[-0.6, 0.15, 0.45]} rotation={[0, 0, Math.PI / 4]} scale={0.45}>
        <mesh>
          <boxGeometry args={[0.45, 0.45, 0.2]} />
          <meshStandardMaterial color="#10B981" emissive="#047857" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// MAIN CENTERPIECE: CELENGAN AYAM JAGO EMAS TRADISIONAL ("Si Jago Berkah")
// =========================================================================
function CelenganAyamJagoEmas({
  mousePos,
  isWobbling,
  triggerWobble,
}: {
  mousePos: { x: number; y: number };
  isWobbling: boolean;
  triggerWobble: () => void;
}) {
  const ayamGroup = useRef<THREE.Group>(null);
  const coinTopRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ayamGroup.current) {
      const t = state.clock.getElapsedTime();
      ayamGroup.current.position.y = Math.sin(t * 2) * 0.1;

      // Mouse Look-At Tilt
      ayamGroup.current.rotation.y = THREE.MathUtils.lerp(
        ayamGroup.current.rotation.y,
        mousePos.x * 0.4,
        0.08
      );
      ayamGroup.current.rotation.x = THREE.MathUtils.lerp(
        ayamGroup.current.rotation.x,
        -mousePos.y * 0.2,
        0.08
      );

      // Happy Wobble when clicked
      if (isWobbling) {
        ayamGroup.current.rotation.z = Math.sin(t * 25) * 0.22;
        ayamGroup.current.scale.setScalar(1.08 + Math.sin(t * 20) * 0.04);
      } else {
        ayamGroup.current.rotation.z = THREE.MathUtils.lerp(ayamGroup.current.rotation.z, 0, 0.1);
        ayamGroup.current.scale.setScalar(1);
      }
    }

    // Floating Coin above slot animation
    if (coinTopRef.current) {
      const t = state.clock.getElapsedTime();
      coinTopRef.current.position.y = 1.65 + Math.sin(t * 3.5) * 0.12;
      coinTopRef.current.rotation.y += delta * 2;
    }
  });

  return (
    <group ref={ayamGroup} position={[0, 0.1, 0]} onClick={triggerWobble}>
      {/* ================= 1. PLUMP ROOSTER BODY (BADAN AYAM GEMBUL) ================= */}
      {/* Main Golden Body Sphere */}
      <mesh position={[0, 0, 0]} scale={[1.25, 1.2, 1.3]}>
        <sphereGeometry args={[1.1, 48, 48]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.82}
          roughness={0.16}
          emissive="#D97706"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Bright Golden Breast / Dada Ayam Tegak */}
      <mesh position={[0, -0.1, 0.68]} scale={[0.95, 0.95, 0.75]}>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshStandardMaterial
          color="#FFFBEB"
          metalness={0.3}
          roughness={0.25}
          emissive="#FEF3C7"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* ================= 2. ROOSTER HEAD & COMB (KEPALA & JENGGER AYAM MERAH) ================= */}
      <group position={[0, 0.65, 0.6]}>
        {/* Head Sphere */}
        <mesh scale={[0.9, 0.95, 0.9]}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.18} />
        </mesh>

        {/* Iconic Red Rooster Comb on Top (Jengger Ayam Jago Merah Berlekuk) */}
        <group position={[0, 0.6, -0.05]} rotation={[-0.1, 0, 0]}>
          {/* Main Middle Crest */}
          <mesh position={[0, 0.15, 0]} scale={[0.18, 0.45, 0.4]}>
            <sphereGeometry args={[0.5, 24, 24]} />
            <meshStandardMaterial color="#DC2626" metalness={0.2} roughness={0.3} />
          </mesh>
          {/* Front Crest */}
          <mesh position={[0, 0.05, 0.22]} scale={[0.16, 0.35, 0.3]}>
            <sphereGeometry args={[0.45, 24, 24]} />
            <meshStandardMaterial color="#EF4444" metalness={0.2} roughness={0.3} />
          </mesh>
          {/* Back Crest */}
          <mesh position={[0, 0.05, -0.22]} scale={[0.16, 0.38, 0.32]}>
            <sphereGeometry args={[0.45, 24, 24]} />
            <meshStandardMaterial color="#B91C1C" metalness={0.2} roughness={0.3} />
          </mesh>
        </group>

        {/* Cute Orange Beak (Paruh Ayam Jago Imut) */}
        <mesh position={[0, -0.08, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.18, 0.42, 24]} />
          <meshStandardMaterial color="#F97316" metalness={0.2} roughness={0.3} />
        </mesh>

        {/* Red Wattle under Beak (Gelambir Merah Ayam Jago) */}
        <group position={[0, -0.32, 0.46]}>
          <mesh position={[-0.06, 0, 0]} scale={[0.08, 0.22, 0.14]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#DC2626" metalness={0.2} roughness={0.3} />
          </mesh>
          <mesh position={[0.06, 0, 0]} scale={[0.08, 0.22, 0.14]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#DC2626" metalness={0.2} roughness={0.3} />
          </mesh>
        </group>

        {/* Cute Big Cartoon Eyes (Mata Kartun Berbinar Lucu) */}
        {/* Left Eye */}
        <group position={[-0.32, 0.14, 0.38]}>
          <mesh scale={[1, 1.15, 0.8]}>
            <sphereGeometry args={[0.16, 32, 32]} />
            <meshStandardMaterial color="#0F172A" roughness={0.05} metalness={0.1} />
          </mesh>
          <mesh position={[-0.04, 0.05, 0.12]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0.05, -0.05, 0.11]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>

        {/* Right Eye */}
        <group position={[0.32, 0.14, 0.38]}>
          <mesh scale={[1, 1.15, 0.8]}>
            <sphereGeometry args={[0.16, 32, 32]} />
            <meshStandardMaterial color="#0F172A" roughness={0.05} metalness={0.1} />
          </mesh>
          <mesh position={[-0.04, 0.05, 0.12]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0.05, -0.05, 0.11]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>

        {/* Cute Blushing Pink Cheeks */}
        <mesh position={[-0.45, -0.06, 0.32]} rotation={[0, -0.4, 0]}>
          <circleGeometry args={[0.12, 16]} />
          <meshBasicMaterial color="#FF6584" transparent opacity={0.65} />
        </mesh>
        <mesh position={[0.45, -0.06, 0.32]} rotation={[0, 0.4, 0]}>
          <circleGeometry args={[0.12, 16]} />
          <meshBasicMaterial color="#FF6584" transparent opacity={0.65} />
        </mesh>
      </group>

      {/* ================= 3. GOLDEN WINGS (SAYAP EMAS BERLEKUK) ================= */}
      {/* Left Wing */}
      <group position={[-1.05, 0.05, 0.1]} rotation={[0.2, 0.3, -0.35]}>
        <mesh scale={[0.25, 0.85, 0.95]}>
          <sphereGeometry args={[0.8, 24, 24]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Emerald Wing Accent Stripe */}
        <mesh position={[-0.12, 0, 0]} scale={[0.15, 0.6, 0.7]}>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshStandardMaterial color="#10B981" metalness={0.4} roughness={0.3} />
        </mesh>
      </group>

      {/* Right Wing */}
      <group position={[1.05, 0.05, 0.1]} rotation={[0.2, -0.3, 0.35]}>
        <mesh scale={[0.25, 0.85, 0.95]}>
          <sphereGeometry args={[0.8, 24, 24]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0.12, 0, 0]} scale={[0.15, 0.6, 0.7]}>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshStandardMaterial color="#10B981" metalness={0.4} roughness={0.3} />
        </mesh>
      </group>

      {/* ================= 4. MAJESTIC ROOSTER TAIL FEATHERS (EKOR AYAM JAGO EMAS & HIJAU) ================= */}
      <group position={[0, 0.45, -1.05]} rotation={[-0.45, 0, 0]}>
        {/* Main Tall Center Feather */}
        <mesh position={[0, 0.6, -0.2]} rotation={[-0.2, 0, 0]} scale={[0.16, 1.1, 0.4]}>
          <cylinderGeometry args={[0.1, 0.45, 1.2, 16]} />
          <meshStandardMaterial
            color="#047857"
            metalness={0.65}
            roughness={0.25}
            emissive="#065F46"
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Left Golden Feather */}
        <mesh position={[-0.22, 0.38, -0.1]} rotation={[-0.15, 0.2, -0.35]} scale={[0.14, 0.85, 0.35]}>
          <cylinderGeometry args={[0.08, 0.4, 1.0, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.88} roughness={0.15} />
        </mesh>
        {/* Right Golden Feather */}
        <mesh position={[0.22, 0.38, -0.1]} rotation={[-0.15, -0.2, 0.35]} scale={[0.14, 0.85, 0.35]}>
          <cylinderGeometry args={[0.08, 0.4, 1.0, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.88} roughness={0.15} />
        </mesh>
      </group>

      {/* ================= 5. COIN SLOT & TOP FLOATING COIN (LUBANG CELENGAN & KOIN TERBANG) ================= */}
      <mesh position={[0, 1.22, -0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.75, 0.14]} />
        <meshBasicMaterial color="#451A03" />
      </mesh>

      <group ref={coinTopRef} position={[0, 1.65, -0.15]}>
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.08, 32]} />
          <meshStandardMaterial
            color="#FFE066"
            metalness={0.95}
            roughness={0.1}
            emissive="#F59E0B"
            emissiveIntensity={0.35}
          />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.02, 32]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <octahedronGeometry args={[0.14, 0]} />
          <meshStandardMaterial color="#FFFBEB" metalness={0.98} roughness={0.05} />
        </mesh>
      </group>

      {/* ================= 6. CUTE STUBBY GOLDEN ROOSTER FEET (KAKI AYAM EMAS) ================= */}
      {/* Left Foot */}
      <group position={[-0.45, -1.05, 0.1]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.35, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.18, 0.08]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.28, 0.06, 0.32]} />
          <meshStandardMaterial color="#D97706" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Right Foot */}
      <group position={[0.45, -1.05, 0.1]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.35, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.18, 0.08]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.28, 0.06, 0.32]} />
          <meshStandardMaterial color="#D97706" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// MAIN 3D CANVAS COMPONENT
// =========================================================================
export const ThreeHeroCanvas: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isWobbling, setIsWobbling] = useState(false);

  const triggerWobble = () => {
    setIsWobbling(true);
    setTimeout(() => setIsWobbling(false), 800);
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
          <span className="text-6xl">🐔🪙</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-[400px] w-full sm:h-[480px] lg:h-[540px] cursor-pointer select-none"
      onClick={triggerWobble}
    >
      <Canvas
        camera={{ position: [0, 0.4, 6.2], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        {/* Rich Warm Studio Lighting */}
        <ambientLight intensity={1.3} color="#FFFDF0" />
        {/* Key Sunlight */}
        <directionalLight position={[4, 8, 5]} intensity={2.8} color="#FFFBEB" />
        {/* Emerald Ambient Fill Light */}
        <pointLight position={[-4, -2, 2]} intensity={2.2} color="#10B981" />
        {/* Intense Gold Backlight for Gleaming Rim Edges */}
        <pointLight position={[3, 3, -3.5]} intensity={3.8} color="#F59E0B" />
        <pointLight position={[-3, 4, -2.5]} intensity={2.5} color="#FCD34D" />

        {/* Ambient Sparkles */}
        <Sparkles count={55} scale={7} size={3.8} speed={0.5} color="#FDE68A" opacity={0.85} />
        <Sparkles count={30} scale={5.5} size={2.8} speed={0.3} color="#6EE7B7" opacity={0.7} />

        <Float speed={2} rotationIntensity={0.15} floatIntensity={0.6}>
          {/* 1. CENTERPIECE: CELENGAN AYAM JAGO EMAS */}
          <CelenganAyamJagoEmas
            mousePos={mousePos}
            isWobbling={isWobbling}
            triggerWobble={triggerWobble}
          />

          {/* 2. LEFT SIDE: DOMPET BERKAH WITH RUPIAH NOTES & COINS */}
          <DompetBerkah position={[-1.75, -0.65, 0.4]} />

          {/* 3. RIGHT SIDE: PAKET KERANJANG SEMBAKO (RICE, OIL, BISCUITS, EGGS) */}
          <PaketSembakoHampers position={[1.75, -0.65, 0.4]} />
        </Float>

        {/* Orbiting Gold Coins Around The Whole Scene */}
        <OrbitingCoin radius={2.6} speed={0.7} yOffset={0.6} phase={0} scale={0.8} />
        <OrbitingCoin radius={2.3} speed={-0.6} yOffset={-0.5} phase={Math.PI * 0.75} scale={0.7} />
        <OrbitingCoin radius={2.8} speed={0.85} yOffset={1.0} phase={Math.PI * 1.5} scale={0.75} />
      </Canvas>
    </div>
  );
};
