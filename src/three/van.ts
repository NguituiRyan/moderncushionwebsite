import * as THREE from 'three'
import {
  PALETTE,
  paintMaterial,
  glassMaterial,
  steelMaterial,
  matteMaterial,
  roundedBoxGeometry,
} from './materials'
import { buildSeat, strapMesh, type SeatBuild } from './seat'

export interface VanBuild {
  group: THREE.Group
  /** Materials that get sliced open by the cutaway plane. */
  cutMaterials: THREE.Material[]
  floorStrips: THREE.Mesh[]
  wallPanels: THREE.Object3D[]
  seatRows: THREE.Group[]
  bench: THREE.Group
  stars: THREE.InstancedMesh
  starsMaterial: THREE.MeshBasicMaterial
  cabinLight: THREE.PointLight
  headlights: THREE.MeshStandardMaterial
  taillights: THREE.MeshStandardMaterial
  /** shared webbing material for all 3-point and 2-point belts — faded in during chapter 4 */
  beltMaterial: THREE.MeshStandardMaterial
}

const BODY_LEN = 4.7
const HALF = BODY_LEN / 2 // 2.35
const DEPTH = 1.68
const BEVEL = 0.075
const SIDE_Z = DEPTH / 2 + BEVEL // 0.915
const FLOOR_Y = 0.45

export function buildVan(): VanBuild {
  const group = new THREE.Group()
  const cutMaterials: THREE.Material[] = []

  /* ------------------------------ body shell ------------------------------ */
  const paint = paintMaterial(PALETTE.paint)
  cutMaterials.push(paint)

  const s = new THREE.Shape()
  s.moveTo(2.32, 0.34)
  s.lineTo(1.99, 0.34)
  s.absarc(1.57, 0.34, 0.42, 0, Math.PI, false)
  s.lineTo(-1.03, 0.34)
  s.absarc(-1.45, 0.34, 0.42, 0, Math.PI, false)
  s.lineTo(-2.32, 0.34)
  s.quadraticCurveTo(-2.35, 0.36, -2.35, 0.6)
  s.lineTo(-2.35, 1.76)
  s.quadraticCurveTo(-2.35, 2.06, -2.02, 2.08)
  s.lineTo(1.02, 2.08)
  s.quadraticCurveTo(1.46, 2.05, 1.68, 1.93)
  s.lineTo(2.18, 1.06)
  s.quadraticCurveTo(2.31, 0.98, 2.33, 0.86)
  s.lineTo(2.35, 0.6)
  s.quadraticCurveTo(2.35, 0.35, 2.32, 0.34)

  const bodyGeo = new THREE.ExtrudeGeometry(s, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 5,
    curveSegments: 22,
  })
  bodyGeo.translate(0, 0, -DEPTH / 2)
  bodyGeo.computeVertexNormals()
  const body = new THREE.Mesh(bodyGeo, paint)
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)

  /* ------------------------------- windows -------------------------------- */
  const glass = glassMaterial()
  const frameMat = matteMaterial(0x191a18, 0.55)
  cutMaterials.push(glass, frameMat)

  frameMat.transparent = true
  frameMat.opacity = 0.55
  const sideWindow = (x0: number, x1: number, y0: number, y1: number) => {
    for (const sz of [1, -1]) {
      const w = x1 - x0
      const h = y1 - y0
      const frame = new THREE.Mesh(roundedBoxGeometry(w + 0.06, h + 0.06, 0.02, 0.05, 3), frameMat)
      frame.position.set((x0 + x1) / 2, (y0 + y1) / 2, sz * (SIDE_Z - 0.002))
      group.add(frame)
      const pane = new THREE.Mesh(roundedBoxGeometry(w, h, 0.02, 0.045, 3), glass)
      pane.position.set((x0 + x1) / 2, (y0 + y1) / 2, sz * (SIDE_Z + 0.008))
      group.add(pane)
    }
  }
  // front door window is a raked trapezoid so it stays inside the A-pillar line
  const rakedWindow = () => {
    const quad = (pts: Array<[number, number]>, r: number) => {
      const shape = new THREE.Shape()
      const n = pts.length
      for (let i = 0; i < n; i++) {
        const prev = pts[(i + n - 1) % n]
        const cur = pts[i]
        const next = pts[(i + 1) % n]
        const d1 = new THREE.Vector2(prev[0] - cur[0], prev[1] - cur[1]).normalize()
        const d2 = new THREE.Vector2(next[0] - cur[0], next[1] - cur[1]).normalize()
        const p1 = new THREE.Vector2(cur[0] + d1.x * r, cur[1] + d1.y * r)
        const p2 = new THREE.Vector2(cur[0] + d2.x * r, cur[1] + d2.y * r)
        if (i === 0) shape.moveTo(p1.x, p1.y)
        else shape.lineTo(p1.x, p1.y)
        shape.quadraticCurveTo(cur[0], cur[1], p2.x, p2.y)
      }
      shape.closePath()
      return shape
    }
    const glassPts: Array<[number, number]> = [
      [1.3, 1.18],
      [1.96, 1.18],
      [1.64, 1.82],
      [1.3, 1.82],
    ]
    const framePts: Array<[number, number]> = [
      [1.27, 1.15],
      [2.0, 1.15],
      [1.66, 1.85],
      [1.27, 1.85],
    ]
    const glassGeo = new THREE.ExtrudeGeometry(quad(glassPts, 0.05), {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 2,
      curveSegments: 6,
    })
    const frameGeo = new THREE.ExtrudeGeometry(quad(framePts, 0.05), {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 2,
      curveSegments: 6,
    })
    for (const sz of [1, -1]) {
      const frame = new THREE.Mesh(frameGeo, frameMat)
      frame.position.set(0, 0, sz * (SIDE_Z - 0.002) - 0.01)
      group.add(frame)
      const pane = new THREE.Mesh(glassGeo, glass)
      pane.position.set(0, 0, sz * (SIDE_Z + 0.008) - 0.01)
      group.add(pane)
    }
  }
  rakedWindow() // front doors
  sideWindow(0.3, 1.18, 1.18, 1.82) // sliding door
  sideWindow(-0.68, 0.18, 1.18, 1.82) // mid
  sideWindow(-1.62, -0.8, 1.18, 1.82) // rear quarter
  const rearGlassPane = new THREE.Mesh(roundedBoxGeometry(1.34, 0.62, 0.02, 0.06, 3), glass)
  rearGlassPane.rotation.y = -Math.PI / 2
  rearGlassPane.position.set(-2.445, 1.5, 0)
  group.add(rearGlassPane)

  // windshield — raked panel matching the profile line
  const rakeBottom = new THREE.Vector3(2.18, 1.06, 0)
  const rakeTop = new THREE.Vector3(1.68, 1.93, 0)
  const rakeDir = rakeTop.clone().sub(rakeBottom).normalize()
  const across = new THREE.Vector3(0, 0, 1)
  const normal = new THREE.Vector3().crossVectors(rakeDir, across) // outward (+x-ish)
  const shieldH = rakeBottom.distanceTo(rakeTop) - 0.06
  const shield = new THREE.Mesh(roundedBoxGeometry(1.5, shieldH, 0.02, 0.05, 3), glass)
  const basis = new THREE.Matrix4().makeBasis(across.clone().negate(), rakeDir, normal)
  shield.quaternion.setFromRotationMatrix(basis)
  // the extrude bevel bulges the outer skin ~0.075 beyond the profile — sit the glass on top of it
  shield.position
    .copy(rakeBottom)
    .add(rakeTop)
    .multiplyScalar(0.5)
    .add(normal.clone().multiplyScalar(0.088))
  group.add(shield)

  /* ----------------------------- trim & lights ---------------------------- */
  const darkTrim = matteMaterial(PALETTE.paintDark, 0.6)
  cutMaterials.push(darkTrim)
  const frontBumper = new THREE.Mesh(roundedBoxGeometry(0.2, 0.22, 1.78, 0.06, 3), darkTrim)
  frontBumper.position.set(2.39, 0.44, 0)
  group.add(frontBumper)
  const rearBumper = new THREE.Mesh(roundedBoxGeometry(0.16, 0.2, 1.78, 0.06, 3), darkTrim)
  rearBumper.position.set(-2.39, 0.44, 0)
  group.add(rearBumper)

  const grille = new THREE.Mesh(roundedBoxGeometry(0.06, 0.2, 0.95, 0.03, 3), darkTrim)
  grille.position.set(2.44, 0.68, 0)
  group.add(grille)
  const chromeBar = new THREE.Mesh(roundedBoxGeometry(0.05, 0.035, 1.0, 0.016, 2), steelMaterial(PALETTE.chrome))
  chromeBar.position.set(2.45, 0.79, 0)
  group.add(chromeBar)

  const headMat = new THREE.MeshStandardMaterial({
    color: 0xf4efe2,
    roughness: 0.2,
    metalness: 0.1,
    emissive: 0xfff3d6,
    emissiveIntensity: 0.25,
  })
  cutMaterials.push(headMat)
  for (const sz of [-0.62, 0.62]) {
    const lamp = new THREE.Mesh(roundedBoxGeometry(0.07, 0.16, 0.34, 0.05, 3), headMat)
    lamp.position.set(2.44, 0.92, sz)
    group.add(lamp)
  }
  const tailMat = new THREE.MeshStandardMaterial({
    color: 0x651713,
    roughness: 0.25,
    metalness: 0.1,
    emissive: 0x8c1d15,
    emissiveIntensity: 0.25,
  })
  cutMaterials.push(tailMat)
  for (const sz of [-0.74, 0.74]) {
    const lamp = new THREE.Mesh(roundedBoxGeometry(0.06, 0.44, 0.1, 0.035, 3), tailMat)
    lamp.position.set(-2.44, 1.0, sz)
    group.add(lamp)
  }

  const mirrorMat = matteMaterial(0x1d1e1c, 0.5)
  cutMaterials.push(mirrorMat)
  for (const sz of [1, -1]) {
    const mirror = new THREE.Mesh(roundedBoxGeometry(0.05, 0.15, 0.09, 0.03, 3), mirrorMat)
    mirror.position.set(2.02, 1.5, sz * (SIDE_Z + 0.1))
    group.add(mirror)
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8), mirrorMat)
    stem.rotation.x = Math.PI / 2
    stem.position.set(2.02, 1.44, sz * (SIDE_Z + 0.03))
    group.add(stem)
  }
  const handleMat = matteMaterial(0x35362f, 0.45)
  cutMaterials.push(handleMat)
  for (const sz of [1, -1]) {
    for (const hx of [1.66, 0.9]) {
      const handle = new THREE.Mesh(roundedBoxGeometry(0.16, 0.035, 0.02, 0.015, 2), handleMat)
      handle.position.set(hx, 1.04, sz * (SIDE_Z + 0.006))
      group.add(handle)
    }
  }

  /* ------------------------------- wheels --------------------------------- */
  const tyreMat = matteMaterial(PALETTE.rubber, 0.92)
  const hubMat = steelMaterial(PALETTE.hub)
  cutMaterials.push(tyreMat, hubMat)
  const tyreGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.24, 28)
  const hubGeo = new THREE.CylinderGeometry(0.155, 0.155, 0.245, 22)
  for (const wx of [1.57, -1.45]) {
    for (const sz of [1, -1]) {
      const tyre = new THREE.Mesh(tyreGeo, tyreMat)
      tyre.rotation.x = Math.PI / 2
      tyre.position.set(wx, 0.34, sz * 0.76)
      tyre.castShadow = true
      group.add(tyre)
      const hub = new THREE.Mesh(hubGeo, hubMat)
      hub.rotation.x = Math.PI / 2
      hub.position.set(wx, 0.34, sz * 0.76)
      group.add(hub)
    }
  }

  /* ------------------------- interior arch boxes -------------------------- */
  // deliberately NOT clipped: they hide the white shell arches in the dollhouse view
  const archMat = matteMaterial(0x2c2a26, 0.85)
  archMat.side = THREE.DoubleSide
  for (const wx of [1.57, -1.45]) {
    for (const sz of [1, -1]) {
      const box = new THREE.Mesh(roundedBoxGeometry(0.95, 0.42, 0.3, 0.05, 3), archMat)
      box.position.set(wx, FLOOR_Y + 0.16, sz * 0.68)
      group.add(box)
    }
  }

  /* ------------------------------ cab interior ----------------------------- */
  const cabMat = matteMaterial(0x3b3a35, 0.85)
  const dash = new THREE.Mesh(roundedBoxGeometry(0.36, 0.24, 1.5, 0.06, 3), cabMat)
  dash.position.set(2.0, 1.0, 0)
  group.add(dash)
  const wheelTorus = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.016, 10, 26),
    matteMaterial(0x232420, 0.6),
  )
  wheelTorus.position.set(1.78, 1.06, 0.42)
  wheelTorus.rotation.y = Math.PI / 2
  wheelTorus.rotation.z = 0.3
  group.add(wheelTorus)
  const cabFloor = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.06, 1.5), matteMaterial(0x232420, 0.8))
  cabFloor.position.set(1.48, FLOOR_Y - 0.032, 0)
  group.add(cabFloor)

  // dark underfloor skirt so the dollhouse cut doesn't expose wheels through the floor gap
  const skirt = new THREE.Mesh(new THREE.BoxGeometry(4.06, 0.28, 0.05), matteMaterial(0x211f1b, 0.9))
  skirt.position.set(0, 0.31, 0.02)
  group.add(skirt)
  const cabColors = { base: '#2e2c29', accent: '#232120', stitch: '#4d4a44' }
  for (const sz of [0.44, -0.44]) {
    const cabSeat = buildSeat('van', cabColors)
    cabSeat.group.scale.setScalar(0.85)
    cabSeat.group.rotation.y = Math.PI / 2
    cabSeat.group.position.set(1.28, FLOOR_Y, sz)
    group.add(cabSeat.group)
  }

  /* --------------------------- furnishing: floor --------------------------- */
  const floorStrips: THREE.Mesh[] = []
  const stripMat = new THREE.MeshPhysicalMaterial({
    color: 0x24221f,
    roughness: 0.55,
    metalness: 0.05,
    clearcoat: 0.3,
    clearcoatRoughness: 0.4,
    transparent: true,
  })
  const sillMat = new THREE.MeshStandardMaterial({
    color: 0x74401f,
    roughness: 0.65,
    transparent: true,
  })
  const stripGeo = new THREE.BoxGeometry(0.52, 0.05, 1.46)
  for (let i = 0; i < 6; i++) {
    const strip = new THREE.Mesh(stripGeo, stripMat.clone())
    strip.position.set(-1.995 + i * 0.53, FLOOR_Y - 0.025, 0)
    strip.receiveShadow = true
    group.add(strip)
    floorStrips.push(strip)
  }
  const sill = new THREE.Mesh(new THREE.BoxGeometry(3.14, 0.035, 0.05), sillMat)
  sill.position.set(-0.7, FLOOR_Y - 0.015, 0.72)
  group.add(sill)
  floorStrips.push(sill as THREE.Mesh)

  /* ------------------------- furnishing: wall panels ----------------------- */
  const wallPanels: THREE.Object3D[] = []
  const panelMat = new THREE.MeshStandardMaterial({
    color: PALETTE.panel,
    roughness: 0.9,
    transparent: true,
  })
  const wallSpans: Array<[number, number]> = [
    [-2.25, -1.55],
    [-1.45, -0.4],
    [-0.3, 0.9],
  ]
  for (const [x0, x1] of wallSpans) {
    const panel = new THREE.Mesh(roundedBoxGeometry(x1 - x0, 0.62, 0.05, 0.03, 3), panelMat)
    panel.position.set((x0 + x1) / 2, 0.82, -0.79)
    group.add(panel)
    wallPanels.push(panel)
  }
  for (const zz of [-0.5, -0.05]) {
    const strip = new THREE.Mesh(roundedBoxGeometry(3.1, 0.05, 0.42, 0.025, 3), panelMat)
    strip.position.set(-0.65, 2.0, zz)
    group.add(strip)
    wallPanels.push(strip)
  }
  const rearPanel = new THREE.Mesh(roundedBoxGeometry(0.05, 0.8, 1.4, 0.03, 3), panelMat)
  rearPanel.position.set(-2.28, 0.95, 0)
  group.add(rearPanel)
  wallPanels.push(rearPanel)

  /* --------------------------- furnishing: seats --------------------------- */
  const vipColors = { base: '#6e3412', accent: '#4f250c', stitch: '#d9a441' }
  const beltMaterial = new THREE.MeshStandardMaterial({
    color: 0x232322,
    roughness: 0.72,
    metalness: 0.05,
    transparent: true,
    opacity: 0,
  })
  const seatRows: THREE.Group[] = []
  const rowX = [0.5, -0.4, -1.3]
  for (const rx of rowX) {
    const row = new THREE.Group()
    for (const sz of [0.36, -0.36]) {
      const seat: SeatBuild = buildSeat('van', vipColors, { beltMat: beltMaterial })
      seat.group.scale.setScalar(0.9)
      seat.group.rotation.y = Math.PI / 2
      seat.group.position.set(0, 0, sz)
      seat.group.traverse((o) => {
        if (o instanceof THREE.Mesh) o.castShadow = true
      })
      row.add(seat.group)
    }
    row.position.set(rx, FLOOR_Y, 0)
    group.add(row)
    seatRows.push(row)
  }

  /* --------------------------- furnishing: bench --------------------------- */
  const bench = new THREE.Group()
  const benchLeather = new THREE.MeshPhysicalMaterial({
    color: vipColors.base,
    roughness: 0.62,
    clearcoat: 0.12,
    clearcoatRoughness: 0.5,
  })
  const benchAccent = new THREE.MeshPhysicalMaterial({
    color: vipColors.accent,
    roughness: 0.55,
    clearcoat: 0.12,
    clearcoatRoughness: 0.5,
  })
  const benchSeatCushion = new THREE.Mesh(roundedBoxGeometry(0.52, 0.15, 1.36, 0.05, 3), benchLeather)
  benchSeatCushion.position.set(0, 0.42, 0)
  bench.add(benchSeatCushion)
  for (let i = 0; i < 3; i++) {
    const pad = new THREE.Mesh(roundedBoxGeometry(0.4, 0.045, 0.38, 0.02, 3), benchLeather)
    pad.position.set(0.02, 0.49, -0.45 + i * 0.45)
    bench.add(pad)
  }
  const benchBack = new THREE.Mesh(roundedBoxGeometry(0.14, 0.62, 1.36, 0.05, 3), benchAccent)
  benchBack.position.set(-0.24, 0.78, 0)
  benchBack.rotation.z = -0.12
  bench.add(benchBack)
  for (let i = 0; i < 3; i++) {
    const hr = new THREE.Mesh(roundedBoxGeometry(0.1, 0.17, 0.3, 0.04, 3), benchLeather)
    hr.position.set(-0.33, 1.18, -0.45 + i * 0.45)
    hr.rotation.z = -0.12
    bench.add(hr)
  }
  const benchPlinth = new THREE.Mesh(roundedBoxGeometry(0.44, 0.3, 1.28, 0.03, 3), matteMaterial(0x26262a, 0.7))
  benchPlinth.position.set(0, 0.18, 0)
  bench.add(benchPlinth)
  // NTSA-spec two-point lap belts, one per bench place
  for (let i = 0; i < 3; i++) {
    const zi = -0.45 + i * 0.45
    const lap = strapMesh(
      new THREE.Vector3(0.05, 0.535, zi - 0.165),
      new THREE.Vector3(0.05, 0.535, zi + 0.165),
      0.052,
      beltMaterial,
    )
    bench.add(lap)
    const buckle = new THREE.Mesh(roundedBoxGeometry(0.045, 0.032, 0.07, 0.012, 2), beltMaterial)
    buckle.position.set(0.055, 0.54, zi + 0.19)
    bench.add(buckle)
  }
  bench.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true
  })
  bench.position.set(-1.98, FLOOR_Y, 0)
  group.add(bench)

  /* --------------------------- furnishing: stars --------------------------- */
  const starsMaterial = new THREE.MeshBasicMaterial({
    color: 0xffc966,
    transparent: true,
    opacity: 0,
  })
  const starGeo = new THREE.SphereGeometry(0.017, 6, 6)
  const starCount = 64
  const stars = new THREE.InstancedMesh(starGeo, starsMaterial, starCount)
  const m = new THREE.Matrix4()
  let sIdx = 0
  // deterministic pseudo-random scatter, biased to the far half of the ceiling
  // so the dots read against the dark window band in the dollhouse view
  let seed = 7
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  while (sIdx < starCount) {
    const x = -2.1 + rand() * 2.9
    const z = -0.68 + rand() * rand() * 1.2
    m.setPosition(x, 2.0 - rand() * 0.06, z)
    stars.setMatrixAt(sIdx, m)
    sIdx++
  }
  group.add(stars)

  /* ------------------------------ cabin light ------------------------------ */
  const cabinLight = new THREE.PointLight(PALETTE.lightWarm, 0, 5.5, 1.6)
  cabinLight.position.set(-0.5, 1.72, 0.1)
  group.add(cabinLight)

  return {
    group,
    cutMaterials,
    floorStrips,
    wallPanels,
    seatRows,
    bench,
    stars,
    starsMaterial,
    cabinLight,
    headlights: headMat,
    taillights: tailMat,
    beltMaterial,
  }
}

export { FLOOR_Y, HALF, SIDE_Z }
