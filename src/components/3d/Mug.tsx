import React, { useMemo, useEffect, useState, useRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// 11 OZ Sublimation Mug - Exact specifications from reference images
function FallbackMug({ 
  scale, 
  position, 
  rotation,
  customImage,
  dividedMode,
  sectionImages,
  imagePosition = { x: 0, y: 0 },
  imageZoom = 1,
  imageRotation = 0,
  cupType = 'hotzy'
}: { 
  scale?: number | [number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
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
}) {
  // Exact dimensions from 11 oz sublimation mug (in meters)
  const OUTER_DIAMETER = 0.08 / 2 // 8cm diameter = 0.04m radius
  const HEIGHT = 0.095 // 9.5cm height
  const WALL_THICKNESS = 0.0035 // 3.5mm wall thickness
  const HANDLE_RADIUS = 0.011
  const HANDLE_THICKNESS = 0.008
  const SEGMENTS_RADIAL = 64
  const SEGMENTS_HEIGHT = 32

  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  // Create combined texture from 3 section images
  const createCombinedTexture = (images: typeof sectionImages): Promise<THREE.CanvasTexture | null> => {
    return new Promise((resolve) => {
      if (!images) {
        resolve(null)
        return
      }

      const { section1, section2, section3 } = images
      const imagesToLoad = [section1, section2, section3].filter(img => img !== null)
      
      if (imagesToLoad.length === 0) {
        resolve(null)
        return
      }

      // Create canvas to combine images
      const canvas = document.createElement('canvas')
      canvas.width = 2400 // 800px per section * 3
      canvas.height = 800
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        resolve(null)
        return
      }

      // Fill with transparent or white background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      let loadedCount = 0
      const totalImages = 3

      const checkComplete = () => {
        loadedCount++
        if (loadedCount === totalImages) {
          const canvasTexture = new THREE.CanvasTexture(canvas)
          canvasTexture.wrapS = THREE.RepeatWrapping
          canvasTexture.wrapT = THREE.ClampToEdgeWrapping
          canvasTexture.minFilter = THREE.LinearMipMapLinearFilter
          canvasTexture.magFilter = THREE.LinearFilter
          canvasTexture.anisotropy = 16
          canvasTexture.repeat.set(1 * imageZoom, imageZoom)
          canvasTexture.offset.set(imagePosition.x, imagePosition.y)
          canvasTexture.center.set(0.5, 0.5)
          canvasTexture.rotation = (imageRotation * Math.PI) / 180
          canvasTexture.needsUpdate = true
          resolve(canvasTexture)
        }
      }

      // Load and draw each section image
      [section1, section2, section3].forEach((imgSrc, index) => {
        if (imgSrc) {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => {
            const xPos = index * 800 // Position each image at its section
            ctx.drawImage(img, xPos, 0, 800, 800)
            checkComplete()
          }
          img.onerror = () => {
            checkComplete() // Continue even if image fails
          }
          img.src = imgSrc
        } else {
          // Draw empty section
          checkComplete()
        }
      })
    })
  }

  // Load custom image as texture with proper async handling
  useEffect(() => {
    // Priority 1: If dividedMode with sectionImages, use combined texture
    if (dividedMode && sectionImages) {
      console.log('Loading 3-section combined texture', sectionImages)
      createCombinedTexture(sectionImages).then((combinedTexture) => {
        if (combinedTexture) {
          console.log('3-section texture created successfully')
          setTexture(combinedTexture)
        } else {
          setTexture(null)
        }
      }).catch((error) => {
        console.error('Error creating combined texture:', error)
        setTexture(null)
      })
      return
    }
    
    // Priority 2: Single customImage
    if (!customImage) {
      setTexture(null)
      return
    }
    
    console.log('Loading single texture:', customImage)
    const loader = new THREE.TextureLoader()
    
    loader.load(
      customImage,
      (loadedTexture) => {
        console.log('Texture loaded successfully')
        loadedTexture.wrapS = THREE.RepeatWrapping
        loadedTexture.wrapT = THREE.ClampToEdgeWrapping
        loadedTexture.minFilter = THREE.LinearMipMapLinearFilter
        loadedTexture.magFilter = THREE.LinearFilter
        loadedTexture.anisotropy = 16
        loadedTexture.repeat.set(imageZoom, imageZoom)
        loadedTexture.offset.set(imagePosition.x, imagePosition.y)
        loadedTexture.center.set(0.5, 0.5)
        loadedTexture.rotation = (imageRotation * Math.PI) / 180
        loadedTexture.needsUpdate = true
        setTexture(loadedTexture)
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error)
        setTexture(null)
      }
    )
    
    // Cleanup function
    return () => {
      setTexture((prevTexture) => {
        if (prevTexture) {
          prevTexture.dispose()
        }
        return null
      })
    }
  }, [customImage, dividedMode, sectionImages, imagePosition.x, imagePosition.y, imageZoom, imageRotation])

  // Update material when texture changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.map = texture
      materialRef.current.color.set(texture ? "#ffffff" : "#1a1a1a")
      materialRef.current.needsUpdate = true
      console.log('Material updated with texture:', !!texture)
    }
  }, [texture])

  const mugBaseColor = cupType === 'standard' ? '#f5f5f5' : '#1a1a1a'

  return (
    <group scale={scale} position={position} rotation={rotation}>
      {/* Main cylindrical body - Black matte ceramic with optional custom texture */}
      <mesh castShadow receiveShadow position={[0, HEIGHT / 2, 0]}>
        <cylinderGeometry 
          args={[
            OUTER_DIAMETER,
            OUTER_DIAMETER,
            HEIGHT, 
            SEGMENTS_RADIAL,
            SEGMENTS_HEIGHT
          ]} 
        />
        <meshStandardMaterial 
          ref={materialRef}
          color={texture ? "#ffffff" : mugBaseColor}
          map={texture}
          roughness={cupType === 'standard' ? 0.7 : 0.8} 
          metalness={0.0}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Inner cavity - white interior */}
      <mesh position={[0, HEIGHT / 2 + 0.002, 0]}>
        <cylinderGeometry 
          args={[
            OUTER_DIAMETER - WALL_THICKNESS,
            OUTER_DIAMETER - WALL_THICKNESS,
            HEIGHT - 0.006,
            SEGMENTS_RADIAL,
            SEGMENTS_HEIGHT
          ]} 
        />
        <meshStandardMaterial 
          color="#ffffff" 
          roughness={0.4} 
          metalness={0.0}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Rim - white inner lip */}
      <mesh position={[0, HEIGHT, 0]}>
        <cylinderGeometry 
          args={[
            OUTER_DIAMETER - 0.001,
            OUTER_DIAMETER - 0.001,
            0.002,
            SEGMENTS_RADIAL
          ]} 
        />
        <meshStandardMaterial 
          color="#ffffff" 
          roughness={0.4} 
          metalness={0.0}
        />
      </mesh>

      {/* D-loop Handle - Black matte */}
      <group position={[OUTER_DIAMETER + HANDLE_RADIUS * 0.5, HEIGHT / 2, 0]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry 
            args={[
              HANDLE_RADIUS * 3.5,
              HANDLE_THICKNESS / 2,
              16,
              32
            ]} 
          />
          <meshStandardMaterial 
            color={mugBaseColor} 
            roughness={cupType === 'standard' ? 0.7 : 0.8} 
            metalness={0.0}
          />
        </mesh>
        
        {/* Handle connection to body (smooth blend) */}
        <mesh 
          castShadow 
          position={[-HANDLE_RADIUS * 2, HANDLE_RADIUS * 2, 0]}
          rotation={[0, 0, Math.PI / 4]}
        >
          <cylinderGeometry 
            args={[HANDLE_THICKNESS / 2, HANDLE_THICKNESS / 2, HANDLE_RADIUS * 2, 8]} 
          />
          <meshStandardMaterial 
            color={mugBaseColor} 
            roughness={cupType === 'standard' ? 0.7 : 0.8} 
            metalness={0.0}
          />
        </mesh>
        
        <mesh 
          castShadow 
          position={[-HANDLE_RADIUS * 2, -HANDLE_RADIUS * 2, 0]}
          rotation={[0, 0, -Math.PI / 4]}
        >
          <cylinderGeometry 
            args={[HANDLE_THICKNESS / 2, HANDLE_THICKNESS / 2, HANDLE_RADIUS * 2, 8]} 
          />
          <meshStandardMaterial 
            color={mugBaseColor} 
            roughness={cupType === 'standard' ? 0.7 : 0.8} 
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* Bottom base with foot ring - Black matte */}
      <mesh castShadow receiveShadow position={[0, 0.002, 0]}>
        <cylinderGeometry 
          args={[
            OUTER_DIAMETER * 0.85,
            OUTER_DIAMETER * 0.85,
            0.004,
            SEGMENTS_RADIAL
          ]} 
        />
        <meshStandardMaterial 
          color={mugBaseColor} 
          roughness={cupType === 'standard' ? 0.7 : 0.8} 
          metalness={0.0}
        />
      </mesh>
    </group>
  )
}

export default function Mug({ 
  scale, 
  position, 
  rotation,
  customImage,
  dividedMode,
  sectionImages,
  imagePosition,
  imageZoom,
  imageRotation,
  cupType = 'hotzy'
}: { 
  scale?: number | [number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
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
}) {
  // Use procedural mug with exact 11 oz sublimation mug specifications
  return (
    <FallbackMug 
      scale={scale} 
      position={position} 
      rotation={rotation} 
      customImage={customImage} 
      dividedMode={dividedMode}
      cupType={cupType}
      sectionImages={sectionImages}
      imagePosition={imagePosition}
      imageZoom={imageZoom}
      imageRotation={imageRotation}
    />
  )
}
