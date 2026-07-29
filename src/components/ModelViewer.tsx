import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { BufferGeometry } from 'three'

// Ladataan vain lazyna (import('./ModelViewer')) QuoteUploaderista, jotta
// @react-three/fiber/drei ei päädy SSR-prerenderiin.

function Model({ geometry }: { geometry: BufferGeometry }) {
  // Normalisoidaan koko yksikkösäteeseen -> kiinteä kamera toimii kaikilla
  // malleilla (sormus tai 200 mm levy).
  const scale = useMemo(() => {
    if (!geometry.boundingSphere) geometry.computeBoundingSphere()
    const r = geometry.boundingSphere?.radius || 1
    return 1 / r
  }, [geometry])

  return (
    <group scale={scale}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#d6a94a" metalness={0.15} roughness={0.55} />
      </mesh>
    </group>
  )
}

export default function ModelViewer({ geometry }: { geometry: BufferGeometry }) {
  return (
    <Canvas
      camera={{ position: [2.1, 1.6, 2.4], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <hemisphereLight args={['#f4f1ea', '#1a1815', 0.5]} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} />
      <directionalLight position={[-5, -3, -4]} intensity={0.35} />
      <Model geometry={geometry} />
      <OrbitControls
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.9}
        minDistance={1.4}
        maxDistance={6}
      />
    </Canvas>
  )
}
