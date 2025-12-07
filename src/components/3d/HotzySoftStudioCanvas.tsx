"use client";

import { Canvas } from '@react-three/fiber';
import { Suspense, memo } from 'react';
import { OrbitControls, useGLTF, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface HotzyMugProps {
  url: string;
  initialRotationY: number;
}

// Mug model loader with shadows enabled
function HotzyMug({ url, initialRotationY }: HotzyMugProps) {
  const { scene } = useGLTF(url);
  
  // Enable shadows and apply optimized material tuning
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      
      // Optimized material tuning for performance
      if (child.material) {
        child.material.envMapIntensity = 0.4;
        child.material.roughness = Math.max(child.material.roughness || 0.8, 0.8);
        child.material.metalness = Math.min(child.material.metalness || 0.05, 0.05);
      }
    }
  });

  return (
    <primitive 
      object={scene} 
      rotation={[0, initialRotationY, 0]}
      position={[0, 0, 0]}
      scale={[1, 1, 1]}
    />
  );
}

// Simple studio floor with minimal cost
function SimpleStudioFloor() {
  return (
    <group>
      {/* Simple floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial 
          color="#EFEFEF"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* Frozen contact shadows for minimal cost */}
      <ContactShadows
        position={[0, -0.049, 0]}
        opacity={0.18}
        scale={2.5}
        blur={1.6}
        far={2.5}
        resolution={512}
        frames={1}
      />
    </group>
  );
}

interface HotzySoftStudioCanvasProps {
  glbUrl: string;
  initialRotationY?: number;
  enableControls?: boolean;
}

function HotzySoftStudioCanvas({ 
  glbUrl, 
  initialRotationY = 0.15, 
  enableControls = true 
}: HotzySoftStudioCanvasProps) {
  return (
    <div className="w-full h-full bg-[#ECECEC]">
      <Canvas
        shadows="soft"
        camera={{ 
          position: [0, 0.06, 0.36], 
          fov: 35, 
          near: 0.05, 
          far: 8 
        }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true, 
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.10,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true
        }}
        frameloop="demand"
        performance={{ min: 0.5 }}
      >
        {/* Flat light studio background - neutral gray */}
        <color attach="background" args={['#ECECEC']} />

        {/* Optimized lighting setup - balanced quality & performance */}
        
        {/* Reduced ambient light */}
        <ambientLight intensity={0.45} color="#FFFFFF" />
        
        {/* Hemisphere light for natural base lighting */}
        <hemisphereLight 
          color="#FFFFFF"
          groundColor="#F0F0F0"
          intensity={0.5}
        />
        
        {/* Main directional light with optimized shadows (1024 map, PCFSoft) */}
        <directionalLight
          position={[2.5, 3.5, 2.0]}
          intensity={1.7}
          color="#FFFFFF"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.1}
          shadow-camera-far={6}
          shadow-camera-left={-2}
          shadow-camera-right={2}
          shadow-camera-top={2}
          shadow-camera-bottom={-2}
          shadow-normalBias={0.02}
        />
        
        {/* Fill light - no shadows for performance */}
        <directionalLight 
          position={[-2.0, 1.8, -1.5]} 
          intensity={0.7} 
          color="#E6E6E6"
        />

        <Suspense fallback={null}>
          {/* Simple floor - no environment map */}
          <SimpleStudioFloor />

          {/* Mug model */}
          <HotzyMug url={glbUrl} initialRotationY={initialRotationY} />
        </Suspense>

        {/* Orbit controls - optimized interaction */}
        {enableControls && (
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            enableDamping={true}
            dampingFactor={0.08}
            minDistance={0.28}
            maxDistance={0.85}
            target={[0, 0, 0]}
            mouseButtons={{
              LEFT: THREE.MOUSE.ROTATE,
              RIGHT: THREE.MOUSE.ROTATE
            }}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 6}
            makeDefault
          />
        )}
      </Canvas>

      {/* Tooltip */}
      {enableControls && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-xl border border-primary/30 rounded-full z-10 pointer-events-none">
          <span className="text-xs font-semibold text-white">Drag to rotate • Scroll to zoom</span>
        </div>
      )}
    </div>
  );
}

export default memo(HotzySoftStudioCanvas);