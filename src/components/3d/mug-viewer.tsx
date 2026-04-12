import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import Mug from './Mug'
import * as THREE from 'three'

interface MugViewerProps {
  customImage?: string | null
  artworkSource?: 'template' | 'upload'
  customImageFit?: 'cover' | 'contain'
  artworkMode?: 'full-wrap' | 'panel'
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
  focalX?: number
  focalY?: number
  wrapOffsetX?: number
  previewRotation?: number
  previewResetToken?: number
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
  artworkSource = 'template',
  customImageFit = 'cover',
  artworkMode = 'full-wrap',
  dividedMode,
  cupType = 'hotzy',
  sectionImages,
  imagePosition = { x: 0, y: 0 },
  imageZoom = 1,
  imageRotation = 0,
  focalX = 0.5,
  focalY = 0.5,
  wrapOffsetX = 0,
  previewRotation = 0,
  previewResetToken = 0,
}: MugViewerProps) {
  const backgroundColor = cupType === 'standard' ? '#F4F4F4' : '#D8D8D8'
  const floorColor = cupType === 'standard' ? '#E9E9E9' : '#D6D6D6'
  const initialCameraPosition: [number, number, number] = [0.08, 0.16, 0.52]
  const initialTarget: [number, number, number] = [0, 0.12, 0]
  const previewRotationY =
    customImage && artworkMode === 'full-wrap' ? previewRotation : 0.15

  return (
    <div className="h-[70vh] w-full relative overflow-hidden rounded-lg border border-border" style={{ background: backgroundColor }}>
      <Canvas
        shadows
        camera={{ 
          position: initialCameraPosition, 
          fov: 28, 
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
        <ambientLight intensity={0.45} color="#FFFFFF" />
        
        {/* Hemisphere light - mid-tone sky/ground */}
        <hemisphereLight 
          color="#F1F1F1"
          groundColor="#CFCFCF"
          intensity={0.72}
        />
        
        {/* Main directional light - soft shadows with 1024 map */}
        <directionalLight
          position={[2.8, 3.4, 2.6]}
          intensity={2.35}
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
          position={[-2.4, 1.9, -1.8]} 
          intensity={1.05} 
          color="#E7E7E7"
          castShadow={false}
        />

        <spotLight
          position={[-1.6, 1.3, 2.2]}
          angle={0.45}
          penumbra={0.9}
          intensity={0.75}
          color="#ffffff"
          castShadow={false}
        />

        <pointLight
          position={[0.65, 0.22, 0.85]}
          intensity={0.35}
          distance={2}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          {/* Balanced studio floor */}
          <BalancedStudioFloor floorColor={floorColor} />

          {/* Mug with material tuning for balanced look */}
          <group position={[0, -0.015, 0]} rotation={[0, previewRotationY, 0]} scale={[1, 1, 1]}>
            <Mug 
              scale={1.82} 
              customImage={customImage} 
              artworkSource={artworkSource}
              customImageFit={customImageFit}
              artworkMode={artworkMode}
              dividedMode={dividedMode}
              cupType={cupType}
              sectionImages={sectionImages}
              imagePosition={imagePosition}
              imageZoom={imageZoom}
              imageRotation={imageRotation}
              focalX={focalX}
              focalY={focalY}
              wrapOffsetX={wrapOffsetX}
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
          minDistance={0.42}
          maxDistance={1.3}
          target={initialTarget}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.PAN,
            RIGHT: THREE.MOUSE.PAN,
          }}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 6}
          makeDefault
        />
      </Canvas>

      {/* Tooltip - updated instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full z-10 pointer-events-none">
        <span className="text-xs font-semibold text-white">Drag: Rotate | Middle/Right Drag: Move | Scroll: Zoom</span>
      </div>
    </div>
  )
}
