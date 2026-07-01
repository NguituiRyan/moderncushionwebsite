import { chromium } from 'playwright-core'

const OUT = '/tmp/claude-0/-home-user-moderncushionwebsite/95216df2-cb7b-5630-a1d5-fb9bddfb645c/scratchpad/shots'
const BASE = 'http://localhost:4173'

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
page.on('console', (m) => { if (m.type() === 'error') console.log('PAGE ERROR:', m.text()) })
page.on('pageerror', (e) => console.log('PAGE EXCEPTION:', e.message))

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForSelector('body:not(.is-loading)', { timeout: 20000 })
await page.waitForTimeout(2600)
await page.screenshot({ path: `${OUT}/01-hero.png` })

const metrics = await page.evaluate(() => {
  const j = document.getElementById('journey-track')
  const c = document.getElementById('craft-track')
  return {
    vh: innerHeight,
    journeyTop: j.getBoundingClientRect().top + scrollY,
    journeyH: j.offsetHeight,
    craftTop: c.getBoundingClientRect().top + scrollY,
    craftH: c.offsetHeight,
    docH: document.body.scrollHeight,
  }
})

async function snapAt(y, name) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), Math.round(y))
  await page.waitForTimeout(1700)
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log('shot', name)
}

const jSpan = metrics.journeyH - metrics.vh
for (const [p, tag] of [[0.06,'02-j-side'],[0.2,'03-j-floor'],[0.42,'04-j-seats'],[0.66,'05-j-stars'],[0.9,'06-j-out'],[0.995,'07-j-end']]) {
  await snapAt(metrics.journeyTop + jSpan * p, `${tag}`)
}
const cSpan = metrics.craftH - metrics.vh
for (const [p, tag] of [[0.08,'08-c-turn'],[0.34,'09-c-explode'],[0.6,'10-c-rebuild'],[0.85,'11-c-fabric']]) {
  await snapAt(metrics.craftTop + cSpan * p, `${tag}`)
}
for (const [sel, tag] of [['#collection','12-collection'],['#work','13-work'],['#process','14-process'],['#contact','15-contact']]) {
  const y = await page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY, sel)
  await snapAt(y - 60, tag)
}
await browser.close()
console.log('done')
