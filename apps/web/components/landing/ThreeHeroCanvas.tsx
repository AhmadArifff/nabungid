'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Ultra-Smooth Organic Spring & Float Physics Curve Calculator
function calculatePopPhysics(
  elapsedTime: number,
  duration: number = 2.4,
  staggerDelay: number = 0
): { progress: number; floatY: number; spin: number; glow: number } {
  const t = Math.max(0, elapsedTime - staggerDelay);
  if (t <= 0 || t >= duration) {
    return { progress: 0, floatY: 0, spin: 0, glow: 0 };
  }

  const norm = t / duration; // 0.0 to 1.0

  let progress = 0;
  if (norm < 0.28) {
    // Phase 1: Juicy Spring Ease-Out with Elastic Overshoot (0.0 -> 1.18 -> 1.0)
    const p = norm / 0.28;
    const c4 = (2 * Math.PI) / 3.2;
    progress = p === 0 ? 0 : p === 1 ? 1 : Math.pow(2, -8 * p) * Math.sin((p * 9 - 0.75) * c4) + 1;
  } else if (norm < 0.72) {
    // Phase 2: Zero-Gravity Floating Apex (Soft Harmonic Levitation)
    const p = (norm - 0.28) / 0.44;
    progress = 1.0 + Math.sin(p * Math.PI * 2) * 0.08;
  } else {
    // Phase 3: Smooth Magnetic Glide Back In (Smooth Cubic Ease-In-Out)
    const p = (norm - 0.72) / 0.28;
    const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    progress = Math.max(0, 1.0 - ease);
  }

  const floatY = Math.sin(t * 6) * 0.06 * progress;
  const spin = t * 4 * progress;
  const glow = Math.sin(norm * Math.PI) * progress;

  return { progress: Math.max(0, progress), floatY, spin, glow };
}

// =========================================================================
// 1. DOMPET BERKAH WITH ULTRA-SMOOTH POPPING MONEY & COINS
// =========================================================================
function DompetBerkah({
  position,
  mousePos,
  popTimestamp,
  onClick,
}: {
  position: [number, number, number];
  mousePos: { x: number; y: number };
  popTimestamp: number;
  onClick: (e: any) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const animTimeRef = useRef(999);

  useFrame((state, delta) => {
    const now = state.clock.getElapsedTime();
    if (popTimestamp > 0) {
      animTimeRef.current = now - popTimestamp;
    }

    if (groupRef.current) {
      const t = now;
      // Gentle idle vertical bobbing
      const idleBob = Math.sin(t * 2 + 1.2) * 0.1;
      groupRef.current.position.y = position[1] + idleBob;
      // Continuous 360 spin
      groupRef.current.rotation.y += delta * 0.5;

      // Subtle squash and stretch during pop launch
      const basePhys = calculatePopPhysics(animTimeRef.current, 2.4, 0);
      if (basePhys.progress > 0) {
        const squash = Math.sin(animTimeRef.current * 8) * 0.06 * basePhys.progress;
        groupRef.current.scale.set(0.88 + squash, 0.88 - squash, 0.88 + squash);
      } else {
        groupRef.current.scale.set(0.88, 0.88, 0.88);
      }
    }
  });

  const elapsed = animTimeRef.current;
  const note1 = calculatePopPhysics(elapsed, 2.4, 0.0);
  const note2 = calculatePopPhysics(elapsed, 2.4, 0.06);
  const note3 = calculatePopPhysics(elapsed, 2.4, 0.12);
  const note4 = calculatePopPhysics(elapsed, 2.4, 0.18);
  const coin1 = calculatePopPhysics(elapsed, 2.4, 0.04);
  const coin2 = calculatePopPhysics(elapsed, 2.4, 0.10);
  const coin3 = calculatePopPhysics(elapsed, 2.4, 0.16);

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
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

      {/* ================= SMOOTH POPPING BANKNOTES ================= */}
      {/* 1. Green Rp 20.000 (Left Fan Arc) */}
      <mesh
        position={[
          -0.25 - note1.progress * 0.55,
          0.45 + note1.progress * 0.95 + note1.floatY,
          note1.progress * 0.25,
        ]}
        rotation={[-0.15, 0.1, -0.15 - note1.progress * 0.4]}
      >
        <boxGeometry args={[0.85, 0.5, 0.02]} />
        <meshStandardMaterial
          color="#10B981"
          emissive="#059669"
          emissiveIntensity={note1.glow * 0.7}
          roughness={0.45}
        />
      </mesh>

      {/* 2. Blue Rp 50.000 (Right Fan Arc) */}
      <mesh
        position={[
          0.15 + note2.progress * 0.55,
          0.5 + note2.progress * 1.05 + note2.floatY,
          -0.05 + note2.progress * 0.25,
        ]}
        rotation={[-0.15, -0.1, 0.18 + note2.progress * 0.4]}
      >
        <boxGeometry args={[0.85, 0.5, 0.02]} />
        <meshStandardMaterial
          color="#3B82F6"
          emissive="#2563EB"
          emissiveIntensity={note2.glow * 0.7}
          roughness={0.45}
        />
      </mesh>

      {/* 3. Red Rp 100.000 (High Center Apex) */}
      <mesh
        position={[
          0,
          0.55 + note3.progress * 1.35 + note3.floatY,
          -0.1,
        ]}
        rotation={[-0.1 + note3.floatY * 0.5, 0, 0]}
      >
        <boxGeometry args={[0.85, 0.5, 0.02]} />
        <meshStandardMaterial
          color="#EF4444"
          emissive="#DC2626"
          emissiveIntensity={note3.glow * 0.8}
          roughness={0.45}
        />
      </mesh>

      {/* 4. Purple Rp 10.000 */}
      <mesh
        position={[
          -0.1 - note4.progress * 0.35,
          0.48 + note4.progress * 0.75 + note4.floatY,
          0.1,
        ]}
        rotation={[0.1, 0.2, -0.08 - note4.progress * 0.2]}
      >
        <boxGeometry args={[0.75, 0.45, 0.02]} />
        <meshStandardMaterial color="#8B5CF6" roughness={0.45} />
      </mesh>

      {/* ================= SMOOTH POPPING GOLD COINS ================= */}
      {/* Coin 1 */}
      <group
        position={[
          0.35 + coin1.progress * 0.65,
          0.3 + coin1.progress * 1.3 + coin1.floatY,
          0.3 + coin1.progress * 0.35,
        ]}
        rotation={[coin1.spin * 2, coin1.spin * 3, 0]}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 24]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.95}
            roughness={0.1}
            emissive="#F59E0B"
            emissiveIntensity={coin1.glow * 0.9}
          />
        </mesh>
      </group>

      {/* Coin 2 */}
      <group
        position={[
          -0.35 - coin2.progress * 0.65,
          0.3 + coin2.progress * 1.15 + coin2.floatY,
          0.2 + coin2.progress * 0.25,
        ]}
        rotation={[coin2.spin * 2.5, -coin2.spin * 2, 0]}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.05, 24]} />
          <meshStandardMaterial
            color="#FBBF24"
            metalness={0.95}
            roughness={0.1}
            emissive="#F59E0B"
            emissiveIntensity={coin2.glow * 0.9}
          />
        </mesh>
      </group>

      {/* Coin 3 (Apex High) */}
      <group
        position={[
          0,
          0.5 + coin3.progress * 1.55 + coin3.floatY,
          0.1 + coin3.progress * 0.45,
        ]}
        rotation={[coin3.spin * 3, coin3.spin * 1.5, 0]}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 24]} />
          <meshStandardMaterial
            color="#FFE066"
            metalness={0.98}
            roughness={0.08}
            emissive="#F59E0B"
            emissiveIntensity={coin3.glow}
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
// 2. PAKET KERANJANG SEMBAKO WITH ULTRA-SMOOTH POPPING FOOD ITEMS
// =========================================================================
function PaketSembakoHampers({
  position,
  mousePos,
  popTimestamp,
  onClick,
}: {
  position: [number, number, number];
  mousePos: { x: number; y: number };
  popTimestamp: number;
  onClick: (e: any) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const animTimeRef = useRef(999);

  useFrame((state, delta) => {
    const now = state.clock.getElapsedTime();
    if (popTimestamp > 0) {
      animTimeRef.current = now - popTimestamp;
    }

    if (groupRef.current) {
      const t = now;
      // Gentle idle vertical bobbing
      const idleBob = Math.sin(t * 2 + 2.4) * 0.1;
      groupRef.current.position.y = position[1] + idleBob;
      // Continuous 360 spin
      groupRef.current.rotation.y += delta * 0.5;

      // Subtle squash and stretch during launch
      const basePhys = calculatePopPhysics(animTimeRef.current, 2.4, 0);
      if (basePhys.progress > 0) {
        const squash = Math.sin(animTimeRef.current * 8) * 0.06 * basePhys.progress;
        groupRef.current.scale.set(0.88 + squash, 0.88 - squash, 0.88 + squash);
      } else {
        groupRef.current.scale.set(0.88, 0.88, 0.88);
      }
    }
  });

  const elapsed = animTimeRef.current;
  const rice = calculatePopPhysics(elapsed, 2.4, 0.0);
  const oil = calculatePopPhysics(elapsed, 2.4, 0.06);
  const biscuit = calculatePopPhysics(elapsed, 2.4, 0.12);
  const egg = calculatePopPhysics(elapsed, 2.4, 0.18);
  const ketupat = calculatePopPhysics(elapsed, 2.4, 0.22);

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
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

      {/* ================= SMOOTH POPPING FOOD ITEMS ================= */}
      {/* 1. Karung Beras 5KG (Shoots up-left and floats gracefully) */}
      <group
        position={[
          -0.32 - rice.progress * 0.6,
          0.35 + rice.progress * 1.1 + rice.floatY,
          -0.15 + rice.progress * 0.25,
        ]}
        rotation={[0.1 + rice.progress * 0.25, 0.3 + rice.progress * 0.4, -0.1 - rice.progress * 0.25]}
      >
        <mesh>
          <capsuleGeometry args={[0.26, 0.45, 16, 16]} />
          <meshStandardMaterial
            color="#FEF3C7"
            roughness={0.5}
            emissive="#FDE68A"
            emissiveIntensity={rice.glow * 0.5}
          />
        </mesh>
        <mesh position={[0, 0, 0.25]}>
          <planeGeometry args={[0.3, 0.2]} />
          <meshBasicMaterial color="#059669" />
        </mesh>
      </group>

      {/* 2. Botol Minyak Goreng (Shoots up-right with glowing golden liquid) */}
      <group
        position={[
          0.35 + oil.progress * 0.65,
          0.42 + oil.progress * 1.25 + oil.floatY,
          -0.1 + oil.progress * 0.25,
        ]}
        rotation={[-0.1 - oil.progress * 0.25, -0.2 + oil.progress * 0.5, 0.1 + oil.progress * 0.3]}
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
            emissiveIntensity={0.35 + oil.glow * 0.6}
          />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.1, 16]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
      </group>

      {/* 3. Kaleng Biskuit Merah (Shoots high center and spins playfully) */}
      <group
        position={[
          0.25 - biscuit.progress * 0.25,
          0.18 + biscuit.progress * 1.45 + biscuit.floatY,
          0.32 - biscuit.progress * 0.25,
        ]}
        rotation={[biscuit.floatY * 0.8, 0.4 + biscuit.spin * 1.2, biscuit.floatY * 0.4]}
      >
        <mesh>
          <boxGeometry args={[0.42, 0.38, 0.42]} />
          <meshStandardMaterial
            color="#B91C1C"
            metalness={0.65}
            roughness={0.25}
            emissive="#EF4444"
            emissiveIntensity={biscuit.glow * 0.5}
          />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.44, 0.05, 0.44]} />
          <meshStandardMaterial color="#FCD34D" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* 4. Fresh Eggs (Floating and bobbing in front) */}
      <group position={[-0.25 - egg.progress * 0.35, 0.15 + egg.progress * 0.85 + egg.floatY, 0.38 + egg.progress * 0.45]}>
        <mesh position={[-0.1, 0, 0]} scale={[0.8, 1.1, 0.8]} rotation={[egg.spin, 0, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#D97706" roughness={0.4} />
        </mesh>
        <mesh position={[0.1, 0, 0]} scale={[0.8, 1.1, 0.8]} rotation={[0, egg.spin, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#D97706" roughness={0.4} />
        </mesh>
      </group>

      {/* 5. Mini Ketupat (Spinning diamond gem high up) */}
      <group
        position={[
          -0.6 - ketupat.progress * 0.45,
          0.15 + ketupat.progress * 1.25 + ketupat.floatY,
          0.45 + ketupat.progress * 0.35,
        ]}
        rotation={[0, ketupat.spin * 1.5, Math.PI / 4 + ketupat.spin * 0.8]}
        scale={0.45 + ketupat.progress * 0.25}
      >
        <mesh>
          <boxGeometry args={[0.45, 0.45, 0.2]} />
          <meshStandardMaterial
            color="#10B981"
            emissive="#047857"
            emissiveIntensity={0.3 + ketupat.glow * 0.6}
          />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 3. CELENGAN AYAM JAGO EMAS WITH ULTRA-SMOOTH COIN FOUNTAIN
// =========================================================================
function CuteCelenganAyam({
  position,
  mousePos,
  popTimestamp,
  onClick,
}: {
  position: [number, number, number];
  mousePos: { x: number; y: number };
  popTimestamp: number;
  onClick: (e: any) => void;
}) {
  const ayamRef = useRef<THREE.Group>(null);
  const wingLRef = useRef<THREE.Group>(null);
  const wingRRef = useRef<THREE.Group>(null);
  const animTimeRef = useRef(999);

  useFrame((state, delta) => {
    const now = state.clock.getElapsedTime();
    if (popTimestamp > 0) {
      animTimeRef.current = now - popTimestamp;
    }

    if (ayamRef.current) {
      const t = now;
      const basePhys = calculatePopPhysics(animTimeRef.current, 2.4, 0);
      // Gentle floating bob + joyful jump on click
      ayamRef.current.position.y = position[1] + Math.sin(t * 2) * 0.12 + basePhys.progress * 0.35;
      // Continuous 360 spin
      ayamRef.current.rotation.y += delta * 0.5;
    }

    // Wings Flutter on click
    if (wingLRef.current && wingRRef.current) {
      const t = state.clock.getElapsedTime();
      const basePhys = calculatePopPhysics(animTimeRef.current, 2.4, 0);
      if (basePhys.progress > 0) {
        wingLRef.current.rotation.z = -0.3 + Math.sin(t * 35) * 0.6 * basePhys.progress;
        wingRRef.current.rotation.z = 0.3 - Math.sin(t * 35) * 0.6 * basePhys.progress;
      } else {
        wingLRef.current.rotation.z = -0.3 + Math.sin(t * 3) * 0.08;
        wingRRef.current.rotation.z = 0.3 - Math.sin(t * 3) * 0.08;
      }
    }
  });

  const elapsed = animTimeRef.current;
  const coinMain = calculatePopPhysics(elapsed, 2.4, 0.0);
  const coinL = calculatePopPhysics(elapsed, 2.4, 0.08);
  const coinR = calculatePopPhysics(elapsed, 2.4, 0.14);

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

      {/* ================= E. COIN SLOT & SMOOTH COIN FOUNTAIN ================= */}
      <mesh position={[0, 0.98, -0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.65, 0.12]} />
        <meshBasicMaterial color="#451A03" />
      </mesh>

      {/* Center Main Coin */}
      <group
        position={[
          0,
          1.55 + coinMain.progress * 0.95 + coinMain.floatY,
          -0.15,
        ]}
        rotation={[0, coinMain.spin * 2, 0]}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
          <meshStandardMaterial
            color="#FFE066"
            metalness={0.95}
            roughness={0.1}
            emissive="#F59E0B"
            emissiveIntensity={0.35 + coinMain.glow * 0.7}
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

      {/* Fountain Left Coin */}
      <group
        position={[
          -coinL.progress * 0.65,
          1.3 + coinL.progress * 1.45 + coinL.floatY,
          -0.15 + coinL.progress * 0.35,
        ]}
        rotation={[coinL.spin * 2, coinL.spin * 1.5, 0]}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 24]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.95}
            roughness={0.1}
            emissive="#F59E0B"
            emissiveIntensity={coinL.glow}
          />
        </mesh>
      </group>

      {/* Fountain Right Coin */}
      <group
        position={[
          coinR.progress * 0.65,
          1.3 + coinR.progress * 1.45 + coinR.floatY,
          -0.15 - coinR.progress * 0.35,
        ]}
        rotation={[coinR.spin * 1.5, -coinR.spin * 2, 0]}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 24]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.95}
            roughness={0.1}
            emissive="#F59E0B"
            emissiveIntensity={coinR.glow}
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
  ayamPopTime,
  walletPopTime,
  sembakoPopTime,
  triggerAyam,
  triggerWallet,
  triggerSembako,
}: {
  mousePos: { x: number; y: number };
  ayamPopTime: number;
  walletPopTime: number;
  sembakoPopTime: number;
  triggerAyam: (e?: any) => void;
  triggerWallet: (e?: any) => void;
  triggerSembako: (e?: any) => void;
}) {
  const carouselRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (carouselRef.current) {
      // Continuous 360-degree turntable rotation
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
      {/* 1. GLOWING 3D GOLDEN CAROUSEL PEDESTAL */}
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

      {/* 2. CELENGAN AYAM JAGO EMAS (Depan) */}
      <CuteCelenganAyam
        position={[0, 0.15, 1.4]}
        mousePos={mousePos}
        popTimestamp={ayamPopTime}
        onClick={triggerAyam}
      />

      {/* 3. DOMPET BERKAH (Kiri-Belakang) */}
      <DompetBerkah
        position={[-1.6, -0.2, -0.9]}
        mousePos={mousePos}
        popTimestamp={walletPopTime}
        onClick={triggerWallet}
      />

      {/* 4. PAKET KERANJANG SEMBAKO (Kanan-Belakang) */}
      <PaketSembakoHampers
        position={[1.6, -0.2, -0.9]}
        mousePos={mousePos}
        popTimestamp={sembakoPopTime}
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

  // Exact clock timestamps for mathematically continuous smooth physics
  const [ayamPopTime, setAyamPopTime] = useState(0);
  const [walletPopTime, setWalletPopTime] = useState(0);
  const [sembakoPopTime, setSembakoPopTime] = useState(0);
  const clockRef = useRef<THREE.Clock | null>(null);

  const triggerAyam = (e?: any) => {
    if (e) e.stopPropagation();
    if (clockRef.current) setAyamPopTime(clockRef.current.getElapsedTime());
  };

  const triggerWallet = (e?: any) => {
    if (e) e.stopPropagation();
    if (clockRef.current) setWalletPopTime(clockRef.current.getElapsedTime());
  };

  const triggerSembako = (e?: any) => {
    if (e) e.stopPropagation();
    if (clockRef.current) setSembakoPopTime(clockRef.current.getElapsedTime());
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
        onCreated={({ clock }) => {
          clockRef.current = clock;
        }}
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
          ayamPopTime={ayamPopTime}
          walletPopTime={walletPopTime}
          sembakoPopTime={sembakoPopTime}
          triggerAyam={triggerAyam}
          triggerWallet={triggerWallet}
          triggerSembako={triggerSembako}
        />
      </Canvas>
    </div>
  );
};
