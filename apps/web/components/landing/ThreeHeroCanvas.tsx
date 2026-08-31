'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Orbiting Gold Coin
function OrbitingCoin({
  radius = 2.7,
  speed = 0.7,
  yOffset = 0,
  phase = 0,
  scale = 0.65,
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
      coinRef.current.position.y = yOffset + Math.sin(t * 2.2) * 0.25;
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

// =========================================================================
// 1. DOMPET BERKAH (3D Emerald Leather Wallet with Banknotes & Coins)
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

  useFrame((state, delta) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      // Independent gentle floating
      groupRef.current.position.y = position[1] + Math.sin(t * 2 + 1.2) * 0.12;

      // Parallax mouse tilt
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        -0.35 + mousePos.x * 0.3,
        0.08
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0.15 - mousePos.y * 0.2,
        0.08
      );

      // Click wobble bounce
      if (isWobbling) {
        groupRef.current.rotation.z = Math.sin(t * 30) * 0.25;
        groupRef.current.scale.setScalar(0.92 + Math.sin(t * 25) * 0.08);
      } else {
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
        groupRef.current.scale.setScalar(0.85);
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

      {/* Fanned Banknotes (Uang Kertas Rupiah Hijau, Biru, Merah) */}
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
// 2. PAKET KERANJANG SEMBAKO (3D Hampers with Rice, Oil, Biscuits, Eggs)
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

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      // Independent gentle floating
      groupRef.current.position.y = position[1] + Math.sin(t * 2 + 2.4) * 0.12;

      // Parallax mouse tilt
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        0.35 + mousePos.x * 0.3,
        0.08
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0.15 - mousePos.y * 0.2,
        0.08
      );

      // Click wobble bounce
      if (isWobbling) {
        groupRef.current.rotation.z = Math.sin(t * 30) * 0.25;
        groupRef.current.scale.setScalar(0.92 + Math.sin(t * 25) * 0.08);
      } else {
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
        groupRef.current.scale.setScalar(0.85);
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

      {/* 1. Mini Rice Sack (Karung Beras 5KG) */}
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

      {/* 2. Cooking Oil Bottle (Botol Minyak Goreng Kuning Bening) */}
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
        {/* Red Cap */}
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.1, 16]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
      </group>

      {/* 3. Red Cookie/Biscuit Tin (Kaleng Kue Lebaran Merah & Emas) */}
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
// 3. CELENGAN AYAM JAGO EMAS IMUT (Chibi Cute Golden Rooster Piggy Bank)
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
  const coinTopRef = useRef<THREE.Group>(null);
  const wingLRef = useRef<THREE.Group>(null);
  const wingRRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ayamRef.current) {
      const t = state.clock.getElapsedTime();
      // Gentle floating
      ayamRef.current.position.y = 0.15 + Math.sin(t * 2) * 0.12;

      // Mouse Look-At Tilt
      ayamRef.current.rotation.y = THREE.MathUtils.lerp(
        ayamRef.current.rotation.y,
        mousePos.x * 0.45,
        0.08
      );
      ayamRef.current.rotation.x = THREE.MathUtils.lerp(
        ayamRef.current.rotation.x,
        -mousePos.y * 0.25,
        0.08
      );

      // Happy Click Wobble
      if (isWobbling) {
        ayamRef.current.rotation.z = Math.sin(t * 30) * 0.28;
        ayamRef.current.scale.setScalar(0.95 + Math.sin(t * 25) * 0.08);
      } else {
        ayamRef.current.rotation.z = THREE.MathUtils.lerp(ayamRef.current.rotation.z, 0, 0.1);
        ayamRef.current.scale.setScalar(0.88);
      }
    }

    // Wings Flutter on wobble
    if (wingLRef.current && wingRRef.current) {
      if (isWobbling) {
        const t = state.clock.getElapsedTime();
        wingLRef.current.rotation.z = -0.3 + Math.sin(t * 40) * 0.4;
        wingRRef.current.rotation.z = 0.3 - Math.sin(t * 40) * 0.4;
      } else {
        wingLRef.current.rotation.z = THREE.MathUtils.lerp(wingLRef.current.rotation.z, -0.3, 0.1);
        wingRRef.current.rotation.z = THREE.MathUtils.lerp(wingRRef.current.rotation.z, 0.3, 0.1);
      }
    }

    // Floating Coin above slot
    if (coinTopRef.current) {
      const t = state.clock.getElapsedTime();
      coinTopRef.current.position.y = 1.62 + Math.sin(t * 3.5) * 0.15;
      coinTopRef.current.rotation.y += delta * 2;
    }
  });

  return (
    <group ref={ayamRef} position={[0, 0.15, 0.25]} onClick={onClick}>
      {/* ================= A. CHIBI GOLDEN BODY ================= */}
      {/* Oval Chubby Golden Body (Not a giant ball, perfectly proportioned!) */}
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

      {/* Cute Golden Chest / Dada Ayam */}
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

      {/* ================= B. DISTINCT CUTE HEAD & FACE ================= */}
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

        {/* Iconic Red Rooster Comb (Jengger Ayam Merah Lucu & Bergelombang) */}
        <group position={[0, 0.58, -0.05]} rotation={[-0.1, 0, 0]}>
          {/* Middle Crest */}
          <mesh position={[0, 0.14, 0]} scale={[0.18, 0.4, 0.35]}>
            <sphereGeometry args={[0.45, 24, 24]} />
            <meshStandardMaterial color="#DC2626" metalness={0.15} roughness={0.3} />
          </mesh>
          {/* Front Crest */}
          <mesh position={[0, 0.05, 0.2]} scale={[0.16, 0.32, 0.28]}>
            <sphereGeometry args={[0.4, 24, 24]} />
            <meshStandardMaterial color="#EF4444" metalness={0.15} roughness={0.3} />
          </mesh>
          {/* Back Crest */}
          <mesh position={[0, 0.05, -0.2]} scale={[0.16, 0.35, 0.28]}>
            <sphereGeometry args={[0.4, 24, 24]} />
            <meshStandardMaterial color="#B91C1C" metalness={0.15} roughness={0.3} />
          </mesh>
        </group>

        {/* Cute Small Orange Beak (Paruh Ayam Jago Imut) */}
        <mesh position={[0, -0.06, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.16, 0.36, 24]} />
          <meshStandardMaterial color="#F97316" metalness={0.2} roughness={0.25} />
        </mesh>

        {/* Red Wattle under Beak (Gelambir Merah) */}
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

        {/* Big Cute Glossy Anime Eyes (Mata Besar Berbinar) */}
        {/* Left Eye */}
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

        {/* Right Eye */}
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

        {/* Cute Blushing Pink Cheeks */}
        <mesh position={[-0.42, -0.06, 0.36]} rotation={[0, -0.4, 0]}>
          <circleGeometry args={[0.12, 16]} />
          <meshBasicMaterial color="#FF6584" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.42, -0.06, 0.36]} rotation={[0, 0.4, 0]}>
          <circleGeometry args={[0.12, 16]} />
          <meshBasicMaterial color="#FF6584" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* ================= C. GOLDEN WINGS WITH EMERALD ACCENTS ================= */}
      {/* Left Wing */}
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

      {/* Right Wing */}
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

      {/* ================= D. ROOSTER TAIL FEATHERS (EKOR AYAM JAGO EMAS & HIJAU) ================= */}
      <group position={[0, 0.35, -0.85]} rotation={[-0.45, 0, 0]}>
        {/* Main Center Feather */}
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
        {/* Left Feather */}
        <mesh position={[-0.18, 0.35, -0.08]} rotation={[-0.15, 0.2, -0.35]} scale={[0.12, 0.75, 0.3]}>
          <cylinderGeometry args={[0.06, 0.32, 0.85, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.88} roughness={0.15} />
        </mesh>
        {/* Right Feather */}
        <mesh position={[0.18, 0.35, -0.08]} rotation={[-0.15, -0.2, 0.35]} scale={[0.12, 0.75, 0.3]}>
          <cylinderGeometry args={[0.06, 0.32, 0.85, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.88} roughness={0.15} />
        </mesh>
      </group>

      {/* ================= E. COIN SLOT & TOP FLOATING GOLD COIN ================= */}
      <mesh position={[0, 0.98, -0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.65, 0.12]} />
        <meshBasicMaterial color="#451A03" />
      </mesh>

      <group ref={coinTopRef} position={[0, 1.62, -0.15]}>
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
          <meshStandardMaterial
            color="#FFE066"
            metalness={0.95}
            roughness={0.1}
            emissive="#F59E0B"
            emissiveIntensity={0.35}
          />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.02, 32]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <octahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial color="#FFFBEB" metalness={0.98} roughness={0.05} />
        </mesh>
      </group>

      {/* ================= F. CUTE LITTLE ROOSTER FEET ================= */}
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

  // Individual click wobble animations for all 3 items!
  const [isAyamWobbling, setIsAyamWobbling] = useState(false);
  const [isWalletWobbling, setIsWalletWobbling] = useState(false);
  const [isSembakoWobbling, setIsSembakoWobbling] = useState(false);

  const triggerAyam = (e?: any) => {
    if (e) e.stopPropagation();
    setIsAyamWobbling(true);
    setTimeout(() => setIsAyamWobbling(false), 800);
  };

  const triggerWallet = (e?: any) => {
    if (e) e.stopPropagation();
    setIsWalletWobbling(true);
    setTimeout(() => setIsWalletWobbling(false), 800);
  };

  const triggerSembako = (e?: any) => {
    if (e) e.stopPropagation();
    setIsSembakoWobbling(true);
    setTimeout(() => setIsSembakoWobbling(false), 800);
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
        camera={{ position: [0, 0.2, 6.8], fov: 42 }}
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
        <Sparkles count={55} scale={7} size={3.8} speed={0.5} color="#FDE68A" opacity={0.85} />
        <Sparkles count={30} scale={5.5} size={2.8} speed={0.3} color="#6EE7B7" opacity={0.7} />

        {/* 1. CENTERPIECE: CUTE CHIBI CELENGAN AYAM JAGO EMAS */}
        <CuteCelenganAyam
          mousePos={mousePos}
          isWobbling={isAyamWobbling}
          onClick={triggerAyam}
        />

        {/* 2. LEFT SIDE: DOMPET BERKAH (CLICKABLE WOBBLE!) */}
        <DompetBerkah
          position={[-1.9, -0.35, 0.4]}
          mousePos={mousePos}
          isWobbling={isWalletWobbling}
          onClick={triggerWallet}
        />

        {/* 3. RIGHT SIDE: PAKET KERANJANG SEMBAKO (CLICKABLE WOBBLE!) */}
        <PaketSembakoHampers
          position={[1.9, -0.35, 0.4]}
          mousePos={mousePos}
          isWobbling={isSembakoWobbling}
          onClick={triggerSembako}
        />

        {/* Orbiting Gold Coins */}
        <OrbitingCoin radius={2.8} speed={0.65} yOffset={0.6} phase={0} scale={0.75} />
        <OrbitingCoin radius={2.5} speed={-0.6} yOffset={-0.5} phase={Math.PI * 0.75} scale={0.65} />
        <OrbitingCoin radius={2.9} speed={0.8} yOffset={1.0} phase={Math.PI * 1.5} scale={0.7} />
      </Canvas>
    </div>
  );
};
