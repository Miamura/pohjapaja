import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import type { Line2 } from 'three-stdlib'

interface ToolpathSceneProps {
  reducedMotion: boolean
}

/**
 * Suorakulmainen taskun (pocket) kiertorata XZ-tasossa: kehä kiertyy
 * sisäänpäin kunnes keskusta on työstetty — kuten CAM-ohjelman esikatselu.
 * Polku tihennetään tasavälisiksi pisteiksi, jotta kärki liikkuu sulavasti.
 */
function buildPocketPath(): THREE.Vector3[] {
  const corners: THREE.Vector3[] = []
  let hw = 1.7 // puolileveys x
  let hd = 1.05 // puolisyvyys z
  const step = 0.22

  // Sisäänajo ylhäältä kulmaan
  corners.push(new THREE.Vector3(-hw, 0.7, -hd))
  corners.push(new THREE.Vector3(-hw, 0, -hd))

  while (hw > 0.12 && hd > 0.12) {
    corners.push(new THREE.Vector3(hw, 0, -hd))
    corners.push(new THREE.Vector3(hw, 0, hd))
    corners.push(new THREE.Vector3(-hw + step, 0, hd))
    corners.push(new THREE.Vector3(-hw + step, 0, -hd + step))
    hw -= step
    hd -= step
  }
  corners.push(new THREE.Vector3(0, 0, 0))
  // Nosto lopussa
  corners.push(new THREE.Vector3(0, 0.5, 0))

  // Tasavälinen uudelleennäytteistys
  const dense: THREE.Vector3[] = []
  const spacing = 0.035
  for (let i = 0; i < corners.length - 1; i++) {
    const a = corners[i]
    const b = corners[i + 1]
    const dist = a.distanceTo(b)
    const n = Math.max(1, Math.round(dist / spacing))
    for (let j = 0; j < n; j++) {
      dense.push(new THREE.Vector3().lerpVectors(a, b, j / n))
    }
  }
  dense.push(corners[corners.length - 1].clone())
  return dense
}

/** Koordinaattiruudukko pisteinä radan alla. */
function DotGrid() {
  const geometry = useMemo(() => {
    const cols = 36
    const rows = 24
    const spacing = 0.16
    const positions = new Float32Array(cols * rows * 3)
    let i = 0
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        positions[i++] = (x - cols / 2) * spacing
        positions[i++] = -0.02
        positions[i++] = (z - rows / 2) * spacing
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])

  return (
    <points geometry={geometry}>
      <pointsMaterial size={0.014} color="#8C9196" transparent opacity={0.45} />
    </points>
  )
}

function Toolpath({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null)
  const brightLine = useRef<Line2>(null)
  const tip = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })

  const points = useMemo(() => buildPocketPath(), [])
  const segmentCount = points.length - 1

  // Canvas on pointer-events: none — hiiri luetaan ikkunasta
  useEffect(() => {
    if (reducedMotion) return
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reducedMotion])

  useFrame((state, delta) => {
    if (!brightLine.current || !tip.current || !group.current) return

    let progress = 1
    if (!reducedMotion) {
      // Jatkuva ajo + scroll nopeuttaa; lopussa pieni tauko ennen uutta ajoa
      const t = state.clock.elapsedTime * 0.045 + window.scrollY / window.innerHeight / 6
      progress = Math.min((t % 1.12) / 1, 1)
    }

    const idx = Math.max(1, Math.floor(progress * segmentCount))
    // LineSegmentsGeometry on instanssoitu: piirretään vain idx segmenttiä
    brightLine.current.geometry.instanceCount = idx

    const tipPoint = points[Math.min(idx, points.length - 1)]
    tip.current.position.copy(tipPoint)
    tip.current.visible = progress < 1

    if (!reducedMotion) {
      // Kevyt orbit hiiren mukaan
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        pointer.current.x * 0.22,
        3,
        delta,
      )
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        pointer.current.y * 0.08,
        3,
        delta,
      )
    }
  })

  return (
    <group ref={group}>
      <DotGrid />
      {/* Koko rata himmeänä referenssinä */}
      <Line points={points} color="#565049" lineWidth={1} transparent opacity={0.35} />
      {/* Ajettu osuus messingillä */}
      <Line ref={brightLine} points={points} color="#D6A94A" lineWidth={2} />
      {/* Kärki: kirkas ydin + himmeä hehku */}
      <group ref={tip}>
        <mesh>
          <sphereGeometry args={[0.028, 16, 16]} />
          <meshBasicMaterial color="#F0D488" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshBasicMaterial
            color="#D6A94A"
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Heron 3D-kerros: CAM-tyylinen työstöratasimulaatio.
 * Ei valaistusta eikä ulkoisia asseteja — pelkkiä viivoja ja pisteitä.
 */
export default function ToolpathScene({ reducedMotion }: ToolpathSceneProps) {
  return (
    <div className="hero__scene" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 38, position: [0.4, 2.1, 3.1] }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <Toolpath reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}
