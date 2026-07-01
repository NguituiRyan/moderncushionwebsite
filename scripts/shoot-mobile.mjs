import { chromium } from 'playwright-core'

const OUT = '/tmp/claude-0/-home-user-moderncushionwebsite/95216df2-cb7b-5630-a1d5-fb9bddfb645c/scratchpad/shots'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
page.on('pageerror', (e) => console.log('PAGE EXCEPTION:', e.message))
await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
await page.waitForSelector('body:not(.is-loading)', { timeout: 20000 })
await page.waitForTimeout(2400)
await page.screenshot({ path: `${OUT}/m1-hero.png` })
const metrics = await page.evaluate(() => {
  const j = document.getElementById('journey-track')
  const c = document.getElementById('craft-track')
  return { vh: innerHeight, jTop: j.getBoundingClientRect().top + scrollY, jH: j.offsetHeight, cTop: c.getBoundingClientRect().top + scrollY, cH: c.offsetHeight }
})
async function snap(y, n) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), Math.round(y))
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${OUT}/${n}.png` })
}
await snap(metrics.jTop + (metrics.jH - metrics.vh) * 0.45, 'm2-journey')
await snap(metrics.cTop + (metrics.cH - metrics.vh) * 0.85, 'm3-craft')
const y = await page.evaluate(() => document.querySelector('#collection').getBoundingClientRect().top + scrollY)
await snap(y - 40, 'm4-collection')
const y2 = await page.evaluate(() => document.querySelector('#contact').getBoundingClientRect().top + scrollY)
await snap(y2 - 20, 'm5-contact')
await browser.close()
console.log('mobile done')
