import { useEffect, useMemo, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

type ArtworkMode = 'full-wrap' | 'panel'

// 11 OZ Sublimation Mug - Exact specifications from reference images
function FallbackMug({ 
  scale, 
  position, 
  rotation,
  customImage,
  artworkSource = 'template',
  customImageFit = 'cover',
  artworkMode = 'full-wrap',
  dividedMode,
  sectionImages,
  imagePosition = { x: 0, y: 0 },
  imageZoom = 1,
  imageRotation = 0,
  focalX = 0.5,
  focalY = 0.5,
  wrapOffsetX = 0,
  cupType = 'hotzy'
}: { 
  scale?: number | [number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
  customImage?: string | null
  artworkSource?: 'template' | 'upload'
  customImageFit?: 'cover' | 'contain'
  artworkMode?: ArtworkMode
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
}) {
  // Exact dimensions from 11 oz sublimation mug (in meters)
  const OUTER_DIAMETER = 0.08 / 2 // 8cm diameter = 0.04m radius
  const HEIGHT = 0.095 // 9.5cm height
  const WALL_THICKNESS = 0.0035 // 3.5mm wall thickness
  const HANDLE_RADIUS = 0.011
  const HANDLE_THICKNESS = 0.008
  const SEGMENTS_RADIAL = 64
  const SEGMENTS_HEIGHT = 32
  const WRAP_TEXTURE_WIDTH = 2850
  const WRAP_TEXTURE_HEIGHT = 1050
  const PANEL_AREA_WIDTH = WRAP_TEXTURE_WIDTH * 0.38
  const PANEL_AREA_HEIGHT = WRAP_TEXTURE_HEIGHT * 0.82
  const PANEL_AREA_X = (WRAP_TEXTURE_WIDTH - PANEL_AREA_WIDTH) / 2
  const PANEL_AREA_Y = (WRAP_TEXTURE_HEIGHT - PANEL_AREA_HEIGHT) / 2

  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const { scene } = useGLTF('/3d/Mug_AR_Rebuild.glb')
  const normalizeWrapOffset = (value: number) => ((value % 1) + 1) % 1

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
          canvasTexture.flipY = false
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

  const createWrapTexture = (
    imageUrl: string,
    artworkSource: 'template' | 'upload',
    fit: 'cover' | 'contain',
    mode: ArtworkMode,
    focalPoint: { x: number; y: number }
  ): Promise<THREE.CanvasTexture | null> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = WRAP_TEXTURE_WIDTH
        canvas.height = WRAP_TEXTURE_HEIGHT
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          resolve(null)
          return
        }

        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const targetWidth = mode === 'panel' ? PANEL_AREA_WIDTH : canvas.width
        const targetHeight = mode === 'panel' ? PANEL_AREA_HEIGHT : canvas.height
        const targetX = mode === 'panel' ? PANEL_AREA_X : 0
        const targetY = mode === 'panel' ? PANEL_AREA_Y : 0
        const wrapAspect = targetWidth / targetHeight
        const imageAspect = img.width / img.height
        const shouldTileTemplate =
          mode === 'full-wrap' &&
          artworkSource === 'template' &&
          fit === 'cover' &&
          imageAspect < wrapAspect * 0.92

        if (shouldTileTemplate) {
          const drawHeight = targetHeight
          const drawWidth = drawHeight * imageAspect
          const repeatCount = Math.max(3, Math.ceil(targetWidth / drawWidth) + 2)
          const startX = targetX + (targetWidth - drawWidth * repeatCount) / 2

          for (let index = 0; index < repeatCount; index += 1) {
            ctx.drawImage(
              img,
              startX + drawWidth * index,
              targetY,
              drawWidth,
              drawHeight
            )
          }
        } else {
          const scale =
            fit === 'cover'
              ? Math.max(targetWidth / img.width, targetHeight / img.height)
              : Math.min(targetWidth / img.width, targetHeight / img.height)

          const drawWidth = img.width * scale
          const drawHeight = img.height * scale
          const resolvedFocalX = mode === 'full-wrap' ? focalPoint.x : 0.5
          const resolvedFocalY = mode === 'full-wrap' ? focalPoint.y : 0.5
          const drawX =
            fit === 'cover'
              ? targetX + targetWidth / 2 - drawWidth * resolvedFocalX
              : targetX + (targetWidth - drawWidth) / 2
          const drawY =
            fit === 'cover'
              ? targetY + targetHeight / 2 - drawHeight * resolvedFocalY
              : targetY + (targetHeight - drawHeight) / 2

          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
        }

        const canvasTexture = new THREE.CanvasTexture(canvas)
        canvasTexture.flipY = false
        canvasTexture.wrapS =
          mode === 'full-wrap' ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping
        canvasTexture.wrapT = THREE.ClampToEdgeWrapping
        canvasTexture.minFilter = THREE.LinearMipMapLinearFilter
        canvasTexture.magFilter = THREE.LinearFilter
        canvasTexture.anisotropy = 16
        canvasTexture.colorSpace = THREE.SRGBColorSpace
        canvasTexture.repeat.set(1, 1)
        canvasTexture.offset.set(
          mode === 'full-wrap' ? normalizeWrapOffset(0.5 + wrapOffsetX) : 0,
          0
        )
        canvasTexture.center.set(0.5, 0.5)
        canvasTexture.rotation = 0
        canvasTexture.needsUpdate = true
        resolve(canvasTexture)
      }
      img.onerror = () => {
        resolve(null)
      }
      img.src = imageUrl
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
    
    console.log('Loading wrap texture:', customImage)
    createWrapTexture(customImage, artworkSource, customImageFit, artworkMode, {
      x: focalX,
      y: focalY,
    })
      .then((wrapTexture) => {
        if (wrapTexture) {
          console.log('Wrap texture created successfully')
          setTexture(wrapTexture)
        } else {
          setTexture(null)
        }
      })
      .catch((error) => {
        console.error('Error loading wrap texture:', error)
        setTexture(null)
      })
    
    // Cleanup function
    return () => {
      setTexture((prevTexture) => {
        if (prevTexture) {
          prevTexture.dispose()
        }
        return null
      })
    }
  }, [
    artworkMode,
    customImage,
    artworkSource,
    customImageFit,
    dividedMode,
    focalX,
    focalY,
    sectionImages,
    imagePosition.x,
    imagePosition.y,
    imageZoom,
    imageRotation,
    wrapOffsetX,
  ])

  const mugBodyColor = cupType === 'standard' ? '#f4f4f4' : '#0f0f12'
  const handleColor = cupType === 'standard' ? '#f1f1f1' : '#111113'
  const shellMaterial = useMemo(() => {
    if (!texture) {
      return null
    }

    return new THREE.MeshPhysicalMaterial({
      map: texture,
      color: new THREE.Color('#ffffff'),
      roughness: 0.34,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.05,
      side: THREE.DoubleSide,
    })
  }, [texture])
  const mugScene = useMemo(() => {
    const clonedScene = scene.clone(true)

    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) {
        return
      }

      child.castShadow = true
      child.receiveShadow = true

      if (Array.isArray(child.material)) {
        child.material = child.material.map((material) => material.clone())
      } else if (child.material) {
        child.material = child.material.clone()
      }
    })

    return clonedScene
  }, [scene])
  const printShellBounds = useMemo(() => {
    let targetMesh: THREE.Mesh | null = null

    mugScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) {
        return
      }

      const materials = Array.isArray(child.material) ? child.material : [child.material]
      const materialNames = materials
        .filter((material): material is THREE.Material => Boolean(material))
        .map((material) => material.name)

      if (materialNames.includes('mug_body.007') || materialNames.includes('PrintMat')) {
        targetMesh = child
      }
    })

    if (!targetMesh) {
      return {
        radiusTop: OUTER_DIAMETER + 0.0008,
        radiusBottom: OUTER_DIAMETER + 0.0008,
        height: HEIGHT - 0.002,
        position: [0, 0, 0] as [number, number, number],
      }
    }

    targetMesh.updateWorldMatrix(true, false)
    const box = new THREE.Box3().setFromObject(targetMesh)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    const radius = Math.max(size.x, size.z) / 2 + 0.001

    return {
      radiusTop: radius,
      radiusBottom: radius,
      height: Math.max(size.y - 0.002, 0.01),
      position: [center.x, center.y, center.z] as [number, number, number],
    }
  }, [HEIGHT, OUTER_DIAMETER, mugScene])

  useEffect(() => {
    mugScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) {
        return
      }

      const materials = Array.isArray(child.material) ? child.material : [child.material]

      materials.forEach((material) => {
        if (!(material instanceof THREE.MeshStandardMaterial)) {
          return
        }

        const upgradedMaterial = new THREE.MeshPhysicalMaterial({
          color: material.color?.clone() ?? new THREE.Color('#ffffff'),
          map: material.map ?? null,
          roughness: material.roughness ?? 0.45,
          metalness: 0,
          clearcoat: 1,
          clearcoatRoughness: 0.12,
          envMapIntensity: 0.8,
        })

        if (material.name === 'PrintMat') {
          upgradedMaterial.color.set('#ffffff')
          upgradedMaterial.map = null
          upgradedMaterial.roughness = 0.28
          upgradedMaterial.clearcoat = 1
          upgradedMaterial.clearcoatRoughness = 0.12
          upgradedMaterial.envMapIntensity = 1
        } else if (material.name === 'mug_body.007') {
          upgradedMaterial.color.set(mugBodyColor)
          upgradedMaterial.map = null
          upgradedMaterial.roughness = cupType === 'standard' ? 0.32 : 0.22
          upgradedMaterial.clearcoatRoughness = 0.08
          upgradedMaterial.envMapIntensity = 1.1
        } else if (material.name === 'HandleMat' || material.name === 'BaseMat') {
          upgradedMaterial.color.set(handleColor)
          upgradedMaterial.map = null
          upgradedMaterial.roughness = cupType === 'standard' ? 0.28 : 0.2
          upgradedMaterial.clearcoatRoughness = 0.06
          upgradedMaterial.envMapIntensity = 1.15
        }

        upgradedMaterial.needsUpdate = true
        material.dispose()

        if (Array.isArray(child.material)) {
          const materialIndex = child.material.findIndex((entry) => entry.uuid === material.uuid)
          if (materialIndex >= 0) {
            child.material[materialIndex] = upgradedMaterial
          }
        } else {
          child.material = upgradedMaterial
        }
      })
    })
  }, [cupType, handleColor, mugBodyColor, mugScene, texture])

  return (
    <group
      scale={scale}
      position={position}
      rotation={rotation}
      dispose={null}
    >
      <group scale={[0.9, 0.9, 0.9]} position={[0, 0.1, 0]}>
        <primitive object={mugScene} />
        {shellMaterial ? (
          <mesh position={printShellBounds.position} renderOrder={2}>
            <cylinderGeometry
              args={[
                printShellBounds.radiusTop,
                printShellBounds.radiusBottom,
                printShellBounds.height,
                128,
                1,
                true,
              ]}
            />
            <primitive object={shellMaterial} attach="material" />
          </mesh>
        ) : null}
      </group>
    </group>
  )
}

export default function Mug({ 
  scale, 
  position, 
  rotation,
  customImage,
  artworkSource,
  customImageFit,
  artworkMode,
  dividedMode,
  sectionImages,
  imagePosition,
  imageZoom,
  imageRotation,
  focalX,
  focalY,
  wrapOffsetX,
  cupType = 'hotzy'
}: { 
  scale?: number | [number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
  customImage?: string | null
  artworkSource?: 'template' | 'upload'
  customImageFit?: 'cover' | 'contain'
  artworkMode?: ArtworkMode
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
}) {
  // Use procedural mug with exact 11 oz sublimation mug specifications
  return (
    <FallbackMug 
      scale={scale} 
      position={position} 
      rotation={rotation} 
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
  )
}

useGLTF.preload('/3d/Mug_AR_Rebuild.glb')
