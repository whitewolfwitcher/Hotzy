import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef, type RefObject } from 'react'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import Mug from './Mug'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

interface MugViewerProps {
  customImage?: string | null
  dividedMode?: boolean
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
function BalancedStudioFloor() {
  return (
    <group>
      {/* Mid-gray floor with minimal reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.045, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial 
          color="#D4D4D4"
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

function AutoFrame({
  targetRef,
  controlsRef
}: {
  targetRef: RefObject<THREE.Object3D>
  controlsRef: RefObject<OrbitControlsImpl>
}) {
  const { camera, invalidate } = useThree()
  const hasFramed = useRef(false)

  useEffect(() => {
    if (hasFramed.current) return
    let frameId = 0

    const frame = () => {
      const target = targetRef.current
      if (!target) {
        frameId = requestAnimationFrame(frame)
        return
      }

      const box = new THREE.Box3().setFromObject(target)
      if (box.isEmpty()) {
        frameId = requestAnimationFrame(frame)
        return
      }

      const sphere = box.getBoundingSphere(new THREE.Sphere())
      const center = sphere.center
      const radius = Math.max(sphere.radius, 0.001)
      const fov = THREE.MathUtils.degToRad(camera.fov)
      const fitOffset = 1.25
      const distance = (radius / Math.sin(fov / 2)) * fitOffset

      camera.position.set(center.x + distance * 0.12, center.y + distance * 0.05, center.z + distance)
      camera.near = Math.max(distance / 100, 0.01)
      camera.far = Math.max(distance * 10, 10)
      camera.updateProjectionMatrix()

      const controls = controlsRef.current
      if (controls) {
        controls.target.copy(center)
        controls.minDistance = radius * 1.1
        controls.maxDistance = radius * 3.5
        controls.update()
      }

      hasFramed.current = true
      invalidate()
    }

    frame()
    return () => {
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [camera, controlsRef, invalidate, targetRef])

  return null
}

export default function MugViewer({ 
  customImage, 
  dividedMode,
  sectionImages,
  imagePosition = { x: 0, y: 0 },
  imageZoom = 1,
  imageRotation = 0
}: MugViewerProps) {
  const mugGroupRef = useRef<THREE.Group>(null)
  const controlsRef = useRef<OrbitControlsImpl>(null)

  return (
    <div className="h-[70vh] w-full relative overflow-hidden rounded-lg border border-border" style={{ background: '#D8D8D8' }}>
      <Canvas
        shadows
        camera={{ 
          position: [0, 0.06, 0.34], 
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
          scene.background = new THREE.Color('#D8D8D8')
        }}
      >
        {/* Mid-tone neutral gray background */}
        <color attach="background" args={['#D8D8D8']} />

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
          <BalancedStudioFloor />

          {/* Mug with material tuning for balanced look */}
          <group ref={mugGroupRef} position={[0, 0, 0]} rotation={[0, 0.15, 0]} scale={[1, 1, 1]}>
            <Mug 
              scale={1.5} 
              customImage={customImage} 
              dividedMode={dividedMode}
              sectionImages={sectionImages}
              imagePosition={imagePosition}
              imageZoom={imageZoom}
              imageRotation={imageRotation}
            />
          </group>
        </Suspense>

        <AutoFrame targetRef={mugGroupRef} controlsRef={controlsRef} />

        {/* Orbit controls - with right-click pan for easier movement */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.1}
          minDistance={0.28}
          maxDistance={0.85}
          target={[0, 0, 0]}
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
