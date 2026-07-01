import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { buildSeat } from './seat'
import type { Fabric } from '../data/content'

gsap.registerPlugin(ScrollTrigger)

export interface CalloutDom {
  el: HTMLElement
  anchor: 'frame' | 'foam' | 'cover' | 'headrest'
}

export interface CraftDom {
  trackEl: HTMLElement
  stageEl: HTMLElement
  headEl: HTMLElement
  callouts: CalloutDom[]
  fabricsEl: HTMLElement
  phaseEls: HTMLElement[]
}

export interface SeatSceneHandle {
  setFabric: (fabric: Fabric) => void
}

const BG = 0x121009

export function initSeatScene(canvas: HTMLCanvasElement, dom: CraftDom, reducedMotion: boolean): SeatSceneHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setClearColor(BG, 1)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.95

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(BG, 0.075)

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40)
  const camTarget = new THREE.Vector3(0, 0.68, 0)
  camera.position.set(0.05, 0.9, 3.3)

  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()

  /* --------------------------------- lights -------------------------------- */
  const spot = new THREE.SpotLight(0xffe4bd, 19, 0, 0.55, 0.7, 1.6)
  spot.position.set(2.3, 3.6, 2.6)
  spot.castShadow = true
  spot.shadow.mapSize.set(1024, 1024)
  spot.shadow.bias = -0.0003
  scene.add(spot)

  const rim = new THREE.DirectionalLight(0xcfd8e8, 1.1)
  rim.position.set(-3.2, 2.4, -2.6)
  scene.add(rim)

  const fill = new THREE.PointLight(0xffd9a0, 2.2, 8, 2)
  fill.position.set(-1.8, 1.1, 2.4)
  scene.add(fill)

  /* ---------------------------------- dais ---------------------------------- */
  const dais = new THREE.Mesh(
    new THREE.CylinderGeometry(0.98, 1.04, 0.07, 64),
    new THREE.MeshStandardMaterial({ color: 0x120e07, roughness: 0.88, metalness: 0.02 }),
  )
  dais.position.y = -0.04
  dais.receiveShadow = true
  scene.add(dais)
  const under = new THREE.Mesh(
    new THREE.CylinderGeometry(1.04, 1.12, 0.05, 64),
    new THREE.MeshStandardMaterial({ color: 0x0a0805, roughness: 0.95 }),
  )
  under.position.y = -0.095
  scene.add(under)

  /* ---------------------------------- seat ---------------------------------- */
  const seat = buildSeat('hero', { base: '#262320', accent: '#171512', stitch: '#c2703c' })
  seat.group.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  seat.group.rotation.y = -0.35
  scene.add(seat.group)

  type Movable = { obj: THREE.Object3D; home: THREE.Vector3; out: THREE.Vector3 }
  const mov = (obj: THREE.Object3D, dx: number, dy: number, dz: number): Movable => ({
    obj,
    home: obj.position.clone(),
    out: obj.position.clone().add(new THREE.Vector3(dx, dy, dz)),
  })
  // exploded mostly along Y — reads like a technical diagram
  const movables: Movable[] = [
    mov(seat.headrest, 0, 0.74, -0.04),
    mov(seat.coverBack, 0, 0.52, -0.14),
    mov(seat.coverSeat, 0, 0.46, 0.1),
    mov(seat.foamBack, 0, 0.26, -0.08),
    mov(seat.foamSeat, 0, 0.24, 0.04),
    mov(seat.armL, -0.44, 0.08, 0),
    mov(seat.armR, 0.44, 0.08, 0),
    mov(seat.base, 0, -0.16, 0),
  ]

  /* -------------------------------- timeline -------------------------------- */
  for (const c of dom.callouts) gsap.set(c.el, { autoAlpha: 0 })
  gsap.set(dom.fabricsEl, { autoAlpha: 0 })

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: dom.trackEl,
      start: 'top top',
      end: 'bottom bottom',
      scrub: reducedMotion ? true : 0.85,
      onUpdate: (self) => {
        const p = self.progress
        const phase = p < 0.2 ? 0 : p < 0.48 ? 1 : p < 0.72 ? 2 : 3
        dom.phaseEls.forEach((el, i) => el.classList.toggle('is-on', i === phase))
        dom.fabricsEl.classList.toggle('is-live', phase === 3)
      },
    },
  })

  // phase 0 · 0-20 — turntable
  tl.to(seat.group.rotation, { y: 0.5, duration: 20, ease: 'sine.inOut' }, 0)
  tl.to(camera.position, { z: 3.16, duration: 20, ease: 'sine.inOut' }, 0)

  // phase 1 · 20-48 — explode + callouts
  tl.to(dom.headEl, { autoAlpha: 0, y: -24, duration: 4, ease: 'power2.in' }, 20)
  tl.to(seat.group.rotation, { y: 1.12, duration: 26, ease: 'sine.inOut' }, 20)
  tl.to(camera.position, { x: 0.2, y: 1.32, z: 4.75, duration: 12, ease: 'power2.inOut' }, 21)
  tl.to(camTarget, { y: 0.98, duration: 12, ease: 'power2.inOut' }, 21)
  movables.forEach((mv, i) => {
    tl.to(mv.obj.position, { x: mv.out.x, y: mv.out.y, z: mv.out.z, duration: 9, ease: 'power2.inOut' }, 22 + i * 0.5)
  })
  const calloutTimes = [30, 33, 36, 39]
  dom.callouts.forEach((c, i) => {
    tl.to(c.el, { autoAlpha: 1, duration: 2, ease: 'power2.out' }, calloutTimes[i] ?? 30)
    tl.to(c.el, { autoAlpha: 0, duration: 2, ease: 'power2.in' }, 45)
  })

  // phase 2 · 48-72 — reassemble
  movables.forEach((mv, i) => {
    tl.to(mv.obj.position, { x: mv.home.x, y: mv.home.y, z: mv.home.z, duration: 10, ease: 'power3.inOut' }, 49 + i * 0.4)
  })
  tl.to(seat.group.rotation, { y: Math.PI * 2 - 0.3, duration: 24, ease: 'sine.inOut' }, 48)
  tl.to(camera.position, { x: 0.05, y: 0.92, z: 3.3, duration: 14, ease: 'power2.inOut' }, 52)
  tl.to(camTarget, { y: 0.68, duration: 14, ease: 'power2.inOut' }, 52)

  // phase 3 · 72-100 — fabric bar
  tl.to(dom.fabricsEl, { autoAlpha: 1, duration: 4, ease: 'power2.out' }, 74)
  tl.to(seat.group.rotation, { y: Math.PI * 2 + 0.42, duration: 26, ease: 'sine.inOut' }, 74)
  tl.to(camera.position, { x: 0.5, y: 0.98, z: 3.5, duration: 16, ease: 'sine.inOut' }, 74)
  tl.to(camTarget, { y: 0.74, duration: 16, ease: 'sine.inOut' }, 74)

  /* ----------------------------- callout tracking --------------------------- */
  const proj = new THREE.Vector3()
  function placeCallouts() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    for (const c of dom.callouts) {
      const a = seat.anchors[c.anchor]
      if (!a) continue
      a.getWorldPosition(proj)
      proj.project(camera)
      const x = (proj.x * 0.5 + 0.5) * w
      const y = (-proj.y * 0.5 + 0.5) * h
      c.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
    }
  }

  /* -------------------------------- rendering ------------------------------- */
  let active = false
  ScrollTrigger.create({
    trigger: dom.trackEl,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      active = self.isActive
    },
  })

  gsap.ticker.add(() => {
    if (!active) return
    camera.lookAt(camTarget)
    placeCallouts()
    renderer.render(scene, camera)
  })

  const resize = () => {
    const w = dom.stageEl.clientWidth
    const h = dom.stageEl.clientHeight
    if (w === 0 || h === 0) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.fov = w < 760 ? 38 : 30
    camera.updateProjectionMatrix()
  }
  resize()
  new ResizeObserver(resize).observe(dom.stageEl)

  /* --------------------------------- fabrics -------------------------------- */
  const setFabric = (fabric: Fabric) => {
    const targets = [
      { mats: seat.leatherMats, hex: fabric.base },
      { mats: seat.accentMats, hex: fabric.accent },
    ]
    for (const t of targets) {
      const col = new THREE.Color(t.hex)
      for (const m of t.mats) {
        gsap.to(m.color, { r: col.r, g: col.g, b: col.b, duration: 0.7, ease: 'power2.out' })
      }
    }
    const stitchCol = new THREE.Color(fabric.stitch)
    for (const m of seat.stitchMats) {
      const mat = m as THREE.MeshStandardMaterial
      gsap.to(mat.color, { r: stitchCol.r, g: stitchCol.g, b: stitchCol.b, duration: 0.7, ease: 'power2.out' })
    }
  }

  renderer.render(scene, camera)
  return { setFabric }
}
