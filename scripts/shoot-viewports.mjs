import { chromium } from 'playwright-core'
const OUT = '/tmp/claude-0/-home-user-moderncushionwebsite/95216df2-cb7b-5630-a1d5-fb9bddfb645c/scratchpad/shots'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })

async function shootAt(viewport, name, scrollSpec) {
  const page = await browser.newPage({ viewport })
  page.on('pageerror', (e) => console.log('PAGE EXCEPTION:', e.message))
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await page.waitForSelector('body:not(.is-loading)', { timeout: 20000 })
  await page.waitForTimeout(2500)
  if (scrollSpec) {
    const y = await page.evaluate((spec) => {
      const el = document.getElementById(spec.id)
      const r = el.getBoundingClientRect()
      return r.top + scrollY + (el.offsetHeight - innerHeight) * spec.p
    }, scrollSpec)
    await page.evaluate((yy) => window.scrollTo({ top: Math.round(yy), behavior: 'instant' }), y)
    await page.waitForTimeout(1700)
  }
  await page.screenshot({ path: `${OUT}/${name}.png` })
  await page.close()
  console.log(name)
}

await shootAt({ width: 1600, height: 1000 }, 'v2-hero-desktop', null)
await shootAt({ width: 1100, height: 775 }, 'v2-hero-laptop', null)
await shootAt({ width: 390, height: 844 }, 'v2-hero-mobile', null)
await shootAt({ width: 1600, height: 1000 }, 'v2-craft-explode', { id: 'craft-track', p: 0.42 })
await shootAt({ width: 1600, height: 1000 }, 'v2-journey-seats', { id: 'journey-track', p: 0.45 })
await browser.close()
console.log('done')
