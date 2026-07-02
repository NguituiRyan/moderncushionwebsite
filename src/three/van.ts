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

  // H200 Hiace silhouette: stub hood, steep windshield, low cab roof stepping
  // up into the tall high-roof cabin — the commuter's signature profile
  const s = new THREE.Shape()
  s.moveTo(2.32, 0.34)
  s.lineTo(1.99, 0.34)
  s.absarc(1.57, 0.34, 0.42, 0, Math.PI, false)
  s.lineTo(-1.03, 0.34)
  s.absarc(-1.45, 0.34, 0.42, 0, Math.PI, false)
  s.lineTo(-2.32, 0.34)
  s.quadraticCurveTo(-2.35, 0.36, -2.35, 0.6)
  s.lineTo(-2.35, 1.86)
  s.quadraticCurveTo(-2.35, 2.15, -2.04, 2.17)
  s.lineTo(0.52, 2.17)
  s.quadraticCurveTo(0.78, 2.16, 0.95, 2.07)
  s.lineTo(1.2, 1.96)
  s.quadraticCurveTo(1.42, 1.9, 1.54, 1.84)
  s.lineTo(2.02, 1.06)
  s.quadraticCurveTo(2.12, 1.0, 2.24, 0.98)
  s.lineTo(2.31, 0.97)
  s.quadraticCurveTo(2.35, 0.96, 2.35, 0.88)
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

  // arbitrary filleted polygon → extruded panel, mirrored to both sides
  const filletShape = (pts: Array<[number, number]>, r: number) => {
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
  const panelGeo = (pts: Array<[number, number]>, r: number) =>
    new THREE.ExtrudeGeometry(filletShape(pts, r), {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 2,
      curveSegments: 6,
    })
  const bothSides = (geo: THREE.ExtrudeGeometry, mat: THREE.Material, offset: number) => {
    for (const sz of [1, -1]) {
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(0, 0, sz * offset - 0.01)
      group.add(mesh)
    }
  }

  // one continuous dark glasshouse band behind the rear glazing — reads like
  // the Hiace's blacked-out window strip with slim hidden pillars
  const bandMat = matteMaterial(0x1b1c1a, 0.5)
  cutMaterials.push(bandMat)
  for (const sz of [1, -1]) {
    const band = new THREE.Mesh(roundedBoxGeometry(3.56, 0.66, 0.02, 0.06, 3), bandMat)
    band.position.set(-0.49, 1.47, sz * (SIDE_Z - 0.002))
    group.add(band)
  }
  const paneGeoCache = new Map<string, THREE.ExtrudeGeometry>()
  const bandPane = (x0: number, x1: number) => {
    const key = `${x0}:${x1}`
    if (!paneGeoCache.has(key))
      paneGeoCache.set(
        key,
        panelGeo(
          [
            [x0, 1.16],
            [x1, 1.16],
            [x1, 1.78],
            [x0, 1.78],
          ],
          0.045,
        ),
      )
    bothSides(paneGeoCache.get(key)!, glass, SIDE_Z + 0.008)
  }
  bandPane(0.3, 1.18) // sliding door
  bandPane(-0.68, 0.18) // mid
  bandPane(-1.62, -0.8) // rear quarter
  bandPane(-2.22, -1.74) // rearmost

  // front door glass: trapezoid tucked under the raked A-pillar,
  // plus the H200's little triangular quarter light at the mirror base
  const doorGlassGeo = panelGeo(
    [
      [1.34, 1.16],
      [1.75, 1.16],
      [1.75, 1.4],
      [1.53, 1.78],
      [1.34, 1.78],
    ],
    0.045,
  )
  const doorFrameGeo = panelGeo(
    [
      [1.31, 1.13],
      [1.78, 1.13],
      [1.78, 1.39],
      [1.56, 1.81],
      [1.31, 1.81],
    ],
    0.05,
  )
  const quarterGeo = panelGeo(
    [
      [1.8, 1.16],
      [1.94, 1.16],
      [1.8, 1.4],
    ],
    0.025,
  )
  const quarterFrameGeo = panelGeo(
    [
      [1.77, 1.13],
      [1.975, 1.13],
      [1.77, 1.46],
    ],
    0.03,
  )
  bothSides(doorFrameGeo, frameMat, SIDE_Z - 0.002)
  bothSides(doorGlassGeo, glass, SIDE_Z + 0.008)
  bothSides(quarterFrameGeo, frameMat, SIDE_Z - 0.002)
  bothSides(quarterGeo, glass, SIDE_Z + 0.008)
  const rearGlassPane = new THREE.Mesh(roundedBoxGeometry(1.34, 0.72, 0.02, 0.06, 3), glass)
  rearGlassPane.rotation.y = -Math.PI / 2
  rearGlassPane.position.set(-2.445, 1.56, 0)
  group.add(rearGlassPane)

  // windshield — raked panel matching the profile line
  const rakeBottom = new THREE.Vector3(2.02, 1.1, 0)
  const rakeTop = new THREE.Vector3(1.57, 1.82, 0)
  const rakeDir = rakeTop.clone().sub(rakeBottom).normalize()
  const across = new THREE.Vector3(0, 0, 1)
  const normal = new THREE.Vector3().crossVectors(rakeDir, across) // outward (+x-ish)
  // steeper Hiace rake mirrors the bright environment head-on — use a calmer,
  // rougher glass so it reads as dark tint instead of blank white
  const shieldGlass = glassMaterial()
  shieldGlass.roughness = 0.22
  shieldGlass.envMapIntensity = 0.55
  shieldGlass.color.set(0x20272b)
  cutMaterials.push(shieldGlass)
  const shieldH = rakeBottom.distanceTo(rakeTop) - 0.06
  const shield = new THREE.Mesh(roundedBoxGeometry(1.52, shieldH, 0.02, 0.05, 3), shieldGlass)
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
  // two-tier Hiace bumper: black apron with plate recess and low intake slot
  const frontBumper = new THREE.Mesh(roundedBoxGeometry(0.24, 0.42, 1.86, 0.06, 3), darkTrim)
  frontBumper.position.set(2.34, 0.42, 0)
  group.add(frontBumper)
  const intakeMat = matteMaterial(0x141412, 0.9)
  cutMaterials.push(intakeMat)
  const plate = new THREE.Mesh(roundedBoxGeometry(0.05, 0.15, 0.52, 0.03, 2), intakeMat)
  plate.position.set(2.45, 0.5, 0)
  group.add(plate)
  const intake = new THREE.Mesh(roundedBoxGeometry(0.05, 0.09, 1.12, 0.04, 3), intakeMat)
  intake.position.set(2.45, 0.28, 0)
  group.add(intake)
  const fogMat = matteMaterial(0x17181a, 0.4)
  cutMaterials.push(fogMat)
  for (const sz of [-0.72, 0.72]) {
    const fog = new THREE.Mesh(roundedBoxGeometry(0.05, 0.1, 0.18, 0.035, 2), fogMat)
    fog.position.set(2.43, 0.5, sz)
    group.add(fog)
  }
  const rearBumper = new THREE.Mesh(roundedBoxGeometry(0.16, 0.2, 1.78, 0.06, 3), darkTrim)
  rearBumper.position.set(-2.39, 0.44, 0)
  group.add(rearBumper)

  // slim chrome twin-slat grille in a shallow recess between the headlights
  const grilleRecess = new THREE.Mesh(roundedBoxGeometry(0.05, 0.13, 0.74, 0.04, 3), matteMaterial(0xb2ac9f, 0.55))
  grilleRecess.position.set(2.42, 0.96, 0)
  group.add(grilleRecess)
  const slatMat = steelMaterial(PALETTE.chrome)
  cutMaterials.push(slatMat, grilleRecess.material as THREE.Material)
  for (const gy of [0.93, 0.985]) {
    const slat = new THREE.Mesh(roundedBoxGeometry(0.05, 0.02, 0.7, 0.01, 2), slatMat)
    slat.position.set(2.44, gy, 0)
    group.add(slat)
  }

  const headMat = new THREE.MeshStandardMaterial({
    color: 0xc9ced1,
    roughness: 0.15,
    metalness: 0.3,
    emissive: 0xfff3d6,
    emissiveIntensity: 0.12,
  })
  const lampTrimMat = matteMaterial(0xa8a297, 0.6)
  cutMaterials.push(headMat, lampTrimMat)
  // big swept headlamps wrapping the nose corners
  for (const sz of [-1, 1]) {
    const backing = new THREE.Mesh(roundedBoxGeometry(0.07, 0.19, 0.54, 0.05, 3), lampTrimMat)
    backing.position.set(2.43, 0.95, sz * 0.64)
    backing.rotation.y = sz * -0.12
    group.add(backing)
    const lamp = new THREE.Mesh(roundedBoxGeometry(0.09, 0.16, 0.5, 0.05, 3), headMat)
    lamp.position.set(2.445, 0.95, sz * 0.64)
    lamp.rotation.y = sz * -0.12
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
    const lamp = new THREE.Mesh(roundedBoxGeometry(0.06, 0.52, 0.1, 0.035, 3), tailMat)
    lamp.position.set(-2.44, 1.06, sz)
    group.add(lamp)
  }

  // big door mirrors on arms, Hiace-style
  const mirrorMat = matteMaterial(0x1d1e1c, 0.5)
  cutMaterials.push(mirrorMat)
  for (const sz of [1, -1]) {
    const mirror = new THREE.Mesh(roundedBoxGeometry(0.07, 0.2, 0.11, 0.035, 3), mirrorMat)
    mirror.position.set(1.9, 1.4, sz * (SIDE_Z + 0.15))
    mirror.rotation.y = sz * 0.12
    group.add(mirror)
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.2, 8), mirrorMat)
    arm.rotation.x = Math.PI / 2
    arm.rotation.z = sz * 0.25
    arm.position.set(1.92, 1.47, sz * (SIDE_Z + 0.06))
    group.add(arm)
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
  // silver steel wheels with vent holes, like the commuter-spec Hiace
  const tyreMat = matteMaterial(PALETTE.rubber, 0.92)
  const hubMat = steelMaterial(0xaeb1b4)
  const ventMat = matteMaterial(0x232527, 0.7)
  const capMat = steelMaterial(PALETTE.chrome)
  cutMaterials.push(tyreMat, hubMat, ventMat, capMat)
  const tyreGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.24, 28)
  const hubGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.245, 24)
  const ventGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.252, 10)
  const capGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.256, 16)
  for (const wx of [1.57, -1.45]) {
    for (const sz of [1, -1]) {
      const wheel = new THREE.Group()
      const tyre = new THREE.Mesh(tyreGeo, tyreMat)
      tyre.castShadow = true
      wheel.add(tyre)
      wheel.add(new THREE.Mesh(hubGeo, hubMat))
      for (let v = 0; v < 6; v++) {
        const a = (v / 6) * Math.PI * 2
        const vent = new THREE.Mesh(ventGeo, ventMat)
        vent.position.set(Math.cos(a) * 0.105, 0, Math.sin(a) * 0.105)
        wheel.add(vent)
      }
      wheel.add(new THREE.Mesh(capGeo, capMat))
      wheel.rotation.x = Math.PI / 2
      wheel.position.set(wx, 0.33, sz * 0.76)
      group.add(wheel)
    }
  }

  /* ----------------------------- side details ------------------------------ */
  const railMat = matteMaterial(0x38362f, 0.6)
  const moldMat = matteMaterial(0xb3ac9c, 0.55)
  cutMaterials.push(railMat, moldMat)
  for (const sz of [1, -1]) {
    // sliding-door track groove along the rear half
    const rail = new THREE.Mesh(roundedBoxGeometry(2.5, 0.03, 0.015, 0.007, 2), railMat)
    rail.position.set(-0.9, 1.12, sz * (SIDE_Z + 0.004))
    group.add(rail)
    // lower body moulding
    const mold = new THREE.Mesh(roundedBoxGeometry(4.3, 0.05, 0.018, 0.008, 2), moldMat)
    mold.position.set(-0.05, 0.56, sz * (SIDE_Z + 0.004))
    group.add(mold)
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
  const dash = new THREE.Mesh(roundedBoxGeometry(0.34, 0.22, 1.5, 0.06, 3), cabMat)
  dash.position.set(1.82, 0.97, 0)
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
    strip.position.set(-0.65, 2.06, zz)
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
    const x = -2.1 + rand() * 2.8
    const z = -0.68 + rand() * rand() * 1.2
    m.setPosition(x, 2.07 - rand() * 0.06, z)
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
