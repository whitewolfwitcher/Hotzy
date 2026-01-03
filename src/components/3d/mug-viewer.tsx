import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import Mug from './Mug'
import * as THREE from 'three'

interface MugViewerProps {
  customImage?: string | null
  dividedMode?: boolean
  cupType?: 'hotzy' | 'standard'
  sectionImages?: {
    section1: string | null
    section2: string | null
    section3: string | null
  }
  imagePosition?: { x: number; y: number }
  imageZoom?: number
  imageRotation?: number
}

// Balanced mid-tone studio floor
function BalancedStudioFloor({ floorColor }: { floorColor: string }) {
  return (
    <group>
      {/* Mid-gray floor with minimal reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.045, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial 
          color={floorColor}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Frozen contact shadows for performance */}
      <ContactShadows
        position={[0, -0.044, 0]}
        opacity={0.2}
        scale={2.5}
        blur={1.8}
        far={2.5}
        resolution={512}
        frames={1}
      />
    </group>
  )
}

export default function MugViewer({ 
  customImage, 
  dividedMode,
  cupType = 'hotzy',
  sectionImages,
  imagePosition = { x: 0, y: 0 },
  imageZoom = 1,
  imageRotation = 0
}: MugViewerProps) {
  const backgroundColor = cupType === 'standard' ? '#F4F4F4' : '#D8D8D8'
  const floorColor = cupType === 'standard' ? '#E6E6E6' : '#D4D4D4'
  const initialCameraPosition: [number, number, number] = [0, 0.06, 0.34]
  const initialTarget: [number, number, number] = [0, 0.05, 0]

  return (
    <div className="h-[70vh] w-full relative overflow-hidden rounded-lg border border-border" style={{ background: backgroundColor }}>
      <Canvas
        shadows
        camera={{ 
          position: initialCameraPosition, 
          fov: 35, 
          near: 0.05, 
          far: 8 
        }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        frameloop="demand"
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.25
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
          scene.background = new THREE.Color(backgroundColor)
        }}
      >
        {/* Mid-tone neutral gray background */}
        <color attach="background" args={[backgroundColor]} />

        {/* Balanced studio lighting - performance optimized */}
        
        {/* Ambient light - reduced for balanced look */}
        <ambientLight intensity={0.5} color="#FFFFFF" />
        
        {/* Hemisphere light - mid-tone sky/ground */}
        <hemisphereLight 
          color="#E5E5E5"
          groundColor="#D1D1D1"
          intensity={0.6}
        />
        
        {/* Main directional light - soft shadows with 1024 map */}
        <directionalLight
          position={[2.5, 3.0, 2.0]}
          intensity={2.1}
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
        
        {/* Fill directional light - no shadows for performance */}
        <directionalLight 
          position={[-2.0, 1.5, -1.5]} 
          intensity={0.9} 
          color="#DADADA"
          castShadow={false}
        />

        <Suspense fallback={null}>
          {/* Balanced studio floor */}
          <BalancedStudioFloor floorColor={floorColor} />

          {/* Mug with material tuning for balanced look */}
          <group position={[0, 0, 0]} rotation={[0, 0.15, 0]} scale={[1, 1, 1]}>
            <Mug 
              scale={1.5} 
              customImage={customImage} 
              dividedMode={dividedMode}
              cupType={cupType}
              sectionImages={sectionImages}
              imagePosition={imagePosition}
              imageZoom={imageZoom}
              imageRotation={imageRotation}
            />
          </group>
        </Suspense>

        {/* Orbit controls - with right-click pan for easier movement */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.1}
          minDistance={0.22}
          maxDistance={1.1}
          target={initialTarget}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            RIGHT: THREE.MOUSE.PAN
          }}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 6}
          makeDefault
        />
      </Canvas>

      {/* Tooltip - updated instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full z-10 pointer-events-none">
        <span className="text-xs font-semibold text-white">Left-Click: Rotate • Right-Click: Move • Scroll: Zoom</span>
      </div>
    </div>
  )
}
