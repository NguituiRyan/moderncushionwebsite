import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { buildVan, FLOOR_Y } from './van'
import { contactShadowTexture } from './materials'

gsap.registerPlugin(ScrollTrigger)

export interface JourneyDom {
  trackEl: HTMLElement
  chapterEls: HTMLElement[]
  counterEl: HTMLElement
  railFillEl: HTMLElement
  headlineEl: HTMLElement
}

export interface VanSceneHandle {
  playIntro: () => Promise<void>
  ready: Promise<void>
}

const BG = 0xefe9df

export function initVanScene(canvas: HTMLCanvasElement, dom: JourneyDom, reducedMotion: boolean): VanSceneHandle {
  /* --------------------------------- stage --------------------------------- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setClearColor(BG, 1)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.04
  renderer.localClippingEnabled = true

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(BG, 16, 30)

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60)
  const camTarget = new THREE.Vector3(-1.85, 0.84, 0)
  const HERO_CAM = { x: 6.8, y: 2.35, z: 9.2 }
  camera.position.set(HERO_CAM.x, HERO_CAM.y, HERO_CAM.z)

  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()

  /* --------------------------------- lights -------------------------------- */
  const key = new THREE.DirectionalLight(0xfff2e0, 2.35)
  key.position.set(4.5, 6.5, 5.5)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  key.shadow.camera.left = -6
  key.shadow.camera.right = 6
  key.shadow.camera.top = 6
  key.shadow.camera.bottom = -4
  key.shadow.camera.far = 24
  key.shadow.bias = -0.0004
  key.shadow.normalBias = 0.02
  scene.add(key)

  const hemi = new THREE.HemisphereLight(0xf4efe4, 0x8a7a63, 0.55)
  scene.add(hemi)

  const rim = new THREE.DirectionalLight(0xdfe8f0, 1.0)
  rim.position.set(-5, 3.5, -6)
  scene.add(rim)

  const interiorFill = new THREE.PointLight(0xffe9cf, 0.5, 6, 1.8)
  interiorFill.position.set(0, 1.6, 0.4)
  scene.add(interiorFill)

  /* --------------------------------- ground -------------------------------- */
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.ShadowMaterial({ opacity: 0.16, color: 0x241d12 }),
  )
  shadowPlane.rotation.x = -Math.PI / 2
  shadowPlane.receiveShadow = true
  scene.add(shadowPlane)

  const contactMat = new THREE.MeshBasicMaterial({
    map: contactShadowTexture(),
    transparent: true,
    depthWrite: false,
    opacity: 0,
  })
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(8.2, 3.6), contactMat)
  contact.rotation.x = -Math.PI / 2
  contact.position.y = 0.004
  scene.add(contact)

  /* ---------------------------------- van ---------------------------------- */
  const van = buildVan()
  scene.add(van.group)
  van.group.rotation.y = -0.52

  // cutaway plane: keeps z <= constant
  const cutPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 2.6)
  const cut = { c: 2.6 }
  for (const mat of van.cutMaterials) {
    mat.clippingPlanes = [cutPlane]
    mat.clipShadows = true
  }

  /* --------------------------- furnishing defaults -------------------------- */
  for (const strip of van.floorStrips) {
    const mat = strip.material as THREE.Material & { opacity: number }
    mat.transparent = true
    mat.opacity = 0
    strip.userData.homeY = strip.position.y
    strip.position.y += 0.4
  }
  for (const panel of van.wallPanels) {
    const mesh = panel as THREE.Mesh
    const mat = mesh.material as THREE.Material & { opacity: number }
    mat.transparent = true
    mat.opacity = 0
    panel.userData.homeScale = 1
    panel.scale.setScalar(0.85)
  }
  for (const row of van.seatRows) {
    row.visible = false
    row.userData.homeZ = row.position.z
    row.position.z += 1.7
    row.position.y += 0.05
  }
  van.bench.visible = false
  van.bench.userData.homeZ = van.bench.position.z
  van.bench.position.z += 1.7
  van.stars.visible = false

  /* ------------------------------ journey DOM ------------------------------ */
  const { chapterEls, counterEl, railFillEl, headlineEl } = dom
  for (const el of chapterEls) {
    gsap.set(el, { autoAlpha: 0, y: 34 })
  }

  /* ------------------------------- timeline -------------------------------- */
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: dom.trackEl,
      start: 'top top',
      end: 'bottom bottom',
      scrub: reducedMotion ? true : 0.9,
      onUpdate: (self) => {
        const p = self.progress
        railFillEl.style.transform = `scaleY(${p})`
        const idx = Math.min(4, Math.max(0, Math.floor(p * 5)))
        const label = String(idx + 1).padStart(2, '0')
        if (counterEl.textContent !== label) counterEl.textContent = label
      },
    },
  })

  const chapterIn = (el: HTMLElement, at: number, dur = 3.4) => {
    tl.to(el, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power2.out' }, at)
    tl.to(el, { autoAlpha: 0, y: -26, duration: 1.0, ease: 'power2.in' }, at + dur)
  }

  // -- segment 1 · 0-14 : swing to side view, open the cut
  // camTarget.x sits ~0.9 ahead of centre so the van hugs the left 2/3 of frame,
  // clearing room for the chapter cards on the right
  tl.to(camera.position, { x: 1.35, y: 1.9, z: 9.0, duration: 10, ease: 'power2.inOut' }, 0)
  tl.to(camTarget, { x: 1.3, y: 1.0, z: 0, duration: 10, ease: 'power2.inOut' }, 0)
  tl.to(van.group.rotation, { y: 0, duration: 10, ease: 'power2.inOut' }, 0)
  tl.to(headlineEl, { autoAlpha: 0, y: -20, duration: 3 }, 0.5)
  tl.to(cut, {
    c: 0.62,
    duration: 6,
    ease: 'power2.inOut',
    onUpdate: () => {
      cutPlane.constant = cut.c
    },
  }, 6)
  chapterIn(chapterEls[0], 1.5, 9)

  // -- segment 2 · 14-30 : floor strips
  tl.to(camera.position, { x: 0.5, y: 1.72, z: 8.2, duration: 12, ease: 'sine.inOut' }, 15)
  tl.to(camTarget, { x: 0.42, y: 0.88, z: 0, duration: 12, ease: 'sine.inOut' }, 15)
  van.floorStrips.forEach((strip, i) => {
    const at = 15.5 + i * 1.15
    tl.to(strip.position, { y: strip.userData.homeY, duration: 2.2, ease: 'power3.out' }, at)
    tl.to(strip.material as THREE.Material, { opacity: 1, duration: 1.4, ease: 'power1.out' }, at)
  })
  chapterIn(chapterEls[1], 16, 11)

  // -- segment 3 · 30-56 : wall panels, then seats slide in through the open side
  van.wallPanels.forEach((panel, i) => {
    const at = 30 + i * 0.9
    tl.to(panel.scale, { x: 1, y: 1, z: 1, duration: 2.0, ease: 'power3.out' }, at)
    tl.to((panel as THREE.Mesh).material as THREE.Material, { opacity: 1, duration: 1.6 }, at)
  })
  tl.to(camera.position, { x: 1.42, y: 1.95, z: 8.1, duration: 20, ease: 'sine.inOut' }, 34)
  tl.to(camTarget, { x: 1.3, y: 0.98, z: 0, duration: 20, ease: 'sine.inOut' }, 34)
  const rowsRearFirst = [...van.seatRows].reverse()
  rowsRearFirst.forEach((row, i) => {
    const at = 37 + i * 4.2
    tl.set(row, { visible: true }, at)
    tl.to(row.position, { z: row.userData.homeZ, duration: 3.6, ease: 'power3.out' }, at)
    tl.to(row.position, { y: FLOOR_Y, duration: 1.2, ease: 'bounce.out' }, at + 2.6)
  })
  tl.set(van.bench, { visible: true }, 50)
  tl.to(van.bench.position, { z: van.bench.userData.homeZ, duration: 3.6, ease: 'power3.out' }, 50)
  chapterIn(chapterEls[2], 33, 20)

  // -- segment 4 · 56-74 : belts on, starlit roof + warm light
  tl.to(van.beltMaterial, { opacity: 1, duration: 5.5, ease: 'power2.out' }, 57.5)
  tl.set(van.stars, { visible: true }, 57)
  tl.to(van.starsMaterial, { opacity: 0.95, duration: 5, ease: 'power1.in' }, 57)
  tl.to(van.cabinLight, { intensity: 4.2, duration: 6, ease: 'power2.in' }, 58)
  tl.to(key, { intensity: 1.95, duration: 8, ease: 'sine.inOut' }, 57)
  tl.to(hemi, { intensity: 0.42, duration: 8, ease: 'sine.inOut' }, 57)
  tl.to(camera.position, { x: 1.05, y: 1.78, z: 7.0, duration: 12, ease: 'sine.inOut' }, 57)
  tl.to(camTarget, { x: 0.92, y: 1.2, z: 0, duration: 12, ease: 'sine.inOut' }, 57)
  chapterIn(chapterEls[3], 58, 12)

  // -- segment 5 · 74-100 : close up, pull back, roll-out stance
  tl.to(cut, {
    c: 2.6,
    duration: 7,
    ease: 'power2.inOut',
    onUpdate: () => {
      cutPlane.constant = cut.c
    },
  }, 75)
  tl.to(key, { intensity: 2.35, duration: 8, ease: 'sine.inOut' }, 76)
  tl.to(hemi, { intensity: 0.55, duration: 8, ease: 'sine.inOut' }, 76)
  tl.to(camera.position, { x: -5.9, y: 2.15, z: 7.1, duration: 18, ease: 'power2.inOut' }, 78)
  tl.to(camTarget, { x: 0, y: 1.0, z: 0, duration: 18, ease: 'power2.inOut' }, 78)
  tl.to(van.group.rotation, { y: 0.38, duration: 18, ease: 'power2.inOut' }, 78)
  tl.to(van.headlights, { emissiveIntensity: 1.5, duration: 6, ease: 'power2.in' }, 86)
  tl.to(van.taillights, { emissiveIntensity: 1.1, duration: 6, ease: 'power2.in' }, 86)
  chapterIn(chapterEls[4], 80, 14)
  tl.to({}, { duration: 2 }, 98) // tail padding

  /* ------------------------------ render loop ------------------------------ */
  let active = true
  let idleT = 0
  const journeyST = ScrollTrigger.create({
    trigger: dom.trackEl,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: () => updateActive(),
  })

  function updateActive() {
    const heroVisible = window.scrollY < window.innerHeight * 1.2
    active = heroVisible || journeyST.isActive
  }
  window.addEventListener('scroll', () => updateActive(), { passive: true })

  let introDone = false
  /* -------------------------- viewport-aware framing ------------------------
   * Chapter camera targets pan the van left to clear the desktop chapter
   * cards. On phones the cards sit at the bottom instead, so we re-centre the
   * van every frame with a view offset scaled to the current camera distance,
   * and zoom out so the full length fits the narrow frame. Squarer laptop
   * windows get a gentler zoom-out and lift so the van clears the hero copy. */
  const applyFraming = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    if (w < 760) {
      const dist = camera.position.distanceTo(camTarget)
      const heightM = (2 * dist * Math.tan((camera.fov * Math.PI) / 360)) / camera.zoom
      const pxPerM = h / heightM
      camera.setViewOffset(w, h, -camTarget.x * pxPerM * 0.9, h * 0.13, w, h)
      return
    }
    const aspect = w / h
    if (aspect < 1.5) camera.setViewOffset(w, h, 0, h * 0.085, w, h)
    else if (camera.view) camera.clearViewOffset()
  }

  gsap.ticker.add((_t, dt) => {
    if (!active) return
    idleT += dt / 1000
    if (introDone && !reducedMotion) {
      const journeyP = tl.scrollTrigger ? tl.scrollTrigger.progress : 0
      const amp = Math.max(0, 1 - journeyP * 10)
      camera.position.y += Math.sin(idleT * 0.55) * 0.0009 * amp
      camera.position.x += Math.cos(idleT * 0.4) * 0.0006 * amp
    }
    if (window.innerWidth < 760) applyFraming()
    camera.lookAt(camTarget)
    renderer.render(scene, camera)
  })

  /* --------------------------------- resize -------------------------------- */
  const resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    const aspect = w / h
    renderer.setSize(w, h, false)
    camera.aspect = aspect
    camera.fov = w < 760 ? 50 : w < 1100 ? 37 : 32
    // squarer viewports zoom out so the van never crowds the copy
    camera.zoom = w < 760 ? 0.7 : Math.min(1, Math.max(0.62, 0.6 + (aspect - 1.0) * 0.5))
    camera.updateProjectionMatrix()
    applyFraming()
  }
  resize()
  window.addEventListener('resize', resize)

  /* ---------------------------------- intro -------------------------------- */
  const introStartY = 0.42
  if (!reducedMotion) {
    van.group.position.y = introStartY
    camera.position.set(9.6, 3.1, 10.9)
  } else {
    contactMat.opacity = 0.95
  }

  const playIntro = (): Promise<void> =>
    new Promise((resolve) => {
      introDone = true
      if (reducedMotion) {
        resolve()
        return
      }
      const intro = gsap.timeline({ onComplete: () => resolve() })
      intro.to(van.group.position, { y: 0, duration: 1.5, ease: 'elastic.out(0.55, 0.32)' }, 0.1)
      intro.to(contactMat, { opacity: 0.95, duration: 1.2, ease: 'power2.out' }, 0.1)
      intro.to(camera.position, { ...HERO_CAM, duration: 2.2, ease: 'power3.out' }, 0)
    })

  // first frame so the preloader lifts onto a live scene
  camera.lookAt(camTarget)
  renderer.render(scene, camera)

  return { playIntro, ready: Promise.resolve() }
}
