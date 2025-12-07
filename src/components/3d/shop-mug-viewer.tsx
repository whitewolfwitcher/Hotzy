"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import Mug from './Mug';
import * as THREE from 'three';

// Rotating mug component
function RotatingMug({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current && isHovered) {
      groupRef.current.rotation.y += delta * 0.8; // Smooth continuous rotation
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.045, 0]} rotation={[0, 0, 0]}>
      <Mug scale={1.5} customImage={null} dividedMode={false} />
    </group>
  );
}

// Studio lighting setup
function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.4} color="#C7C7C7" />
      <spotLight
        position={[2, 3, 2]}
        angle={0.5}
        penumbra={1}
        intensity={2}
        color="#ffffff"
        castShadow
      />
      <directionalLight position={[-2, 1, 2]} intensity={0.6} color="#EAEAEA" />
      <pointLight position={[0, 0.3, 0.2]} intensity={0.3} color="#76B900" distance={1.5} />
    </>
  );
}

interface ShopMugViewerProps {
  isHovered: boolean;
}

export default function ShopMugViewer({ isHovered }: ShopMugViewerProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{
          position: [0, 0.05, 0.3],
          fov: 35,
          near: 0.01,
          far: 100,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        {/* Gradient background */}
        <color attach="background" args={['#1a1a1a']} />
        <fog attach="fog" args={['#0a0a0a', 0.8, 2]} />

        <StudioLights />

        <Suspense fallback={null}>
          {/* Floor reflection */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.045, 0]} receiveShadow>
            <planeGeometry args={[5, 5]} />
            <meshStandardMaterial
              color="#0a0a0a"
              roughness={0.9}
              metalness={0.1}
              envMapIntensity={0.05}
            />
          </mesh>

          <RotatingMug isHovered={isHovered} />
        </Suspense>

        {/* Disable user controls - rotation handled by hover */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}
