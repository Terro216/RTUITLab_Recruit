import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'

const base = (process.argv[2] || 'http://127.0.0.1:18882').replace(/\/$/, '')
const output = process.argv[3] || '/tmp/honest-broker-qa'
mkdirSync(output, { recursive: true })
const key = 'honest-broker.demo.v1'
const failures = [], checks = [], requests = new Set(), errors = []
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
const contexts = []
async function context(options = {}) {
  const c = await browser.newContext(options)
  contexts.push(c)
  await c.addInitScript(() => {
    window.__csp = []
    document.addEventListener('securitypolicyviolation', e => window.__csp.push(e.violatedDirective + ': ' + e.blockedURI))
  })
  c.on('page', page => {
    page.setDefaultTimeout(12000)
    page.setDefaultNavigationTimeout(20000)
    page.on('request', request => requests.add(request.url()))
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
  })
  await c.route('**/*', route => {
    const url = route.request().url()
    if (url.startsWith('data:') || new URL(url).origin === new URL(base).origin) return route.continue()
    errors.push('External request: ' + url)
    return route.abort()
  })
  return c
}
async function check(name, fn) {
  try { await fn(); checks.push(name); console.log('PASS ' + name) }
  catch (error) { failures.push({ name, error: error.stack }); throw error }
}
async function go(page, path) {
  const response = await page.goto(base + path)
  assert.equal(response.status(), 200)
  await page.locator('.demo-bar').waitFor()
  await page.evaluate(() => document.fonts.ready)
}
async function saved(page) { return page.evaluate(k => JSON.parse(localStorage.getItem(k)), key) }
async function poll(fn, predicate, message = 'condition') {
  for (let n = 0; n < 100; n++) { const result = await fn(); if (predicate(result)) return result; await new Promise(r => setTimeout(r, 50)) }
  throw new Error('Timeout: ' + message)
}
async function confirm(page) {
  await page.getByRole('dialog').getByRole('button', { name: 'Подтвердить', exact: true }).click({ clickCount: 2, delay: 50 })
}
async function closeReceipt(page) {
  const ok = page.getByRole('dialog').getByRole('button', { name: 'OK', exact: true })
  await ok.waitFor()
  await ok.click()
}
async function reset(page) {
  await page.getByRole('button', { name: 'Сбросить демо', exact: true }).click()
  await confirm(page)
  await poll(() => saved(page), s => s?.cashCents === 1000000 && s.history.length === 0, 'reset')
}
async function nav(page, label, path) {
  await page.locator('.aside-hamburger').click()
  await page.locator('.cabinetAside-wrapper').getByRole('link', { name: label, exact: true }).click()
  await page.waitForURL(base + path)
  await page.waitForTimeout(350)
  assert.equal(await page.locator('.cabinetAside-wrapper').isVisible(), false)
}

try {
  const c1 = await context({ viewport: { width: 1440, height: 1000 } })
  const page = await c1.newPage()
  if (process.argv[4] !== 'visual') {
  await check('anonymous direct cabinet: initial cash, positions and valuation', async () => {
    await go(page, '/protected/cabinet')
    assert.equal(await page.getByTestId('cash').textContent(), '10000.00$')
    assert.equal(await page.getByTestId('assets').textContent(), '3040.00$')
    assert.equal(await page.getByTestId('total').textContent(), '13040.00$')
    assert.equal(await page.locator('[data-position]').count(), 3)
    await reset(page)
  })
  const c2 = await context({ viewport: { width: 1440, height: 1000 } })
  const other = await c2.newPage()
  await go(other, '/protected/cabinet')
  await check('navigation, case-insensitive search, unknown symbol', async () => {
    await nav(page, 'Торговля', '/protected/cabinet/trade')
    assert.equal(await page.locator('[data-ticker]').count(), 8)
    await page.getByRole('searchbox').fill('msFt')
    assert.equal(await page.locator('[data-ticker]').count(), 1)
    await page.getByRole('searchbox').fill('nonsense')
    await page.getByText('Инструменты не найдены.', { exact: false }).waitFor()
    await page.getByRole('searchbox').fill('aapl')
  })
  await check('buy, repeated confirm, shared cash across routes', async () => {
    const stock = page.locator('[data-ticker="AAPL.US"]')
    await stock.getByRole('spinbutton').fill('2')
    await stock.getByRole('button', { name: 'Купить', exact: true }).click({ clickCount: 2, delay: 50 })
    await page.getByRole('dialog').getByText(/комиссия 0,04%: 0.14/).waitFor()
    await confirm(page)
    await closeReceipt(page)
    let s = await saved(page)
    assert.equal(s.cashCents, 964986)
    assert.equal(s.positions['AAPL.US'].quantity, 7)
    assert.equal(s.history.length, 1)
    assert.equal(await page.getByTestId('trade-cash').textContent(), '9649.86$')
    await nav(page, 'Главная', '/protected/cabinet')
    assert.equal(await page.getByTestId('cash').textContent(), '9649.86$')
    assert.equal(await page.locator('[data-position="AAPL.US"]').getByTestId('position-quantity').textContent(), '7 шт.')
  })
  await check('partial then full sale and portfolio recalculation', async () => {
    const position = page.locator('[data-position="AMD.US"]')
    await position.getByRole('spinbutton').fill('4')
    await position.getByRole('button', { name: 'Продать', exact: true }).click()
    await confirm(page)
    await closeReceipt(page)
    assert.equal((await saved(page)).positions['AMD.US'].quantity, 6)
    assert.equal(await page.getByTestId('cash').textContent(), '10149.66$')
    await position.getByRole('spinbutton').fill('7')
    await position.getByRole('button', { name: 'Продать', exact: true }).click()
    await confirm(page)
    await page.getByRole('dialog').getByText('Недостаточно инструментов для продажи').waitFor()
    await closeReceipt(page)
    assert.equal((await saved(page)).positions['AMD.US'].quantity, 6)
    await position.getByRole('spinbutton').fill('6')
    await position.getByRole('button', { name: 'Продать', exact: true }).click()
    await confirm(page)
    await poll(() => saved(page), s => !s.positions['AMD.US'])
    assert.equal(await page.locator('[data-position="AMD.US"]').count(), 0)
    assert.equal(await page.getByTestId('cash').textContent(), '10899.36$')
    assert.equal(await page.getByTestId('assets').textContent(), '2140.00$')
    assert.equal(await page.getByTestId('history-row').count(), 3)
  })
  await check('invalid quantity and insufficient funds never create an operation', async () => {
    await nav(page, 'Торговля', '/protected/cabinet/trade')
    const stock = page.locator('[data-ticker="AAPL.US"]')
    for (const qty of ['0', '-1', '1.5']) {
      await stock.getByRole('spinbutton').fill(qty)
      await stock.getByRole('button', { name: 'Купить', exact: true }).click()
      await page.getByRole('dialog').getByText(/Количество должно быть целым/).waitFor()
      await closeReceipt(page)
    }
    await stock.getByRole('spinbutton').fill('100000')
    await stock.getByRole('button', { name: 'Купить', exact: true }).click()
    await confirm(page)
    await page.getByRole('dialog').getByText('Недостаточно средств с учётом комиссии').waitFor()
    await closeReceipt(page)
    assert.equal((await saved(page)).history.length, 3)
    assert.equal((await saved(page)).cashCents, 1089936)
  })
  await check('reload preserves balance, portfolio and history', async () => {
    const before = await saved(page)
    await page.reload()
    assert.deepEqual(await saved(page), before)
    await go(page, '/protected/cabinet')
    assert.equal(await page.getByTestId('cash').textContent(), '10899.36$')
    assert.equal(await page.getByTestId('history-row').count(), 3)
  })
  await check('deposit and withdrawal with repeated clicks', async () => {
    for (const label of ['Пополнить на 300$', 'Вывести 300$']) {
      await page.getByRole('button', { name: label, exact: true }).click({ clickCount: 2, delay: 50 })
      await confirm(page)
      await closeReceipt(page)
    }
    assert.equal((await saved(page)).cashCents, 1089936)
    assert.equal((await saved(page)).history.length, 5)
  })
  await check('edit local profile and persist it', async () => {
    await nav(page, 'Профиль', '/protected/cabinet/profile')
    await page.getByRole('button', { name: 'Поменять данные' }).click()
    assert.equal(await page.getByRole('dialog').count(), 0)
    await page.getByLabel('Ваше имя:').fill('Мария Демо')
    await page.getByLabel('Ваш почтовый адрес:').fill('maria@example.com')
    await page.getByRole('button', { name: 'Сохранить', exact: true }).click()
    await closeReceipt(page)
    await page.reload()
    await page.getByRole('heading', { name: 'Здравствуйте, Мария Демо' }).waitFor()
    assert.equal((await saved(page)).profile.mail, 'maria@example.com')
  })
  await check('a second browser session remains independent', async () => {
    assert.equal(await other.getByTestId('cash').textContent(), '10000.00$')
    assert.equal(await other.locator('[data-position="AMD.US"]').getByTestId('position-quantity').textContent(), '10 шт.')
    await go(other, '/protected/cabinet/profile')
    await other.getByRole('heading', { name: 'Здравствуйте, Алексей Демо' }).waitFor()
    await go(other, '/protected/cabinet/trade')
    await other.locator('[data-ticker="MSFT.US"]').getByRole('button', { name: 'Купить', exact: true }).click()
    await confirm(other); await closeReceipt(other)
    assert.equal((await saved(other)).cashCents, 969488)
    assert.equal((await saved(page)).cashCents, 1089936)
  })
  await check('tabs share state and serialize concurrent trades', async () => {
    await reset(page)
    const tab = await c1.newPage()
    await go(page, '/protected/cabinet/trade')
    await go(tab, '/protected/cabinet/trade')
    for (const p of [page, tab]) await p.locator('[data-ticker="AAPL.US"]').getByRole('button', { name: 'Купить', exact: true }).click()
    await Promise.all([confirm(page), confirm(tab)])
    await closeReceipt(page); await closeReceipt(tab)
    await poll(() => saved(page), s => s.history.length === 2)
    const s = await saved(page)
    assert.equal(s.cashCents, 964986)
    assert.equal(s.positions['AAPL.US'].quantity, 7)
    await poll(() => tab.getByTestId('trade-cash').textContent(), t => t === '9649.86$')
    await tab.close()
  })
  await check('reset restores cash, assets, history and profile after reload', async () => {
    await reset(page)
    await go(page, '/protected/cabinet')
    assert.equal(await page.getByTestId('cash').textContent(), '10000.00$')
    assert.equal(await page.getByTestId('history-row').count(), 0)
    assert.equal(await page.getByTestId('assets').textContent(), '3040.00$')
    assert.equal((await saved(other)).cashCents, 969488)
    assert.equal((await saved(other)).history.length, 1)
    await page.reload()
    assert.equal(await page.getByTestId('cash').textContent(), '10000.00$')
  })
  await check('insufficient withdrawal leaves history unchanged', async () => {
    await page.evaluate(k => { const s = JSON.parse(localStorage.getItem(k)); s.cashCents = 100; localStorage.setItem(k, JSON.stringify(s)) }, key)
    await page.reload()
    await page.getByRole('button', { name: 'Вывести 300$', exact: true }).click()
    await confirm(page)
    await page.getByRole('dialog').getByText('Недостаточно средств для списания').waitFor()
    await closeReceipt(page)
    assert.equal((await saved(page)).cashCents, 100)
    assert.equal((await saved(page)).history.length, 0)
    await reset(page)
  })
  await check('corrupt storage is visible and reset recovers it', async () => {
    await page.evaluate(k => localStorage.setItem(k, 'broken'), key)
    await page.reload()
    await page.getByRole('alert').waitFor()
    await reset(page)
    assert.equal(await page.getByRole('alert').count(), 0)
  })
  }
  for (const width of [1440, 390, 320]) {
    await check(`all original pages and navigation at ${width}px`, async () => {
      await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 })
      const routes = [['/', 'home'], ['/about', 'about'], ['/tariffs', 'tariffs'], ['/protected/', 'login'], ['/protected/cabinet', 'portfolio'], ['/protected/cabinet/trade', 'trade'], ['/protected/cabinet/profile', 'profile'], ['/protected/cabinet/news', 'news'], ['/business', 'business'], ['/learning', 'learning']]
      for (const [route, name] of routes) {
        await go(page, route)
        if (route === '/') {
          const x = await page.locator('.moving-line').first().evaluate(el => el.getBoundingClientRect().x)
          await page.waitForTimeout(400)
          assert.notEqual(await page.locator('.moving-line').first().evaluate(el => el.getBoundingClientRect().x), x, 'original ticker moves')
        }
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)
        assert.equal(overflow, false, `Horizontal overflow ${width} ${route}`)
        assert.deepEqual(await page.evaluate(() => window.__csp), [], `CSP violation ${route}`)
        await page.locator('img').evaluateAll(images => images.forEach(i => { i.loading = 'eager' }))
        await poll(() => page.locator('img').evaluateAll(images => images.filter(i => !i.complete).length), n => n === 0, 'images')
        const broken = await page.locator('img').evaluateAll(images => images.filter(i => i.complete && i.naturalWidth === 0).map(i => ({ src: i.src, alt: i.alt })))
        assert.deepEqual(broken, [], `broken image ${route}`)
        await page.screenshot({ path: `${output}/${width}-${name}.png`, fullPage: true, animations: 'disabled' })
        if (route === '/protected/cabinet/news') {
          await page.getByText('18.03.2022 · Демо').waitFor()
          await page.getByRole('button', { name: 'Читать подробнее' }).first().click()
          await page.getByRole('button', { name: 'Загрузить еще' }).click()
          assert.equal(await page.locator('.news-item').count(), 4)
        }
      }
      await go(page, '/')
      if (width < 481) {
        await page.locator('.header-hamburger').click()
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, 'mobile menu overflow')
      }
      await page.locator('.header-links').getByRole('link', { name: 'О нас', exact: true }).click()
      await page.waitForURL(base + '/about')
      if (width < 481) { await page.waitForTimeout(350); assert.equal(await page.locator('.header-links').isVisible(), false) }
      await go(page, '/protected/')
      await page.getByRole('button', { name: 'Войти в демо' }).click()
      await page.waitForURL(base + '/protected/cabinet')
      await nav(page, 'Торговля', '/protected/cabinet/trade')
      const stock = page.locator('[data-ticker="AAPL.US"]')
      await stock.getByRole('button', { name: 'Купить', exact: true }).click()
      await confirm(page); await closeReceipt(page)
      await reset(page)
    })
  }
  await check('no requests to external services, JS errors or CSP errors', async () => {
    assert.deepEqual(errors, [])
    assert.ok([...requests].every(url => url.startsWith('data:') || new URL(url).origin === new URL(base).origin))
  })
} catch (error) {
  console.error(error.stack)
} finally {
  writeFileSync(`${output}/report.json`, JSON.stringify({ base, checks, failures, errors, requestOrigins: [...new Set([...requests].map(u => new URL(u).origin))], requests: [...requests] }, null, 2))
  await browser.close()
}
if (failures.length) process.exit(1)
console.log(`${checks.length} checks passed. Artifacts: ${output}`)
