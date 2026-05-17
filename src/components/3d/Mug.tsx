import { useEffect, useMemo, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

type ArtworkMode = 'full-wrap' | 'panel'

const PRINTABLE_MATERIAL_NAMES = new Set(['mug_body.007', 'PrintMat'])

function applyCoverTexture(
  texture: THREE.Texture,
  imageAspect: number,
  targetAspect: number,
  maxAnisotropy: number,
  wrapS: THREE.Wrapping
) {
  const resolvedImageAspect = Number.isFinite(imageAspect) && imageAspect > 0 ? imageAspect : targetAspect
  const resolvedTargetAspect = Number.isFinite(targetAspect) && targetAspect > 0 ? targetAspect : resolvedImageAspect
  texture.userData.coverScale = Math.max(resolvedTargetAspect / resolvedImageAspect, 1)

  texture.wrapS = wrapS
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.minFilter = THREE.LinearMipMapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = maxAnisotropy
  texture.colorSpace = THREE.SRGBColorSpace
  texture.repeat.set(1, 1)
  texture.offset.set(0, 0)
  texture.center.set(0.5, 0.5)
  texture.rotation = 0
  texture.needsUpdate = true
}

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
  sectionImageScales,
  imagePosition = { x: 0, y: 0 },
  imageScale = 1,
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
  sectionImageScales?: {
    section1: number
    section2: number
    section3: number
  }
  imagePosition?: { x: number; y: number }
  imageScale?: number
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
  const WRAP_TEXTURE_WIDTH = 4500
  const WRAP_TEXTURE_HEIGHT = 1800
  const PANEL_AREA_WIDTH = WRAP_TEXTURE_WIDTH * 0.38
  const PANEL_AREA_HEIGHT = WRAP_TEXTURE_HEIGHT * 0.82
  const PANEL_AREA_X = (WRAP_TEXTURE_WIDTH - PANEL_AREA_WIDTH) / 2
  const PANEL_AREA_Y = (WRAP_TEXTURE_HEIGHT - PANEL_AREA_HEIGHT) / 2

  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const { scene } = useGLTF('/3d/Mug_AR_Rebuild.glb')
  const { gl } = useThree()
  const maxAnisotropy = useMemo(
    () => gl.capabilities.getMaxAnisotropy(),
    [gl]
  )
  const normalizeWrapOffset = (value: number) => ((value % 1) + 1) % 1

  // Create combined texture from 3 section images
  const createCombinedTexture = (
    images: typeof sectionImages,
    scales: typeof sectionImageScales
  ): Promise<THREE.CanvasTexture | null> => {
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
          canvasTexture.flipY = true
          canvasTexture.wrapS = THREE.RepeatWrapping
          canvasTexture.wrapT = THREE.ClampToEdgeWrapping
          canvasTexture.minFilter = THREE.LinearMipMapLinearFilter
          canvasTexture.magFilter = THREE.LinearFilter
          canvasTexture.anisotropy = maxAnisotropy
          canvasTexture.colorSpace = THREE.SRGBColorSpace
          canvasTexture.repeat.set(1 / imageZoom, 1 / imageZoom)
          canvasTexture.offset.set(imagePosition.x, imagePosition.y)
          canvasTexture.center.set(0.5, 0.5)
          canvasTexture.rotation = (imageRotation * Math.PI) / 180
          canvasTexture.needsUpdate = true
          resolve(canvasTexture)
        }
      }

      const drawImageCover = (
        img: HTMLImageElement,
        sectionIndex: number,
        sectionScale: number
      ) => {
        const baseScale = Math.max(800 / img.width, 800 / img.height)
        const drawScale = baseScale * Math.max(sectionScale, 1)
        const drawWidth = img.width * drawScale
        const drawHeight = img.height * drawScale
        const sectionX = sectionIndex * 800
        const drawX = sectionX + (800 - drawWidth) / 2
        const drawY = (800 - drawHeight) / 2

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      }

      // Load and draw each section image
      ;[
        { src: section1, key: 'section1' as const },
        { src: section2, key: 'section2' as const },
        { src: section3, key: 'section3' as const },
      ].forEach(({ src: imgSrc, key }, index) => {
        if (imgSrc) {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => {
            drawImageCover(img, index, scales?.[key] ?? 1)
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
    focalPoint: { x: number; y: number },
    scaleMultiplier = 1
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
        const targetAspect = targetWidth / targetHeight
        const imageAspect = img.width / img.height
        const isFullWrap = mode === 'full-wrap'
        const effectiveFit = isFullWrap ? 'cover' : fit
        const coverageScale = Math.max(targetWidth / img.width, targetHeight / img.height)
        const fitScale =
          effectiveFit === 'cover'
            ? coverageScale
            : Math.min(targetWidth / img.width, targetHeight / img.height)
        const safeScaleMultiplier = isFullWrap
          ? Math.max(scaleMultiplier, 1)
          : Math.max(scaleMultiplier, 0.5)
        const scale = Math.max(fitScale * safeScaleMultiplier, coverageScale)

        const drawWidth = img.width * scale
        const drawHeight = img.height * scale
        const resolvedFocalX = isFullWrap ? focalPoint.x : 0.5
        const resolvedFocalY = isFullWrap ? focalPoint.y : 0.5
        const drawX =
          effectiveFit === 'cover'
            ? targetX + targetWidth / 2 - drawWidth * resolvedFocalX
            : targetX + (targetWidth - drawWidth) / 2
        const drawY =
          effectiveFit === 'cover'
            ? targetY + targetHeight / 2 - drawHeight * resolvedFocalY
            : targetY + (targetHeight - drawHeight) / 2

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)

        const canvasTexture = new THREE.CanvasTexture(canvas)
        canvasTexture.flipY = true
        applyCoverTexture(
          canvasTexture,
          imageAspect,
          targetAspect,
          maxAnisotropy,
          mode === 'full-wrap' ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping
        )
        canvasTexture.offset.x =
          mode === 'full-wrap' ? normalizeWrapOffset(wrapOffsetX) : 0
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
      createCombinedTexture(sectionImages, sectionImageScales).then((combinedTexture) => {
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
    createWrapTexture(
      customImage,
      artworkSource,
      customImageFit,
      artworkMode,
      {
        x: focalX,
        y: focalY,
      },
      imageScale
    )
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
    imageScale,
    maxAnisotropy,
    sectionImages,
    sectionImageScales,
    imagePosition.x,
    imagePosition.y,
    imageZoom,
    imageRotation,
    wrapOffsetX,
  ])

  const mugBodyColor = cupType === 'standard' ? '#f4f4f4' : '#0f0f12'
  const handleColor = cupType === 'standard' ? '#f1f1f1' : '#111113'
  const ceramicDetailColor = cupType === 'standard' ? '#f6f6f4' : '#111113'
  const footShadowColor = cupType === 'standard' ? '#7d7a76' : '#050506'
  const realHandleCurve = useMemo(
    () =>
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(-0.0145, 0.021, 0),
        new THREE.Vector3(0.034, 0.021, 0),
        new THREE.Vector3(0.039, -0.032, 0),
        new THREE.Vector3(-0.0145, -0.031, 0)
      ),
    []
  )
  const ceramicDetailMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(ceramicDetailColor),
        roughness: cupType === 'standard' ? 0.38 : 0.26,
        metalness: 0,
        clearcoat: 0.82,
        clearcoatRoughness: cupType === 'standard' ? 0.16 : 0.08,
        envMapIntensity: cupType === 'standard' ? 0.9 : 1.05,
      }),
    [ceramicDetailColor, cupType]
  )
  const footShadowMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(footShadowColor),
        roughness: 0.5,
        metalness: 0,
        clearcoat: 0.35,
        clearcoatRoughness: 0.22,
        envMapIntensity: 0.45,
        side: THREE.DoubleSide,
      }),
    [footShadowColor]
  )
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

      const sourceMaterials = Array.isArray(child.material) ? child.material : [child.material]
      const sourceMaterialNames = sourceMaterials
        .filter((material): material is THREE.Material => Boolean(material))
        .map((material) => material.name)

      if (
        sourceMaterialNames.includes('HandleMat') ||
        sourceMaterialNames.includes('BaseMat')
      ) {
        child.visible = false
        return
      }

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

    const resolvedTargetMesh = targetMesh as THREE.Mesh | null

    if (!resolvedTargetMesh) {
      return {
        radiusTop: OUTER_DIAMETER + 0.0008,
        radiusBottom: OUTER_DIAMETER + 0.0008,
        height: HEIGHT - 0.002,
        position: [0, 0, 0] as [number, number, number],
      }
    }

    resolvedTargetMesh.updateWorldMatrix(true, false)
    const box = new THREE.Box3().setFromObject(resolvedTargetMesh)
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
        if (
          !(material instanceof THREE.MeshStandardMaterial) &&
          !(material instanceof THREE.MeshPhysicalMaterial)
        ) {
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
        upgradedMaterial.name = material.name

      if (PRINTABLE_MATERIAL_NAMES.has(material.name)) {
        upgradedMaterial.color.set(
          texture && artworkMode === 'full-wrap' ? '#ffffff' : mugBodyColor
        )
        upgradedMaterial.map = texture && artworkMode === 'full-wrap' ? texture : null
        upgradedMaterial.roughness = cupType === 'standard' ? 0.42 : 0.24
        upgradedMaterial.clearcoat = cupType === 'standard' ? 0.8 : 1
        upgradedMaterial.clearcoatRoughness = cupType === 'standard' ? 0.16 : 0.07
        upgradedMaterial.envMapIntensity = cupType === 'standard' ? 0.86 : 1.1
      } else if (material.name === 'HandleMat' || material.name === 'BaseMat') {
          upgradedMaterial.color.set(handleColor)
          upgradedMaterial.map = null
          upgradedMaterial.roughness = cupType === 'standard' ? 0.42 : 0.24
          upgradedMaterial.clearcoat = cupType === 'standard' ? 0.78 : 1
          upgradedMaterial.clearcoatRoughness = cupType === 'standard' ? 0.16 : 0.07
          upgradedMaterial.envMapIntensity = cupType === 'standard' ? 0.88 : 1.12
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
  }, [artworkMode, cupType, handleColor, mugBodyColor, mugScene, texture])

  return (
    <group
      scale={scale}
      position={position}
      rotation={rotation}
      dispose={null}
    >
      <group scale={[1.02, 1.02, 1.02]} position={[0, 0.115, 0]}>
        <primitive object={mugScene} />
        <group>
          <mesh
            position={[0, -0.004, 0]}
            scale={[1, 1, 0.62]}
            castShadow
            receiveShadow
            material={ceramicDetailMaterial}
          >
            <tubeGeometry args={[realHandleCurve, 128, 0.0046, 28, false]} />
          </mesh>
          <mesh
            position={[-0.0155, 0.017, 0]}
            rotation={[0, 0, -0.06]}
            scale={[0.62, 1.28, 0.36]}
            castShadow
            receiveShadow
            material={ceramicDetailMaterial}
          >
            <sphereGeometry args={[0.008, 32, 18]} />
          </mesh>
          <mesh
            position={[-0.0155, -0.032, 0]}
            rotation={[0, 0, 0.08]}
            scale={[0.58, 1.12, 0.34]}
            castShadow
            receiveShadow
            material={ceramicDetailMaterial}
          >
            <sphereGeometry args={[0.0076, 32, 18]} />
          </mesh>
          <mesh
            position={[-0.0567, -0.0539, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
            receiveShadow
            material={ceramicDetailMaterial}
          >
            <torusGeometry args={[0.0326, 0.00115, 12, 128]} />
          </mesh>
          <mesh
            position={[-0.0567, -0.055, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            receiveShadow
            material={footShadowMaterial}
          >
            <circleGeometry args={[0.029, 128]} />
          </mesh>
        </group>
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
  sectionImageScales,
  imagePosition,
  imageScale,
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
  sectionImageScales?: {
    section1: number
    section2: number
    section3: number
  }
  imagePosition?: { x: number; y: number }
  imageScale?: number
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
      sectionImageScales={sectionImageScales}
      imagePosition={imagePosition}
      imageScale={imageScale}
      imageZoom={imageZoom}
      imageRotation={imageRotation}
      focalX={focalX}
      focalY={focalY}
      wrapOffsetX={wrapOffsetX}
    />
  )
}

useGLTF.preload('/3d/Mug_AR_Rebuild.glb')
