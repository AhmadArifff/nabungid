'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Vertically-Oriented Spinning Gold Coin (Spins like a real coin on its edge!)
function SpinningGoldCoin({
  radius = 3.2,
  speed = 0.6,
  yOffset = 0,
  phase = 0,
  scale = 0.6,
}: {
  radius?: number;
  speed?: number;
  yOffset?: number;
  phase?: number;
  scale?: number;
}) {
  const orbitGroup = useRef<THREE.Group>(null);
  const spinMesh = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // 1. Orbit around the center scene
    if (orbitGroup.current) {
      const t = state.clock.getElapsedTime() * speed + phase;
      orbitGroup.current.position.x = Math.cos(t) * radius;
      orbitGroup.current.position.z = Math.sin(t) * radius;
      orbitGroup.current.position.y = yOffset + Math.sin(t * 2.5) * 0.25;
    }
    // 2. Continuous 3D vertical coin spin (showing both faces & star emblem)
    if (spinMesh.current) {
      spinMesh.current.rotation.y += delta * 3.5;
    }
  });

  return (
    <group ref={orbitGroup} scale={scale}>
      <group ref={spinMesh}>
        {/* Coin Cylinder standing vertically */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.08, 32]} />
          <meshStandardMaterial
            color="#FFE066"
            metalness={0.94}
            roughness={0.1}
            emissive="#D97706"
            emissiveIntensity={0.35}
          />
        </mesh>
        {/* Front Emboss */}
        <mesh position={[0, 0, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.02, 32]} />
          <meshStandardMaterial color="#FFB800" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Front Star */}
        <mesh position={[0, 0, 0.06]}>
          <octahedronGeometry args={[0.13, 0]} />
          <meshStandardMaterial color="#FFFBEB" metalness={0.98} roughness={0.05} />
        </mesh>
        {/* Back Emboss */}
        <mesh position={[0, 0, -0.045]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.02, 32]} />
          <meshStandardMaterial color="#FFB800" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Back Star */}
        <mesh position={[0, 0, -0.06]}>
          <octahedronGeometry args={[0.13, 0]} />
          <meshStandardMaterial color="#FFFBEB" metalness={0.98} roughness={0.05} />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 1. DOMPET BERKAH (Floating & Spinning Emerald Wallet)
// =========================================================================
function DompetBerkah({
  position,
  mousePos,
  isWobbling,
  onClick,
}: {
  position: [number, number, number];
  mousePos: { x: number; y: number };
  isWobbling: boolean;
  onClick: (e: any) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const spinAngle = useRef(0);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      // Independent gentle vertical floating
      groupRef.current.position.y = position[1] + Math.sin(t * 2 + 1.2) * 0.14;

      if (isWobbling) {
        // Fast 360 Full Pirouette Spin on Click!
        spinAngle.current += delta * 16;
        groupRef.current.rotation.y = spinAngle.current;
        groupRef.current.scale.setScalar(0.95 + Math.sin(t * 25) * 0.1);
      } else {
        // Smooth continuous 3D rotating sway + mouse look-at
        const targetYaw = -0.3 + Math.sin(t * 1.2) * 0.35 + mousePos.x * 0.25;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetYaw, 0.08);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          0.15 + Math.cos(t * 1.0) * 0.1 - mousePos.y * 0.15,
          0.08
        );
        groupRef.current.rotation.z = Math.sin(t * 1.4) * 0.08;
        groupRef.current.scale.setScalar(0.82);
      }
    }
  });

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

      {/* Fanned Banknotes */}
      <group position={[0, 0.48, 0]} rotation={[-0.15, 0.15, 0.08]}>
        {/* Green 20k/100k */}
        <mesh position={[-0.18, 0, 0]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.85, 0.5, 0.02]} />
          <meshStandardMaterial color="#10B981" roughness={0.5} />
        </mesh>
        {/* Blue 50k */}
        <mesh position={[0.12, 0.06, -0.04]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[0.85, 0.5, 0.02]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.5} />
        </mesh>
        {/* Red 100k */}
        <mesh position={[0, 0.1, -0.08]} rotation={[0, 0, -0.04]}>
          <boxGeometry args={[0.85, 0.5, 0.02]} />
          <meshStandardMaterial color="#EF4444" roughness={0.5} />
        </mesh>
      </group>

      {/* Shiny Spilling Gold Coins */}
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
// 2. PAKET KERANJANG SEMBAKO (Floating & Rotating Hampers Basket)
// =========================================================================
function PaketSembakoHampers({
  position,
  mousePos,
  isWobbling,
  onClick,
}: {
  position: [number, number, number];
  mousePos: { x: number; y: number };
  isWobbling: boolean;
  onClick: (e: any) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const spinAngle = useRef(0);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      // Independent gentle vertical floating
      groupRef.current.position.y = position[1] + Math.sin(t * 2 + 2.4) * 0.14;

      if (isWobbling) {
        // Fast 360 Full Spin on Click!
        spinAngle.current += delta * 16;
        groupRef.current.rotation.y = spinAngle.current;
        groupRef.current.scale.setScalar(0.95 + Math.sin(t * 25) * 0.1);
      } else {
        // Smooth continuous 3D rotating sway + mouse look-at
        const targetYaw = 0.35 + Math.sin(t * 1.1 + 1) * 0.35 + mousePos.x * 0.25;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetYaw, 0.08);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          0.15 + Math.cos(t * 1.0) * 0.1 - mousePos.y * 0.15,
          0.08
        );
        groupRef.current.rotation.z = Math.sin(t * 1.3) * 0.08;
        groupRef.current.scale.setScalar(0.82);
      }
    }
  });

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

      {/* 1. Mini Rice Sack */}
      <group position={[-0.32, 0.35, -0.15]} rotation={[0.1, 0.3, -0.1]}>
        <mesh>
          <capsuleGeometry args={[0.26, 0.45, 16, 16]} />
          <meshStandardMaterial color="#FEF3C7" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.25]}>
          <planeGeometry args={[0.3, 0.2]} />
          <meshBasicMaterial color="#059669" />
        </mesh>
      </group>

      {/* 2. Cooking Oil Bottle */}
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
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.1, 16]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
      </group>

      {/* 3. Red Cookie/Biscuit Tin */}
      <group position={[0.25, 0.18, 0.32]} rotation={[0, 0.4, 0]}>
        <mesh>
          <boxGeometry args={[0.42, 0.38, 0.42]} />
          <meshStandardMaterial color="#B91C1C" metalness={0.65} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.44, 0.05, 0.44]} />
          <meshStandardMaterial color="#FCD34D" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* 4. Fresh Eggs in Front */}
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

      {/* 5. Mini Ketupat */}
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
// 3. CELENGAN AYAM JAGO EMAS IMUT (Chibi Golden Rooster with Smooth 3D Spin)
// =========================================================================
function CuteCelenganAyam({
  mousePos,
  isWobbling,
  onClick,
}: {
  mousePos: { x: number; y: number };
  isWobbling: boolean;
  onClick: (e: any) => void;
}) {
  const ayamRef = useRef<THREE.Group>(null);
  const coinTopMesh = useRef<THREE.Group>(null);
  const wingLRef = useRef<THREE.Group>(null);
  const wingRRef = useRef<THREE.Group>(null);
  const spinAngle = useRef(0);

  useFrame((state, delta) => {
    if (ayamRef.current) {
      const t = state.clock.getElapsedTime();
      // Gentle vertical floating bob
      ayamRef.current.position.y = 0.15 + Math.sin(t * 2) * 0.14;

      if (isWobbling) {
        // Fast 360 Pirouette Spin on Click!
        spinAngle.current += delta * 16;
        ayamRef.current.rotation.y = spinAngle.current;
        ayamRef.current.scale.setScalar(0.98 + Math.sin(t * 25) * 0.08);
      } else {
        // Continuous smooth 3D rotating yaw (smooth turntable showcase) + mouse tracking
        const targetYaw = Math.sin(t * 0.9) * 0.4 + mousePos.x * 0.35;
        ayamRef.current.rotation.y = THREE.MathUtils.lerp(ayamRef.current.rotation.y, targetYaw, 0.08);
        ayamRef.current.rotation.x = THREE.MathUtils.lerp(
          ayamRef.current.rotation.x,
          Math.sin(t * 0.7) * 0.08 - mousePos.y * 0.2,
          0.08
        );
        ayamRef.current.rotation.z = Math.sin(t * 1.2) * 0.06;
        ayamRef.current.scale.setScalar(0.86);
      }
    }

    // Wings Flutter
    if (wingLRef.current && wingRRef.current) {
      const t = state.clock.getElapsedTime();
      if (isWobbling) {
        wingLRef.current.rotation.z = -0.3 + Math.sin(t * 40) * 0.5;
        wingRRef.current.rotation.z = 0.3 - Math.sin(t * 40) * 0.5;
      } else {
        wingLRef.current.rotation.z = -0.3 + Math.sin(t * 3) * 0.1;
        wingRRef.current.rotation.z = 0.3 - Math.sin(t * 3) * 0.1;
      }
    }

    // Vertically Spinning Floating Gold Coin above Slot!
    if (coinTopMesh.current) {
      const t = state.clock.getElapsedTime();
      coinTopMesh.current.position.y = 1.62 + Math.sin(t * 3.5) * 0.12;
      coinTopMesh.current.rotation.y += delta * 3.5;
    }
  });

  return (
    <group ref={ayamRef} position={[0, 0.15, 0.25]} onClick={onClick}>
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
        {/* Head Sphere */}
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

        {/* Rooster Comb (Jengger Merah) */}
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

        {/* Small Orange Beak */}
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

      {/* ================= E. COIN SLOT & VERTICALLY SPINNING TOP COIN ================= */}
      <mesh position={[0, 0.98, -0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.65, 0.12]} />
        <meshBasicMaterial color="#451A03" />
      </mesh>

      {/* Floating Vertically Oriented Spinning Gold Coin */}
      <group ref={coinTopMesh} position={[0, 1.62, -0.15]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
          <meshStandardMaterial
            color="#FFE066"
            metalness={0.95}
            roughness={0.1}
            emissive="#F59E0B"
            emissiveIntensity={0.35}
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
        <mesh position={[0, 0, -0.045]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.02, 32]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0, -0.06]}>
          <octahedronGeometry args={[0.13, 0]} />
          <meshStandardMaterial color="#FFFBEB" metalness={0.98} roughness={0.05} />
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
// MAIN 3D CANVAS COMPONENT
// =========================================================================
export const ThreeHeroCanvas: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState(true);

  // Individual click wobble animations
  const [isAyamWobbling, setIsAyamWobbling] = useState(false);
  const [isWalletWobbling, setIsWalletWobbling] = useState(false);
  const [isSembakoWobbling, setIsSembakoWobbling] = useState(false);

  const triggerAyam = (e?: any) => {
    if (e) e.stopPropagation();
    setIsAyamWobbling(true);
    setTimeout(() => setIsAyamWobbling(false), 900);
  };

  const triggerWallet = (e?: any) => {
    if (e) e.stopPropagation();
    setIsWalletWobbling(true);
    setTimeout(() => setIsWalletWobbling(false), 900);
  };

  const triggerSembako = (e?: any) => {
    if (e) e.stopPropagation();
    setIsSembakoWobbling(true);
    setTimeout(() => setIsSembakoWobbling(false), 900);
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
    <div className="relative h-[420px] w-full sm:h-[480px] lg:h-[530px] cursor-pointer select-none">
      <Canvas
        camera={{ position: [0, 0.25, 7.2], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        {/* Warm Studio Lights */}
        <ambientLight intensity={1.4} color="#FFFDF0" />
        <directionalLight position={[4, 8, 5]} intensity={2.8} color="#FFFBEB" />
        <pointLight position={[-4, -2, 2]} intensity={2.2} color="#10B981" />
        <pointLight position={[3, 3, -3.5]} intensity={3.8} color="#F59E0B" />
        <pointLight position={[-3, 4, -2.5]} intensity={2.5} color="#FCD34D" />

        {/* Ambient Sparkles */}
        <Sparkles count={55} scale={7.5} size={3.8} speed={0.5} color="#FDE68A" opacity={0.85} />
        <Sparkles count={30} scale={6.0} size={2.8} speed={0.3} color="#6EE7B7" opacity={0.7} />

        {/* 1. CENTERPIECE: CUTE CHIBI CELENGAN AYAM JAGO EMAS */}
        <CuteCelenganAyam
          mousePos={mousePos}
          isWobbling={isAyamWobbling}
          onClick={triggerAyam}
        />

        {/* 2. LEFT SIDE: DOMPET BERKAH (CLICKABLE 360 SPIN!) */}
        <DompetBerkah
          position={[-1.9, -0.35, 0.35]}
          mousePos={mousePos}
          isWobbling={isWalletWobbling}
          onClick={triggerWallet}
        />

        {/* 3. RIGHT SIDE: PAKET KERANJANG SEMBAKO (CLICKABLE 360 SPIN!) */}
        <PaketSembakoHampers
          position={[1.9, -0.35, 0.35]}
          mousePos={mousePos}
          isWobbling={isSembakoWobbling}
          onClick={triggerSembako}
        />

        {/* Vertically-Oriented Spinning Orbiting Gold Coins (Outside the main diorama) */}
        <SpinningGoldCoin radius={3.2} speed={0.55} yOffset={0.7} phase={0} scale={0.7} />
        <SpinningGoldCoin radius={2.8} speed={-0.5} yOffset={-0.6} phase={Math.PI * 0.75} scale={0.6} />
        <SpinningGoldCoin radius={3.3} speed={0.65} yOffset={1.1} phase={Math.PI * 1.5} scale={0.65} />
      </Canvas>
    </div>
  );
};
