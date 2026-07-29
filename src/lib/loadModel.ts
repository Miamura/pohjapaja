import * as THREE from 'three'
import { STLLoader, mergeBufferGeometries } from 'three-stdlib'

// HUOM: tämä moduuli ladataan VAIN dynaamisesti (client-only), jotta
// three / three-stdlib ei päädy SSR-prerenderiin. STEP-polku (occt-import-js
// WASM ~useita MB) ladataan vielä erikseen lazyna vasta kun käyttäjä tuo
// STEP-tiedoston — STL-käyttäjä ei maksa siitä mitään.

export type ModelFormat = 'stl' | 'step'

export interface ModelData {
  geometry: THREE.BufferGeometry
  /** Rajaavan laatikon koko millimetreinä (oletusyksikkö). */
  size: THREE.Vector3
  triangles: number
  /** Mesh-tilavuus mm³ (likimääräinen; null jos ei laskettavissa). */
  volumeMm3: number | null
}

export function detectFormat(name: string): ModelFormat | null {
  const ext = name.toLowerCase().split('.').pop()
  if (ext === 'stl') return 'stl'
  if (ext === 'step' || ext === 'stp') return 'step'
  return null
}

/** Suljetun meshin etumerkillinen tilavuus (tetraedrisumma). */
function meshVolume(geo: THREE.BufferGeometry): number | null {
  const pos = geo.getAttribute('position')
  if (!pos) return null
  const index = geo.index
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  const cross = new THREE.Vector3()
  let vol = 0
  const count = index ? index.count : pos.count
  for (let i = 0; i < count; i += 3) {
    const ia = index ? index.getX(i) : i
    const ib = index ? index.getX(i + 1) : i + 1
    const ic = index ? index.getX(i + 2) : i + 2
    a.fromBufferAttribute(pos, ia)
    b.fromBufferAttribute(pos, ib)
    c.fromBufferAttribute(pos, ic)
    cross.copy(b).cross(c)
    vol += a.dot(cross) / 6
  }
  return Math.abs(vol)
}

function finalize(geometry: THREE.BufferGeometry): ModelData {
  if (!geometry.getAttribute('normal')) geometry.computeVertexNormals()
  geometry.computeBoundingBox()
  const size = new THREE.Vector3()
  geometry.boundingBox?.getSize(size)
  const pos = geometry.getAttribute('position')
  const triangles = Math.round((geometry.index ? geometry.index.count : pos.count) / 3)
  const volumeMm3 = meshVolume(geometry)
  // Keskitä origoon sujuvaa orbittia varten (koko on jo mitattu yllä)
  geometry.center()
  geometry.computeBoundingSphere()
  return { geometry, size, triangles, volumeMm3 }
}

export async function loadStl(buffer: ArrayBuffer): Promise<ModelData> {
  return finalize(new STLLoader().parse(buffer))
}

export async function loadStep(buffer: ArrayBuffer): Promise<ModelData> {
  const [occtMod, wasmMod] = await Promise.all([
    import('occt-import-js'),
    import('occt-import-js/dist/occt-import-js.wasm?url'),
  ])
  const occt = await occtMod.default({ locateFile: () => wasmMod.default })
  const result = occt.ReadStepFile(new Uint8Array(buffer), null)
  if (!result?.success || !result.meshes?.length) throw new Error('step-empty')

  const geoms = result.meshes.map((m) => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(m.attributes.position.array, 3))
    if (m.index) g.setIndex(m.index.array)
    // Pudotetaan occt-normaalit ja lasketaan itse -> kaikilla geomilla sama
    // attribuuttijoukko, jotta merge onnistuu.
    return g.toNonIndexed()
  })

  const merged = geoms.length === 1 ? geoms[0] : mergeBufferGeometries(geoms, false)
  if (!merged) throw new Error('step-merge')
  return finalize(merged)
}
