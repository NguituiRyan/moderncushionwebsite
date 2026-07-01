import * as THREE from 'three'
import { leatherMaterial, steelMaterial, foamMaterial, matteMaterial, roundedBoxGeometry, PALETTE } from './materials'

export interface SeatColors {
  base: number | string
  accent: number | string
  stitch: number | string
}

export interface SeatBuild {
  group: THREE.Group
  base: THREE.Group
  frame: THREE.Group
  foam: THREE.Group
  cover: THREE.Group
  headrest: THREE.Group
  armrests: THREE.Group
  belt: THREE.Group
  /* explode-level subparts */
  foamSeat: THREE.Object3D
  foamBack: THREE.Object3D
  coverSeat: THREE.Group
  coverBack: THREE.Group
  armL: THREE.Group
  armR: THREE.Group
  anchors: Record<string, THREE.Object3D>
  leatherMats: THREE.MeshPhysicalMaterial[]
  accentMats: THREE.MeshPhysicalMaterial[]
  stitchMats: THREE.Material[]
}

export interface SeatOpts {
  /** shared webbing material — when provided, a 3-point belt is fitted (van seats) */
  beltMat?: THREE.Material
}

/** Thin webbing strap stretched between two points. */
export function strapMesh(a: THREE.Vector3, b: THREE.Vector3, width: number, mat: THREE.Material): THREE.Mesh {
  const len = a.distanceTo(b)
  const geo = new THREE.BoxGeometry(width, len, 0.011)
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.copy(a).add(b).multiplyScalar(0.5)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
  return mesh
}

const BACK_TILT = -0.16 // radians, leaning backwards

/**
 * Builds a captain-style upholstered seat facing +Z.
 * `detail: 'hero'` includes frame/springs/piping for the exploded showcase;
 * `detail: 'van'` is the lighter version used inside the van cabin.
 */
export function buildSeat(detail: 'hero' | 'van', colors: SeatColors, opts: SeatOpts = {}): SeatBuild {
  const group = new THREE.Group()

  const leather = leatherMaterial(new THREE.Color(colors.base as string))
  const leatherAccent = leatherMaterial(new THREE.Color(colors.accent as string), { rough: 0.5 })
  const stitch = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colors.stitch as string),
    roughness: 0.7,
    metalness: 0,
  })
  const steel = steelMaterial()
  const darkSteel = steelMaterial(0x3c3f42)

  const leatherMats = [leather]
  const accentMats = [leatherAccent]
  const stitchMats: THREE.Material[] = [stitch]

  const anchors: Record<string, THREE.Object3D> = {}
  // anchors are parented to the part they describe so callouts track the exploded view
  const anchor = (parent: THREE.Object3D, name: string, x: number, y: number, z: number) => {
    const o = new THREE.Object3D()
    o.position.set(x, y, z)
    parent.add(o)
    anchors[name] = o
  }

  /* ------------------------------- base ------------------------------- */
  const base = new THREE.Group()
  const railGeo = roundedBoxGeometry(0.05, 0.05, 0.5, 0.014, 3)
  for (const sx of [-0.19, 0.19]) {
    const rail = new THREE.Mesh(railGeo, darkSteel)
    rail.position.set(sx, 0.035, 0.02)
    base.add(rail)
  }
  const riser = new THREE.Mesh(roundedBoxGeometry(0.4, 0.15, 0.42, 0.03, 3), matteMaterial(0x26262a, 0.7))
  riser.position.set(0, 0.15, 0)
  base.add(riser)
  if (detail === 'hero') {
    const lever = new THREE.Mesh(roundedBoxGeometry(0.16, 0.028, 0.028, 0.012, 2), steel)
    lever.position.set(0.24, 0.17, 0.16)
    base.add(lever)
  }
  group.add(base)

  /* ------------------------------- frame ------------------------------ */
  const frame = new THREE.Group()
  if (detail === 'hero') {
    const tubeR = 0.014
    const panPath = roundedRectPath(0.46, 0.44, 0.09)
    const panCurve = new THREE.CatmullRomCurve3(panPath, true, 'catmullrom', 0.08)
    const pan = new THREE.Mesh(new THREE.TubeGeometry(panCurve, 80, tubeR, 10, true), steel)
    pan.rotation.x = -Math.PI / 2
    pan.position.set(0, 0.3, 0.02)
    frame.add(pan)

    // springs across the pan
    for (let i = 0; i < 4; i++) {
      const z = -0.14 + i * 0.1
      const pts: THREE.Vector3[] = []
      for (let s = 0; s <= 24; s++) {
        const t = s / 24
        pts.push(new THREE.Vector3(-0.2 + t * 0.4, Math.sin(t * Math.PI * 6) * 0.012, 0))
      }
      const springCurve = new THREE.CatmullRomCurve3(pts)
      const spring = new THREE.Mesh(new THREE.TubeGeometry(springCurve, 60, 0.004, 6), darkSteel)
      spring.position.set(0, 0.3, z + 0.02)
      frame.add(spring)
    }

    // backrest hoop
    const backPath = roundedRectPath(0.42, 0.58, 0.09)
    const backCurve = new THREE.CatmullRomCurve3(backPath, true, 'catmullrom', 0.08)
    const backHoop = new THREE.Mesh(new THREE.TubeGeometry(backCurve, 80, tubeR, 10, true), steel)
    backHoop.position.set(0, 0.66, -0.21)
    backHoop.rotation.x = BACK_TILT
    frame.add(backHoop)
    for (const dy of [-0.12, 0.1]) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.4, 8), darkSteel)
      bar.rotation.z = Math.PI / 2
      bar.position.set(0, 0.66 + dy, -0.21 - Math.tan(BACK_TILT) * dy)
      bar.rotation.x = BACK_TILT
      frame.add(bar)
    }
    anchor(frame, 'frame', -0.25, 0.3, 0.26)
  }
  group.add(frame)

  /* ------------------------------- foam ------------------------------- */
  const foam = new THREE.Group()
  const foamMat = foamMaterial()
  const foamSeat = new THREE.Mesh(roundedBoxGeometry(0.52, 0.1, 0.5, 0.04, 3), foamMat)
  foamSeat.position.set(0, 0.42, 0.02)
  foam.add(foamSeat)
  const foamBack = new THREE.Mesh(roundedBoxGeometry(0.5, 0.6, 0.09, 0.04, 3), foamMat)
  foamBack.position.set(0, 0.7, -0.215)
  foamBack.rotation.x = BACK_TILT
  foam.add(foamBack)
  anchor(foamSeat, 'foam', 0.27, 0.03, 0.12)
  group.add(foam)

  /* ------------------------------- cover ------------------------------ */
  const cover = new THREE.Group()

  // seat cushion
  const seatCushion = new THREE.Group()
  const seatMain = new THREE.Mesh(roundedBoxGeometry(0.58, 0.15, 0.55, 0.055, 4), leather)
  seatMain.position.set(0, 0.44, 0.02)
  seatCushion.add(seatMain)
  const channelGeo = roundedBoxGeometry(0.116, 0.045, 0.4, 0.02, 3)
  for (let i = -1; i <= 1; i++) {
    const pad = new THREE.Mesh(channelGeo, leather)
    pad.position.set(i * 0.132, 0.51, 0.035)
    seatCushion.add(pad)
  }
  for (const sx of [-0.245, 0.245]) {
    const bolster = new THREE.Mesh(roundedBoxGeometry(0.1, 0.075, 0.5, 0.032, 3), leatherAccent)
    bolster.position.set(sx, 0.505, 0.02)
    bolster.rotation.z = sx > 0 ? -0.14 : 0.14
    seatCushion.add(bolster)
  }
  const frontRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 18), leatherAccent)
  frontRoll.rotation.z = Math.PI / 2
  frontRoll.position.set(0, 0.46, 0.29)
  seatCushion.add(frontRoll)
  if (detail === 'hero') {
    const pipe = pipingLoop(0.55, 0.5, 0.055, stitch)
    pipe.position.set(0, 0.515, 0.02)
    seatCushion.add(pipe)
  }
  cover.add(seatCushion)

  // backrest
  const backrest = new THREE.Group()
  backrest.position.set(0, 0.72, -0.22)
  backrest.rotation.x = BACK_TILT
  const backMain = new THREE.Mesh(roundedBoxGeometry(0.58, 0.72, 0.15, 0.055, 4), leather)
  backrest.add(backMain)
  const backChannelGeo = roundedBoxGeometry(0.115, 0.5, 0.04, 0.018, 3)
  for (let i = -1; i <= 1; i++) {
    const pad = new THREE.Mesh(backChannelGeo, leather)
    pad.position.set(i * 0.131, 0.02, 0.085)
    backrest.add(pad)
  }
  for (const sx of [-0.25, 0.25]) {
    const wing = new THREE.Mesh(roundedBoxGeometry(0.09, 0.6, 0.09, 0.032, 3), leatherAccent)
    wing.position.set(sx, 0.015, 0.06)
    wing.rotation.y = sx > 0 ? -0.22 : 0.22
    backrest.add(wing)
  }
  const lumbar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.46, 18), leatherAccent)
  lumbar.rotation.z = Math.PI / 2
  lumbar.position.set(0, -0.28, 0.075)
  backrest.add(lumbar)
  if (detail === 'hero') {
    // vertical piping loop hugging the backrest face
    const path = roundedRectPath(0.5, 0.64, 0.05)
    const curve = new THREE.CatmullRomCurve3(path, true, 'catmullrom', 0.06)
    const pipe = new THREE.Mesh(new THREE.TubeGeometry(curve, 90, 0.0085, 8, true), stitch)
    pipe.position.set(0, 0.01, 0.083)
    backrest.add(pipe)
  }
  cover.add(backrest)
  anchor(backrest, 'cover', -0.31, 0.14, 0.1)
  group.add(cover)

  /* ------------------------------ headrest ---------------------------- */
  const headrest = new THREE.Group()
  const pillow = new THREE.Mesh(roundedBoxGeometry(0.32, 0.2, 0.13, 0.055, 4), leather)
  pillow.position.set(0, 1.24, -0.28)
  pillow.rotation.x = BACK_TILT * 1.2
  headrest.add(pillow)
  for (const sx of [-0.07, 0.07]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.16, 8), steel)
    post.position.set(sx, 1.1, -0.265)
    post.rotation.x = BACK_TILT
    headrest.add(post)
  }
  anchor(headrest, 'headrest', 0.2, 1.26, -0.24)
  group.add(headrest)

  /* ------------------------------ armrests ---------------------------- */
  const armrests = new THREE.Group()
  const arms: THREE.Group[] = []
  for (const sx of [-1, 1]) {
    const arm = new THREE.Group()
    const pad = new THREE.Mesh(roundedBoxGeometry(0.075, 0.06, 0.42, 0.028, 3), leatherAccent)
    pad.position.set(sx * 0.335, 0.72, 0.06)
    pad.rotation.x = -0.08
    arm.add(pad)
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 10), darkSteel)
    stem.position.set(sx * 0.335, 0.62, -0.12)
    stem.rotation.x = 0.42
    arm.add(stem)
    armrests.add(arm)
    arms.push(arm)
  }
  group.add(armrests)

  /* ---------------------------- three-point belt ---------------------------- */
  // integrated belt: retractor on the left shoulder, webbing across to a
  // buckle at the right hip, lap strap over the cushion
  const belt = new THREE.Group()
  const wantsBelt = detail === 'hero' || opts.beltMat
  if (wantsBelt) {
    const webbing =
      opts.beltMat ??
      new THREE.MeshStandardMaterial({ color: 0x232322, roughness: 0.72, metalness: 0.05 })
    const retractor = new THREE.Mesh(roundedBoxGeometry(0.07, 0.13, 0.055, 0.02, 2), webbing)
    retractor.position.set(-0.26, 1.0, -0.19)
    belt.add(retractor)
    const shoulder = strapMesh(
      new THREE.Vector3(-0.24, 1.02, -0.12),
      new THREE.Vector3(0.22, 0.545, 0.155),
      0.052,
      webbing,
    )
    belt.add(shoulder)
    const lap = strapMesh(
      new THREE.Vector3(-0.24, 0.548, 0.15),
      new THREE.Vector3(0.24, 0.548, 0.16),
      0.052,
      webbing,
    )
    belt.add(lap)
    const buckle = new THREE.Mesh(roundedBoxGeometry(0.05, 0.09, 0.035, 0.012, 2), webbing)
    buckle.position.set(0.25, 0.535, 0.17)
    belt.add(buckle)
    if (detail === 'hero') {
      const release = new THREE.Mesh(
        new THREE.SphereGeometry(0.013, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xb3261e, roughness: 0.4 }),
      )
      release.position.set(0.25, 0.568, 0.185)
      belt.add(release)
      const guide = new THREE.Mesh(roundedBoxGeometry(0.06, 0.035, 0.03, 0.012, 2), webbing)
      guide.position.set(-0.245, 1.06, -0.135)
      belt.add(guide)
      anchor(belt, 'belt', 0.27, 0.53, 0.18)
    }
    group.add(belt)
  }

  return {
    group,
    base,
    frame,
    foam,
    cover,
    headrest,
    armrests,
    belt,
    foamSeat,
    foamBack,
    coverSeat: seatCushion,
    coverBack: backrest,
    armL: arms[0],
    armR: arms[1],
    anchors,
    leatherMats,
    accentMats,
    stitchMats,
  }
}

/** Rounded-rectangle outline path in the XY plane (for tube frames / piping). */
function roundedRectPath(w: number, h: number, r: number): THREE.Vector3[] {
  const hw = w / 2
  const hh = h / 2
  const pts: THREE.Vector3[] = []
  const corner = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i <= 6; i++) {
      const a = a0 + (i / 6) * (Math.PI / 2)
      pts.push(new THREE.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0))
    }
  }
  corner(hw - r, hh - r, 0)
  corner(-(hw - r), hh - r, Math.PI / 2)
  corner(-(hw - r), -(hh - r), Math.PI)
  corner(hw - r, -(hh - r), Math.PI * 1.5)
  return pts
}

/** Thin piping tube following a rounded-rect seam, laid flat (XZ plane). */
function pipingLoop(w: number, d: number, r: number, mat: THREE.Material): THREE.Mesh {
  const path = roundedRectPath(w, d, r)
  const curve = new THREE.CatmullRomCurve3(path, true, 'catmullrom', 0.06)
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 90, 0.0085, 8, true), mat)
  mesh.rotation.x = -Math.PI / 2
  return mesh
}

/** Colour swap used by the fabric picker. */
export function setSeatColors(build: SeatBuild, colors: SeatColors, lerp = 0): void {
  const apply = (mats: THREE.MeshPhysicalMaterial[], target: string) => {
    for (const m of mats) {
      if (lerp <= 0) m.color.set(target)
      else m.color.lerp(new THREE.Color(target), lerp)
    }
  }
  apply(build.leatherMats, colors.base as string)
  apply(build.accentMats, colors.accent as string)
  for (const m of build.stitchMats) {
    ;(m as THREE.MeshStandardMaterial).color.set(colors.stitch as string)
  }
}

export { PALETTE }
