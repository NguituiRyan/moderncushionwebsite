import './styles/base.css'
import './styles/sections.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import {
  CONTACT,
  waLink,
  SEATS,
  GALLERY,
  PROCESS,
  TESTIMONIALS,
  FAQS,
  FABRICS,
  CHAPTERS,
  STATS,
  CALLOUTS,
  MARQUEE_ITEMS,
} from './data/content'
import { initVanScene } from './three/vanScene'
import { initSeatScene, type CalloutDom } from './three/seatScene'

gsap.registerPlugin(ScrollTrigger)

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (reducedMotion) document.documentElement.classList.add('reduced-motion')
document.body.classList.add('is-loading')

const $ = <T extends HTMLElement = HTMLElement>(sel: string): T => {
  const el = document.querySelector<T>(sel)
  if (!el) throw new Error(`missing element: ${sel}`)
  return el
}

const fmtKES = (n: number) => `KES ${n.toLocaleString('en-KE')}`

/* ------------------------------------------------------------------------- */
/*  Static DOM hydration                                                      */
/* ------------------------------------------------------------------------- */

function hydrateQuoteLinks() {
  const generic = waLink("Hello Modern Cushions! I'd like a quote for my vehicle.")
  for (const id of ['nav-quote', 'hero-quote', 'contact-quote', 'mobile-quote']) {
    const el = document.getElementById(id) as HTMLAnchorElement | null
    if (el) el.href = generic
  }
  $('#footer-year').textContent = String(new Date().getFullYear())
  $('#contact-phones').innerHTML = CONTACT.phones
    .map((p) => `<a href="tel:${p.replace(/\s/g, '')}" data-cursor>${p}</a>`)
    .join('<br />')
}

function renderChapters() {
  const wrap = $('#journey-chapters')
  wrap.innerHTML = CHAPTERS.map(
    (c) => `
    <article class="journey__chapter">
      <p class="journey__chapter-num">${c.num} — Chapter</p>
      <h3 class="journey__chapter-title">${c.title}</h3>
      <p class="journey__chapter-body">${c.body}</p>
    </article>`,
  ).join('')
}

function renderMarquee() {
  const row = $('#marquee-row')
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  row.innerHTML = items.map((t) => `<span class="marquee__item">${t}<i></i></span>`).join('')
}

function renderCollection() {
  const rail = $('#collection-rail')
  rail.innerHTML = SEATS.map((s) => {
    const msg = waLink(`Hello! I'm interested in the ${s.name} seat (${fmtKES(s.price)}). My vehicle is a `)
    return `
    <article class="seat-card" data-card>
      <div class="seat-card__media">
        <img src="/assets/photos/${s.image}.jpg" alt="${s.name} — built by Modern Cushions" loading="lazy" draggable="false" />
        <span class="seat-card__tag">${s.tag}</span>
      </div>
      <div class="seat-card__body">
        <h3 class="seat-card__name">${s.name}</h3>
        <p class="seat-card__price"><strong>${fmtKES(s.price)}</strong> per row, fitted</p>
        <p class="seat-card__blurb">${s.blurb}</p>
        <ul class="seat-card__features">${s.features.map((f) => `<li>${f}</li>`).join('')}</ul>
        <a class="seat-card__cta" href="${msg}" target="_blank" rel="noopener" data-cursor="Quote">Quote this seat <span aria-hidden="true">→</span></a>
      </div>
    </article>`
  }).join('')
}

function renderWork() {
  const grid = $('#work-grid')
  grid.innerHTML = GALLERY.map(
    (g) => `
    <figure class="work-item work-item--${g.size}" data-work>
      <div class="work-item__media">
        <img src="/assets/photos/${g.image}.jpg" alt="${g.caption} — ${g.detail}" loading="lazy" />
      </div>
      <figcaption class="work-item__label">
        <strong>${g.caption}</strong>
        <span>${g.detail}</span>
      </figcaption>
    </figure>`,
  ).join('')
}

function renderStats() {
  $('#stats-row').innerHTML = STATS.map(
    (s) => `<div class="stat" data-reveal><strong>${s.value}</strong><span>${s.label}</span></div>`,
  ).join('')
}

function renderProcess() {
  $('#process-list').innerHTML = PROCESS.map(
    (p) => `
    <li class="process-step" data-reveal>
      <span class="process-step__num">${p.num}</span>
      <h3 class="process-step__title">${p.title}</h3>
      <p class="process-step__desc">${p.desc}</p>
    </li>`,
  ).join('')
}

function renderVoices() {
  $('#voices-list').innerHTML = TESTIMONIALS.map(
    (t) => `
    <blockquote class="voice" data-reveal>
      <p class="voice__quote">${t.quote}</p>
      <footer class="voice__meta">
        <div class="voice__who"><strong>${t.name}</strong><span>${t.title}</span></div>
        <span class="voice__cat">${t.category}</span>
      </footer>
    </blockquote>`,
  ).join('')
}

function renderFaq() {
  $('#faq-list').innerHTML = FAQS.map(
    (f, i) => `
    <div class="faq-item" data-faq>
      <button class="faq-item__q" aria-expanded="false" aria-controls="faq-a-${i}">
        <span>${f.q}</span>
        <span class="faq-item__icon" aria-hidden="true"></span>
      </button>
      <div class="faq-item__a" id="faq-a-${i}" role="region">
        <div class="faq-item__a-inner"><p>${f.a}</p></div>
      </div>
    </div>`,
  ).join('')
}

function renderCraftDom() {
  const calloutsWrap = $('#craft-callouts')
  calloutsWrap.innerHTML = CALLOUTS.map((c) => {
    const dir = c.side === 'right' ? 1 : -1
    const path = `M0 0 L${22 * dir} -26 L${58 * dir} -26`
    return `
    <div class="craft__callout craft__callout--${c.side}" data-anchor="${c.anchor}">
      <svg class="craft__callout-line" width="120" height="120" viewBox="-60 -60 120 120" aria-hidden="true">
        <path d="${path}" />
      </svg>
      <span class="craft__callout-dot"></span>
      <div class="craft__callout-card">
        <p class="craft__callout-title">${c.title}</p>
        <p class="craft__callout-body">${c.body}</p>
      </div>
    </div>`
  }).join('')

  // on phones the tethered cards are replaced by one caption slot at the bottom
  const mcapsWrap = document.createElement('div')
  mcapsWrap.className = 'craft__mcaps'
  mcapsWrap.setAttribute('aria-hidden', 'true')
  mcapsWrap.innerHTML = CALLOUTS.map(
    (c) => `
    <div class="craft__mcap" data-anchor="${c.anchor}">
      <p class="craft__mcap-title">${c.title}</p>
      <p class="craft__mcap-body">${c.body}</p>
    </div>`,
  ).join('')
  calloutsWrap.after(mcapsWrap)

  const swatches = $('#craft-swatches')
  swatches.innerHTML = FABRICS.map(
    (f, i) => `
    <button class="craft__swatch${i === 0 ? ' is-active' : ''}" data-fabric="${f.id}"
      style="background:${f.base}" aria-label="${f.label} — ${f.desc}" data-cursor></button>`,
  ).join('')
}

/* ------------------------------------------------------------------------- */
/*  Interactions                                                              */
/* ------------------------------------------------------------------------- */

function setupLenis(): Lenis | null {
  if (reducedMotion) return null
  const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1.0 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target as HTMLElement, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
    })
  })
  return lenis
}

function setupNav() {
  const nav = $('#site-nav')
  const toggle = $('#nav-toggle')
  const menu = $('#mobile-menu')
  let lastY = 0
  const onScroll = () => {
    const y = window.scrollY
    nav.classList.toggle('is-scrolled', y > 40)
    if (y > 700 && y > lastY + 6) nav.classList.add('is-hidden')
    else if (y < lastY - 6 || y < 700) nav.classList.remove('is-hidden')
    lastY = y
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  const closeMenu = () => {
    menu.classList.remove('is-open')
    toggle.setAttribute('aria-expanded', 'false')
    menu.setAttribute('aria-hidden', 'true')
  }
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open')
    toggle.setAttribute('aria-expanded', String(open))
    menu.setAttribute('aria-hidden', String(!open))
  })
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu))
}

function setupCursor() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return
  const cursor = $('#cursor')
  const label = $('#cursor-label')
  const pos = { x: innerWidth / 2, y: innerHeight / 2 }
  const target = { x: pos.x, y: pos.y }
  let seen = false
  window.addEventListener('pointermove', (e) => {
    target.x = e.clientX
    target.y = e.clientY
    if (!seen) {
      seen = true
      cursor.style.opacity = '1'
      pos.x = target.x
      pos.y = target.y
    }
  })
  gsap.ticker.add(() => {
    pos.x += (target.x - pos.x) * 0.22
    pos.y += (target.y - pos.y) * 0.22
    cursor.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`
  })
  document.addEventListener('pointerover', (e) => {
    const hit = (e.target as HTMLElement).closest('[data-cursor]')
    if (hit) {
      cursor.classList.add('is-active')
      label.textContent = hit.getAttribute('data-cursor') || 'View'
    }
  })
  document.addEventListener('pointerout', (e) => {
    if ((e.target as HTMLElement).closest('[data-cursor]')) {
      cursor.classList.remove('is-active')
    }
  })
}

function setupReveals() {
  if (reducedMotion) return
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    if (el.closest('#hero')) return // hero reveals are driven by the preloader lift
    gsap.to(el, {
      autoAlpha: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    })
  })

  // headline line reveals — titles are authored with explicit <br> breaks
  gsap.utils.toArray<HTMLElement>('[data-reveal-lines]').forEach((el) => {
    const parts = el.innerHTML.split(/<br\s*\/?>/i)
    el.innerHTML = parts
      .map((p) => `<span class="rv-line"><span>${p.trim()}</span></span>`)
      .join('')
    const spans = el.querySelectorAll('.rv-line > span')
    gsap.to(spans, {
      y: 0,
      yPercent: 0,
      duration: 1.15,
      stagger: 0.09,
      ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 86%' },
      onStart: () => el.classList.add('is-revealed'),
    })
  })
}

function setupWorkParallax() {
  if (reducedMotion) return
  gsap.utils.toArray<HTMLElement>('[data-work] img').forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -7 },
      {
        yPercent: 7,
        ease: 'none',
        scrollTrigger: { trigger: img.closest('[data-work]') as HTMLElement, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  })
}

function setupCollectionDrag() {
  const rail = $('#collection-rail')
  let down = false
  let startX = 0
  let startScroll = 0
  let moved = 0
  rail.addEventListener('pointerdown', (e) => {
    down = true
    moved = 0
    startX = e.clientX
    startScroll = rail.scrollLeft
    rail.classList.add('is-dragging')
  })
  window.addEventListener('pointermove', (e) => {
    if (!down) return
    const dx = e.clientX - startX
    moved = Math.max(moved, Math.abs(dx))
    rail.scrollLeft = startScroll - dx
  })
  window.addEventListener('pointerup', () => {
    down = false
    rail.classList.remove('is-dragging')
  })
  rail.addEventListener(
    'click',
    (e) => {
      if (moved > 8) {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    true,
  )

  if (!reducedMotion) {
    const cards = rail.querySelectorAll('[data-card]')
    gsap.from(cards, {
      x: 90,
      autoAlpha: 0,
      duration: 1.1,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: rail, start: 'top 85%' },
    })
  }
}

function setupFaq() {
  document.querySelectorAll<HTMLElement>('[data-faq]').forEach((item) => {
    const btn = item.querySelector('.faq-item__q') as HTMLButtonElement
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open')
      document.querySelectorAll('[data-faq].is-open').forEach((o) => {
        o.classList.remove('is-open')
        o.querySelector('.faq-item__q')?.setAttribute('aria-expanded', 'false')
      })
      if (!isOpen) {
        item.classList.add('is-open')
        btn.setAttribute('aria-expanded', 'true')
      }
    })
  })
}

/* ------------------------------------------------------------------------- */
/*  Preloader + boot                                                          */
/* ------------------------------------------------------------------------- */

async function boot() {
  hydrateQuoteLinks()
  renderChapters()
  renderMarquee()
  renderCollection()
  renderWork()
  renderStats()
  renderProcess()
  renderVoices()
  renderFaq()
  renderCraftDom()

  setupLenis()
  setupNav()
  setupCursor()
  setupFaq()
  setupCollectionDrag()

  /* three scenes */
  const vanHandle = initVanScene(
    $('#van-canvas') as unknown as HTMLCanvasElement,
    {
      trackEl: $('#journey-track'),
      chapterEls: Array.from(document.querySelectorAll<HTMLElement>('.journey__chapter')),
      counterEl: $('#journey-counter-num'),
      railFillEl: $('#journey-rail-fill'),
      headlineEl: $('.journey__head'),
    },
    reducedMotion,
  )

  const calloutDoms: CalloutDom[] = Array.from(
    document.querySelectorAll<HTMLElement>('.craft__callout'),
  ).map((el) => ({
    el,
    mobileEl: document.querySelector<HTMLElement>(`.craft__mcap[data-anchor="${el.dataset.anchor}"]`),
    anchor: el.dataset.anchor as CalloutDom['anchor'],
  }))

  const seatHandle = initSeatScene(
    $('#seat-canvas') as unknown as HTMLCanvasElement,
    {
      trackEl: $('#craft-track'),
      stageEl: $('.craft__stage'),
      headEl: $('.craft__head'),
      callouts: calloutDoms,
      fabricsEl: $('#craft-fabrics'),
      phaseEls: Array.from(document.querySelectorAll<HTMLElement>('#craft-phase span')),
    },
    reducedMotion,
  )

  /* fabric picker wiring */
  const fabricName = $('#craft-fabric-name')
  document.querySelectorAll<HTMLButtonElement>('.craft__swatch').forEach((btn) => {
    btn.addEventListener('click', () => {
      const fabric = FABRICS.find((f) => f.id === btn.dataset.fabric)
      if (!fabric) return
      document.querySelectorAll('.craft__swatch').forEach((b) => b.classList.remove('is-active'))
      btn.classList.add('is-active')
      fabricName.textContent = `${fabric.label} — ${fabric.desc}`
      seatHandle.setFabric(fabric)
    })
  })

  setupReveals()
  setupWorkParallax()

  /* preloader */
  const preloader = $('#preloader')
  const countEl = $('#preloader-count')
  const barEl = $('#preloader-bar')
  const minWait = new Promise((r) => setTimeout(r, reducedMotion ? 200 : 1500))
  const progress = { v: 0 }
  if (!reducedMotion) {
    gsap.to(progress, {
      v: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        countEl.textContent = String(Math.round(progress.v)).padStart(2, '0')
        barEl.style.transform = `scaleX(${progress.v / 100})`
      },
    })
  } else {
    countEl.textContent = '100'
    barEl.style.transform = 'scaleX(1)'
  }

  await Promise.all([document.fonts.ready, minWait])

  const heroLines = document.querySelectorAll('.hero__line > span')
  const lift = gsap.timeline()
  lift.to(preloader, {
    clipPath: 'inset(0 0 100% 0)',
    duration: reducedMotion ? 0 : 1.0,
    ease: 'power4.inOut',
  })
  lift.add(() => {
    document.body.classList.remove('is-loading')
    preloader.style.display = 'none'
    ScrollTrigger.refresh()
  })
  if (!reducedMotion) {
    lift.add(() => void vanHandle.playIntro(), '-=0.35')
    lift.to(heroLines, { y: 0, duration: 1.2, stagger: 0.12, ease: 'power4.out' }, '-=0.25')
    lift.to('#hero [data-reveal]', { autoAlpha: 1, y: 0, duration: 1.0, stagger: 0.07, ease: 'power3.out' }, '-=0.9')
  } else {
    gsap.set(heroLines, { y: 0 })
    gsap.set('#hero [data-reveal]', { autoAlpha: 1, y: 0 })
  }
}

boot().catch((err) => {
  console.error(err)
  // fail open: never trap users behind the preloader
  document.body.classList.remove('is-loading')
  const pre = document.getElementById('preloader')
  if (pre) pre.style.display = 'none'
})
