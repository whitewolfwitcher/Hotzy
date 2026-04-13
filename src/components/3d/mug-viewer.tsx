import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
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

function ResetCamera({
  position,
  target,
  resetToken,
}: {
  position: [number, number, number]
  target: [number, number, number]
  resetToken: number
}) {
  const { camera } = useThree()
  const controlsRef = useRef<{
    target: THREE.Vector3
    update: () => void
  } | null>(null)

  useEffect(() => {
    camera.position.set(position[0], position[1], position[2])
    camera.lookAt(target[0], target[1], target[2])
    camera.updateProjectionMatrix()
  }, [camera, position, target, resetToken])

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      autoRotate={false}
      enableDamping={true}
      dampingFactor={0.1}
      minDistance={0.5}
      maxDistance={1.55}
      target={target}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.PAN,
      }}
      maxPolarAngle={Math.PI / 1.8}
      minPolarAngle={Math.PI / 6}
      onChange={(event) => {
        const controls = event.target as unknown as { target: THREE.Vector3; update: () => void }
        controlsRef.current = controls
      }}
      makeDefault
    />
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
  const backgroundColor = cupType === 'standard' ? '#2b2828' : '#171717'
  const floorColor = cupType === 'standard' ? '#4a4545' : '#2a2828'
  const initialCameraPosition: [number, number, number] = [0.16, 0.17, 0.5]
  const initialTarget: [number, number, number] = [0, 0.115, 0]
  const previewRotationY =
    customImage && artworkMode === 'full-wrap' ? previewRotation : 0.15

  return (
    <div className="relative mx-auto h-[72vh] min-h-[620px] max-h-[860px] w-full max-w-[720px] overflow-hidden rounded-[28px] border border-white/10 bg-[#121212]" style={{ background: backgroundColor }}>
      <Canvas
        shadows
        camera={{ 
          position: initialCameraPosition, 
          fov: 24, 
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
          <ambientLight intensity={0.34} color="#FFFFFF" />
        
        {/* Hemisphere light - mid-tone sky/ground */}
          <hemisphereLight 
          color="#E6E6E6"
          groundColor="#1B1B1B"
          intensity={0.52}
        />
        
        {/* Main directional light - soft shadows with 1024 map */}
        <directionalLight
          position={[2.8, 3.4, 2.6]}
          intensity={2.2}
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
          intensity={0.62} 
          color="#AFAFAF"
          castShadow={false}
        />

        <spotLight
          position={[-1.6, 1.3, 2.2]}
          angle={0.45}
          penumbra={0.9}
          intensity={0.48}
          color="#ffffff"
          castShadow={false}
        />

        <pointLight
          position={[0.65, 0.22, 0.85]}
          intensity={0.2}
          distance={2}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          {/* Balanced studio floor */}
          <BalancedStudioFloor floorColor={floorColor} />

          {/* Mug with material tuning for balanced look */}
          <group position={[0, -0.012, 0]} rotation={[0, previewRotationY, 0]} scale={[1, 1, 1]}>
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
        <ResetCamera
          position={initialCameraPosition}
          target={initialTarget}
          resetToken={previewResetToken}
        />
      </Canvas>

      {/* Tooltip - updated instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full z-10 pointer-events-none">
        <span className="text-xs font-semibold text-white">Drag: Rotate | Middle/Right Drag: Move | Scroll: Zoom</span>
      </div>
    </div>
  )
}
