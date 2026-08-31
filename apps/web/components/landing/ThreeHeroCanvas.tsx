'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// =========================================================================
// 1. DOMPET BERKAH WITH POP-OUT MONEY & COINS ANIMATION
// =========================================================================
function DompetBerkah({
  position,
  mousePos,
  isPopped,
  onClick,
}: {
  position: [number, number, number];
  mousePos: { x: number; y: number };
  isPopped: boolean;
  onClick: (e: any) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const popProgress = useRef(0);

  useFrame((state, delta) => {
    // Animate pop progress (0 = resting inside, 1 = exploded/fanned out)
    if (isPopped) {
      popProgress.current = THREE.MathUtils.lerp(popProgress.current, 1, delta * 8);
    } else {
      popProgress.current = THREE.MathUtils.lerp(popProgress.current, 0, delta * 5);
    }

    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      // Gentle bob
      groupRef.current.position.y = position[1] + Math.sin(t * 2 + 1.2) * 0.1;
      // Continuous 360 spin + mouse parallax
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  const p = popProgress.current;

  return (
    <group ref={groupRef} position={position} onClick={onClick} scale={0.88}>
      {/* Wallet Outer Leather */}
      <RoundedBox args={[1.2, 0.82, 0.45]} radius={0.15} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#047857"
          metalness={0.35}
          roughness={0.35}
          emissive="#064E3B"
          emissiveIntensity={0.35}
        />
      </RoundedBox>

      {/* Gold Trim Border */}
      <RoundedBox args={[1.22, 0.84, 0.15]} radius={0.12} smoothness={3} position={[0, 0, 0]}>
        <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
      </RoundedBox>

      {/* Wallet Flap */}
      <mesh position={[0, 0.22, 0.24]} scale={[1.1, 0.42, 0.08]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#059669" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Gold Clasp Button */}
      <mesh position={[0, 0.08, 0.3]}>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshStandardMaterial color="#FCD34D" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* ================= MONEY POPPING OUT IN AN ARC ================= */}
      {/* Banknote 1 (Green Rp 20.000 / 100.000) */}
      <mesh
        position={[-0.25 - p * 0.5, 0.45 + p * 0.8, p * 0.2]}
        rotation={[-0.15, 0.1, -0.15 - p * 0.35]}
      >
        <boxGeometry args={[0.85, 0.5, 0.02]} />
        <meshStandardMaterial
          color="#10B981"
          emissive="#059669"
          emissiveIntensity={p * 0.6}
          roughness={0.5}
        />
      </mesh>

      {/* Banknote 2 (Blue Rp 50.000) */}
      <mesh
        position={[0.15 + p * 0.5, 0.5 + p * 0.85, -0.05 + p * 0.2]}
        rotation={[-0.15, -0.1, 0.18 + p * 0.35]}
      >
        <boxGeometry args={[0.85, 0.5, 0.02]} />
        <meshStandardMaterial
          color="#3B82F6"
          emissive="#2563EB"
          emissiveIntensity={p * 0.6}
          roughness={0.5}
        />
      </mesh>

      {/* Banknote 3 (Red Rp 100.000 Top Center) */}
      <mesh
        position={[0, 0.55 + p * 1.15, -0.1]}
        rotation={[-0.1, 0, 0]}
      >
        <boxGeometry args={[0.85, 0.5, 0.02]} />
        <meshStandardMaterial
          color="#EF4444"
          emissive="#DC2626"
          emissiveIntensity={p * 0.6}
          roughness={0.5}
        />
      </mesh>

      {/* Banknote 4 (Purple Rp 10.000) */}
      <mesh
        position={[-0.1 - p * 0.3, 0.48 + p * 0.65, 0.1]}
        rotation={[0.1, 0.2, -0.08]}
      >
        <boxGeometry args={[0.75, 0.45, 0.02]} />
        <meshStandardMaterial color="#8B5CF6" roughness={0.5} />
      </mesh>

      {/* ================= GOLD COINS FOUNTAIN FROM WALLET ================= */}
      {/* Coin Pop 1 */}
      <group
        position={[0.4 + p * 0.6, 0.3 + p * 1.2, 0.3 + p * 0.3]}
        rotation={[p * 6, p * 8, 0]}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 24]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.95}
            roughness={0.1}
            emissive="#F59E0B"
            emissiveIntensity={p * 0.8}
          />
        </mesh>
      </group>

      {/* Coin Pop 2 */}
      <group
        position={[-0.4 - p * 0.6, 0.3 + p * 1.0, 0.2 + p * 0.2]}
        rotation={[p * 5, -p * 7, 0]}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.05, 24]} />
          <meshStandardMaterial
            color="#FBBF24"
            metalness={0.95}
            roughness={0.1}
            emissive="#F59E0B"
            emissiveIntensity={p * 0.8}
          />
        </mesh>
      </group>

      {/* Coin Pop 3 (Top Center High) */}
      <group
        position={[0, 0.5 + p * 1.4, 0.1 + p * 0.4]}
        rotation={[p * 10, p * 4, 0]}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 24]} />
          <meshStandardMaterial
            color="#FFE066"
            metalness={0.98}
            roughness={0.08}
            emissive="#F59E0B"
            emissiveIntensity={p}
          />
        </mesh>
      </group>

      {/* Resting front coins */}
      <group position={[0.35, -0.35, 0.35]} rotation={[0.4, 0.5, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} />
        <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.1} />
      </group>
      <group position={[-0.3, -0.38, 0.32]} rotation={[-0.2, 0.3, 0.8]}>
        <cylinderGeometry args={[0.16, 0.16, 0.04, 24]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.95} roughness={0.1} />
      </group>
    </group>
  );
}

// =========================================================================
// 2. PAKET KERANJANG SEMBAKO WITH POP-OUT ITEMS ANIMATION
// =========================================================================
function PaketSembakoHampers({
  position,
  mousePos,
  isPopped,
  onClick,
}: {
  position: [number, number, number];
  mousePos: { x: number; y: number };
  isPopped: boolean;
  onClick: (e: any) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const popProgress = useRef(0);

  useFrame((state, delta) => {
    // Animate pop progress (0 = resting in basket, 1 = floating/popped up)
    if (isPopped) {
      popProgress.current = THREE.MathUtils.lerp(popProgress.current, 1, delta * 8);
    } else {
      popProgress.current = THREE.MathUtils.lerp(popProgress.current, 0, delta * 5);
    }

    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      // Gentle bob
      groupRef.current.position.y = position[1] + Math.sin(t * 2 + 2.4) * 0.1;
      // Continuous 360 spin
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  const p = popProgress.current;

  return (
    <group ref={groupRef} position={position} onClick={onClick} scale={0.88}>
      {/* Woven Basket Base */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.85, 0.65, 0.58, 32]} />
        <meshStandardMaterial
          color="#92400E"
          metalness={0.1}
          roughness={0.85}
          emissive="#78350F"
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* Basket Rim */}
      <mesh position={[0, 0.07, 0]}>
        <torusGeometry args={[0.86, 0.06, 16, 32]} />
        <meshStandardMaterial color="#B45309" roughness={0.7} />
      </mesh>

      {/* ================= ITEMS POPPING UP & EXPANDING OUTWARD ================= */}
      {/* 1. Karung Beras 5KG (Shoots up-left) */}
      <group
        position={[-0.32 - p * 0.55, 0.35 + p * 0.95, -0.15 + p * 0.2]}
        rotation={[0.1 + p * 0.3, 0.3 + p * 0.5, -0.1 - p * 0.3]}
      >
        <mesh>
          <capsuleGeometry args={[0.26, 0.45, 16, 16]} />
          <meshStandardMaterial
            color="#FEF3C7"
            roughness={0.5}
            emissive="#FDE68A"
            emissiveIntensity={p * 0.4}
          />
        </mesh>
        {/* Green Label */}
        <mesh position={[0, 0, 0.25]}>
          <planeGeometry args={[0.3, 0.2]} />
          <meshBasicMaterial color="#059669" />
        </mesh>
      </group>

      {/* 2. Botol Minyak Goreng (Shoots up-right) */}
      <group
        position={[0.35 + p * 0.6, 0.42 + p * 1.05, -0.1 + p * 0.2]}
        rotation={[-0.1 - p * 0.3, -0.2 + p * 0.6, 0.1 + p * 0.4]}
      >
        <mesh>
          <cylinderGeometry args={[0.18, 0.18, 0.55, 24]} />
          <meshStandardMaterial
            color="#FACC15"
            roughness={0.1}
            metalness={0.3}
            transparent
            opacity={0.92}
            emissive="#EAB308"
            emissiveIntensity={0.35 + p * 0.5}
          />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.1, 16]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
      </group>

      {/* 3. Kaleng Biskuit Merah (Shoots up-center high) */}
      <group
        position={[0.25 - p * 0.2, 0.18 + p * 1.25, 0.32 - p * 0.2]}
        rotation={[p * 0.4, 0.4 + p * 3, p * 0.2]}
      >
        <mesh>
          <boxGeometry args={[0.42, 0.38, 0.42]} />
          <meshStandardMaterial
            color="#B91C1C"
            metalness={0.65}
            roughness={0.25}
            emissive="#EF4444"
            emissiveIntensity={p * 0.4}
          />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.44, 0.05, 0.44]} />
          <meshStandardMaterial color="#FCD34D" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* 4. Fresh Eggs (Float & Spin in front) */}
      <group position={[-0.25 - p * 0.3, 0.15 + p * 0.75, 0.38 + p * 0.4]}>
        <mesh position={[-0.1, 0, 0]} scale={[0.8, 1.1, 0.8]} rotation={[p * 2, 0, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#D97706" roughness={0.4} />
        </mesh>
        <mesh position={[0.1, 0, 0]} scale={[0.8, 1.1, 0.8]} rotation={[0, p * 2, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#D97706" roughness={0.4} />
        </mesh>
      </group>

      {/* 5. Mini Ketupat (Floats high spinning) */}
      <group
        position={[-0.6 - p * 0.4, 0.15 + p * 1.1, 0.45 + p * 0.3]}
        rotation={[0, p * 4, Math.PI / 4 + p * 2]}
        scale={0.45 + p * 0.2}
      >
        <mesh>
          <boxGeometry args={[0.45, 0.45, 0.2]} />
          <meshStandardMaterial
            color="#10B981"
            emissive="#047857"
            emissiveIntensity={0.3 + p * 0.5}
          />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 3. CELENGAN AYAM JAGO EMAS WITH COIN FOUNTAIN POP ANIMATION
// =========================================================================
function CuteCelenganAyam({
  position,
  mousePos,
  isPopped,
  onClick,
}: {
  position: [number, number, number];
  mousePos: { x: number; y: number };
  isPopped: boolean;
  onClick: (e: any) => void;
}) {
  const ayamRef = useRef<THREE.Group>(null);
  const wingLRef = useRef<THREE.Group>(null);
  const wingRRef = useRef<THREE.Group>(null);
  const popProgress = useRef(0);

  useFrame((state, delta) => {
    // Pop progress
    if (isPopped) {
      popProgress.current = THREE.MathUtils.lerp(popProgress.current, 1, delta * 8);
    } else {
      popProgress.current = THREE.MathUtils.lerp(popProgress.current, 0, delta * 5);
    }

    if (ayamRef.current) {
      const t = state.clock.getElapsedTime();
      // Gentle floating bob
      ayamRef.current.position.y = position[1] + Math.sin(t * 2) * 0.12 + popProgress.current * 0.3;
      // Continuous 360 spin showcase
      ayamRef.current.rotation.y += delta * 0.5;
    }

    // Wings Flutter on click
    if (wingLRef.current && wingRRef.current) {
      const t = state.clock.getElapsedTime();
      if (isPopped) {
        wingLRef.current.rotation.z = -0.3 + Math.sin(t * 40) * 0.6;
        wingRRef.current.rotation.z = 0.3 - Math.sin(t * 40) * 0.6;
      } else {
        wingLRef.current.rotation.z = -0.3 + Math.sin(t * 3) * 0.08;
        wingRRef.current.rotation.z = 0.3 - Math.sin(t * 3) * 0.08;
      }
    }
  });

  const p = popProgress.current;

  return (
    <group ref={ayamRef} position={position} onClick={onClick} scale={0.9}>
      {/* ================= A. CHIBI GOLDEN BODY ================= */}
      <mesh position={[0, 0, 0]} scale={[0.9, 0.85, 0.95]}>
        <sphereGeometry args={[0.95, 48, 48]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.88}
          roughness={0.14}
          emissive="#D97706"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Cute Golden Chest */}
      <mesh position={[0, -0.05, 0.65]} scale={[0.75, 0.75, 0.6]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color="#FFFBEB"
          metalness={0.25}
          roughness={0.25}
          emissive="#FEF3C7"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* ================= B. HEAD & FACE ================= */}
      <group position={[0, 0.68, 0.45]}>
        <mesh scale={[0.95, 0.95, 0.95]}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.88}
            roughness={0.14}
            emissive="#D97706"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Rooster Comb */}
        <group position={[0, 0.58, -0.05]} rotation={[-0.1, 0, 0]}>
          <mesh position={[0, 0.14, 0]} scale={[0.18, 0.4, 0.35]}>
            <sphereGeometry args={[0.45, 24, 24]} />
            <meshStandardMaterial color="#DC2626" metalness={0.15} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.05, 0.2]} scale={[0.16, 0.32, 0.28]}>
            <sphereGeometry args={[0.4, 24, 24]} />
            <meshStandardMaterial color="#EF4444" metalness={0.15} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.05, -0.2]} scale={[0.16, 0.35, 0.28]}>
            <sphereGeometry args={[0.4, 24, 24]} />
            <meshStandardMaterial color="#B91C1C" metalness={0.15} roughness={0.3} />
          </mesh>
        </group>

        {/* Orange Beak */}
        <mesh position={[0, -0.06, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.16, 0.36, 24]} />
          <meshStandardMaterial color="#F97316" metalness={0.2} roughness={0.25} />
        </mesh>

        {/* Red Wattle */}
        <group position={[0, -0.28, 0.48]}>
          <mesh position={[-0.05, 0, 0]} scale={[0.07, 0.2, 0.12]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#DC2626" metalness={0.15} roughness={0.3} />
          </mesh>
          <mesh position={[0.05, 0, 0]} scale={[0.07, 0.2, 0.12]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#DC2626" metalness={0.15} roughness={0.3} />
          </mesh>
        </group>

        {/* Big Glossy Eyes */}
        <group position={[-0.28, 0.12, 0.42]}>
          <mesh scale={[1, 1.2, 0.75]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color="#0F172A" roughness={0.05} metalness={0.1} />
          </mesh>
          <mesh position={[-0.04, 0.05, 0.12]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0.04, -0.04, 0.11]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>
        <group position={[0.28, 0.12, 0.42]}>
          <mesh scale={[1, 1.2, 0.75]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color="#0F172A" roughness={0.05} metalness={0.1} />
          </mesh>
          <mesh position={[-0.04, 0.05, 0.12]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0.04, -0.04, 0.11]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>

        {/* Blushing Cheeks */}
        <mesh position={[-0.42, -0.06, 0.36]} rotation={[0, -0.4, 0]}>
          <circleGeometry args={[0.12, 16]} />
          <meshBasicMaterial color="#FF6584" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.42, -0.06, 0.36]} rotation={[0, 0.4, 0]}>
          <circleGeometry args={[0.12, 16]} />
          <meshBasicMaterial color="#FF6584" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* ================= C. WINGS ================= */}
      <group ref={wingLRef} position={[-0.85, 0.05, 0.05]} rotation={[0.2, 0.3, -0.3]}>
        <mesh scale={[0.2, 0.65, 0.75]}>
          <sphereGeometry args={[0.7, 24, 24]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[-0.1, 0, 0]} scale={[0.12, 0.45, 0.55]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#10B981" metalness={0.4} roughness={0.3} />
        </mesh>
      </group>
      <group ref={wingRRef} position={[0.85, 0.05, 0.05]} rotation={[0.2, -0.3, 0.3]}>
        <mesh scale={[0.2, 0.65, 0.75]}>
          <sphereGeometry args={[0.7, 24, 24]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0.1, 0, 0]} scale={[0.12, 0.45, 0.55]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#10B981" metalness={0.4} roughness={0.3} />
        </mesh>
      </group>

      {/* ================= D. TAIL FEATHERS ================= */}
      <group position={[0, 0.35, -0.85]} rotation={[-0.45, 0, 0]}>
        <mesh position={[0, 0.55, -0.15]} rotation={[-0.2, 0, 0]} scale={[0.14, 0.95, 0.35]}>
          <cylinderGeometry args={[0.08, 0.38, 1.0, 16]} />
          <meshStandardMaterial
            color="#047857"
            metalness={0.65}
            roughness={0.25}
            emissive="#065F46"
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh position={[-0.18, 0.35, -0.08]} rotation={[-0.15, 0.2, -0.35]} scale={[0.12, 0.75, 0.3]}>
          <cylinderGeometry args={[0.06, 0.32, 0.85, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.88} roughness={0.15} />
        </mesh>
        <mesh position={[0.18, 0.35, -0.08]} rotation={[-0.15, -0.2, 0.35]} scale={[0.12, 0.75, 0.3]}>
          <cylinderGeometry args={[0.06, 0.32, 0.85, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.88} roughness={0.15} />
        </mesh>
      </group>

      {/* ================= E. COIN SLOT & COIN FOUNTAIN ================= */}
      <mesh position={[0, 0.98, -0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.65, 0.12]} />
        <meshBasicMaterial color="#451A03" />
      </mesh>

      {/* Main Center Floating Coin */}
      <group position={[0, 1.55 + p * 0.8, -0.15]} rotation={[0, p * 12, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
          <meshStandardMaterial
            color="#FFE066"
            metalness={0.95}
            roughness={0.1}
            emissive="#F59E0B"
            emissiveIntensity={0.35 + p * 0.6}
          />
        </mesh>
        <mesh position={[0, 0, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.02, 32]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <octahedronGeometry args={[0.13, 0]} />
          <meshStandardMaterial color="#FFFBEB" metalness={0.98} roughness={0.05} />
        </mesh>
      </group>

      {/* Coin Fountain Particle Left */}
      <group
        position={[-p * 0.6, 1.3 + p * 1.3, -0.15 + p * 0.3]}
        rotation={[p * 8, p * 6, 0]}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 24]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.95}
            roughness={0.1}
            emissive="#F59E0B"
            emissiveIntensity={p}
          />
        </mesh>
      </group>

      {/* Coin Fountain Particle Right */}
      <group
        position={[p * 0.6, 1.3 + p * 1.3, -0.15 - p * 0.3]}
        rotation={[p * 6, -p * 8, 0]}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 24]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.95}
            roughness={0.1}
            emissive="#F59E0B"
            emissiveIntensity={p}
          />
        </mesh>
      </group>

      {/* ================= F. FEET ================= */}
      <group position={[-0.35, -0.85, 0.1]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.07, 0.28, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.15, 0.06]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.24, 0.05, 0.28]} />
          <meshStandardMaterial color="#D97706" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      <group position={[0.35, -0.85, 0.1]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.07, 0.28, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.15, 0.06]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.24, 0.05, 0.28]} />
          <meshStandardMaterial color="#D97706" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 4. MAIN 360 ROTATING CAROUSEL DIORAMA
// =========================================================================
function CarouselDiorama({
  mousePos,
  isAyamPopped,
  isWalletPopped,
  isSembakoPopped,
  triggerAyam,
  triggerWallet,
  triggerSembako,
}: {
  mousePos: { x: number; y: number };
  isAyamPopped: boolean;
  isWalletPopped: boolean;
  isSembakoPopped: boolean;
  triggerAyam: (e?: any) => void;
  triggerWallet: (e?: any) => void;
  triggerSembako: (e?: any) => void;
}) {
  const carouselRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (carouselRef.current) {
      // Continuous 360-degree circular turntable rotation!
      carouselRef.current.rotation.y += delta * 0.38;

      // Mouse Parallax tilt
      carouselRef.current.rotation.x = THREE.MathUtils.lerp(
        carouselRef.current.rotation.x,
        0.1 - mousePos.y * 0.18,
        0.06
      );
      carouselRef.current.rotation.z = THREE.MathUtils.lerp(
        carouselRef.current.rotation.z,
        -mousePos.x * 0.12,
        0.06
      );
    }
  });

  return (
    <group ref={carouselRef} position={[0, 0, 0]}>
      {/* 1. GLOWING 3D GOLDEN CAROUSEL PEDESTAL (Piringan Platform Melingkar 360) */}
      <mesh position={[0, -1.35, 0]}>
        <cylinderGeometry args={[2.8, 3.0, 0.18, 64]} />
        <meshStandardMaterial
          color="#064E3B"
          metalness={0.4}
          roughness={0.3}
          emissive="#047857"
          emissiveIntensity={0.45}
        />
      </mesh>
      {/* Glowing Gold Ring around Pedestal */}
      <mesh position={[0, -1.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.7, 2.85, 64]} />
        <meshStandardMaterial
          color="#F59E0B"
          metalness={0.95}
          roughness={0.1}
          emissive="#FBBF24"
          emissiveIntensity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. CELENGAN AYAM JAGO EMAS (Posisi 0 Derajat Depan/Tengah) */}
      <CuteCelenganAyam
        position={[0, 0.15, 1.4]}
        mousePos={mousePos}
        isPopped={isAyamPopped}
        onClick={triggerAyam}
      />

      {/* 3. DOMPET BERKAH (Posisi 120 Derajat Kiri-Belakang) */}
      <DompetBerkah
        position={[-1.6, -0.2, -0.9]}
        mousePos={mousePos}
        isPopped={isWalletPopped}
        onClick={triggerWallet}
      />

      {/* 4. PAKET KERANJANG SEMBAKO (Posisi 240 Derajat Kanan-Belakang) */}
      <PaketSembakoHampers
        position={[1.6, -0.2, -0.9]}
        mousePos={mousePos}
        isPopped={isSembakoPopped}
        onClick={triggerSembako}
      />
    </group>
  );
}

// =========================================================================
// MAIN CANVAS CONTAINER
// =========================================================================
export const ThreeHeroCanvas: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState(true);

  // Pop-Out Explosion Animation states on Click!
  const [isAyamPopped, setIsAyamPopped] = useState(false);
  const [isWalletPopped, setIsWalletPopped] = useState(false);
  const [isSembakoPopped, setIsSembakoPopped] = useState(false);

  const triggerAyam = (e?: any) => {
    if (e) e.stopPropagation();
    setIsAyamPopped(true);
    setTimeout(() => setIsAyamPopped(false), 1400);
  };

  const triggerWallet = (e?: any) => {
    if (e) e.stopPropagation();
    setIsWalletPopped(true);
    setTimeout(() => setIsWalletPopped(false), 1400);
  };

  const triggerSembako = (e?: any) => {
    if (e) e.stopPropagation();
    setIsSembakoPopped(true);
    setTimeout(() => setIsSembakoPopped(false), 1400);
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
          <span className="text-6xl">🐔👛🧺</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[430px] w-full sm:h-[490px] lg:h-[540px] cursor-pointer select-none">
      <Canvas
        camera={{ position: [0, 1.2, 6.6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        {/* Warm 3-Point Studio Lighting */}
        <ambientLight intensity={1.5} color="#FFFDF0" />
        <directionalLight position={[4, 8, 5]} intensity={2.8} color="#FFFBEB" />
        <pointLight position={[-4, -2, 2]} intensity={2.2} color="#10B981" />
        <pointLight position={[3, 3, -3.5]} intensity={3.8} color="#F59E0B" />
        <pointLight position={[-3, 4, -2.5]} intensity={2.5} color="#FCD34D" />

        {/* Ambient Sparkles */}
        <Sparkles count={60} scale={7.5} size={3.8} speed={0.5} color="#FDE68A" opacity={0.85} />
        <Sparkles count={35} scale={6.0} size={2.8} speed={0.3} color="#6EE7B7" opacity={0.7} />

        {/* 360 CONTINUOUS ROTATING CAROUSEL DIORAMA */}
        <CarouselDiorama
          mousePos={mousePos}
          isAyamPopped={isAyamPopped}
          isWalletPopped={isWalletPopped}
          isSembakoPopped={isSembakoPopped}
          triggerAyam={triggerAyam}
          triggerWallet={triggerWallet}
          triggerSembako={triggerSembako}
        />
      </Canvas>
    </div>
  );
};
