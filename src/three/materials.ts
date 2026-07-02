import * as THREE from 'three'

/** Shared colour story for both scenes. */
export const PALETTE = {
  paint: 0xdcd7cb, // Hiace white, warmed to sit in the bone palette
  paintDark: 0x2a2723,
  glass: 0x272e31,
  rubber: 0x1b1c1d,
  hub: 0x93969a,
  steel: 0x969ba0,
  chrome: 0xd6d8d9,
  floor: 0x232120,
  panel: 0xe9e2d2,
  foam: 0xe3d49c,
  leather: 0x8a4a22, // cognac
  leatherDeep: 0x6b3517,
  leatherDark: 0x33312e, // charcoal
  stitch: 0xd9a441,
  lightWarm: 0xffd9a0,
} as const

/** Tiny tiled noise bump texture — gives leather & paint a hint of tooth. */
let noiseTex: THREE.Texture | null = null
export function getNoiseBump(): THREE.Texture {
  if (noiseTex) return noiseTex
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(size, size)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 118 + Math.random() * 20
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  noiseTex = new THREE.CanvasTexture(canvas)
  noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping
  noiseTex.repeat.set(6, 6)
  return noiseTex
}

export function leatherMaterial(color: number | THREE.Color, opts: { rough?: number; sheen?: number } = {}) {
  const mat = new THREE.MeshPhysicalMaterial({
    color,
    roughness: opts.rough ?? 0.62,
    metalness: 0,
    clearcoat: 0.12,
    clearcoatRoughness: 0.55,
    sheen: opts.sheen ?? 0.35,
    sheenColor: new THREE.Color(0xffffff),
    sheenRoughness: 0.9,
    bumpMap: getNoiseBump(),
    bumpScale: 0.22,
  })
  mat.envMapIntensity = 0.35
  return mat
}

export function paintMaterial(color: number) {
  const mat = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.32,
    metalness: 0.08,
    clearcoat: 0.65,
    clearcoatRoughness: 0.28,
    side: THREE.DoubleSide,
  })
  mat.envMapIntensity = 0.9
  return mat
}

export function glassMaterial() {
  const mat = new THREE.MeshPhysicalMaterial({
    color: PALETTE.glass,
    roughness: 0.06,
    metalness: 0.25,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    transparent: true,
    opacity: 0.9,
  })
  mat.envMapIntensity = 1.4
  return mat
}

export function steelMaterial(color: number = PALETTE.steel) {
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.38,
    metalness: 0.85,
  })
  mat.envMapIntensity = 0.9
  return mat
}

export function matteMaterial(color: number, rough = 0.9) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0 })
}

export function foamMaterial() {
  return new THREE.MeshStandardMaterial({
    color: PALETTE.foam,
    roughness: 0.97,
    metalness: 0,
    bumpMap: getNoiseBump(),
    bumpScale: 0.5,
  })
}

/** Soft radial gradient used as a fake contact shadow under vehicles/objects. */
export function contactShadowTexture(): THREE.Texture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.05, size / 2, size / 2, size * 0.5)
  g.addColorStop(0, 'rgba(20,16,10,0.42)')
  g.addColorStop(0.55, 'rgba(20,16,10,0.18)')
  g.addColorStop(1, 'rgba(20,16,10,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  return tex
}

/** Rounded-box convenience (BoxGeometry with many segments run through a bevel-ish scale is ugly;
 *  we build a true rounded box from an extruded rounded rect). */
export function roundedBoxGeometry(w: number, h: number, d: number, r: number, smooth = 4): THREE.ExtrudeGeometry {
  const radius = Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001)
  const shape = new THREE.Shape()
  const hw = w / 2 - radius
  const hh = h / 2 - radius
  shape.absarc(hw, hh, radius, 0, Math.PI / 2, false)
  shape.absarc(-hw, hh, radius, Math.PI / 2, Math.PI, false)
  shape.absarc(-hw, -hh, radius, Math.PI, Math.PI * 1.5, false)
  shape.absarc(hw, -hh, radius, Math.PI * 1.5, Math.PI * 2, false)
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: d - radius * 2,
    bevelEnabled: true,
    bevelThickness: radius,
    bevelSize: radius,
    bevelSegments: smooth,
    curveSegments: smooth * 2,
  })
  geo.translate(0, 0, -(d - radius * 2) / 2)
  geo.computeVertexNormals()
  return geo
}
