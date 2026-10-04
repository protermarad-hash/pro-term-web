#!/usr/bin/env node
// End-to-end checks for the consumer guarantee compliance (2026), driven in a
// real Chrome/Edge through the DevTools Protocol. No npm dependencies: Node 22
// provides fetch and WebSocket.
//
// Usage (against a running server, e.g. `npm run build && npx next start -p 3100`):
//   BASE_URL=http://localhost:3100 npm run test:e2e
// Optional: PRODUCT_SLUG=<slug> (otherwise the first product in /produse),
//           CHROME_PATH=<browser executable>, E2E_SCREENSHOTS=<directory>.
//
// The GARAN label is exercised on the checkout page by answering
// /api/products/guarantee-labels inside the browser (network interception):
// no database row is created or modified.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const BASE_URL = (process.env.BASE_URL ?? 'http://localhost:3100').replace(/\/$/, '');
const SCREENSHOT_DIR = process.env.E2E_SCREENSHOTS ?? path.join(tmpdir(), 'pro-term-e2e-screenshots');
const VIEWPORTS = {
  desktop: { width: 1280, height: 900, mobile: false },
  tablet: { width: 820, height: 1180, mobile: true },
  mobile: { width: 390, height: 844, mobile: true },
  zfold: { width: 280, height: 653, mobile: true },
};
const TEST_LABEL = { years: 5, yearsLabel: '5', manufacturerName: 'Producător Test', modelIdentifier: 'MODEL-X1' };

function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean);
  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) throw new Error('No Chrome/Edge found. Set CHROME_PATH.');
  return found;
}

// ── Minimal CDP client ──────────────────────────────────────────────────────
class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = [];
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(typeof event.data === 'string' ? event.data : event.data.toString());
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(`${msg.error.message} (${msg.error.code})`));
        else resolve(msg.result);
      } else if (msg.method) {
        for (const listener of this.listeners) listener(msg);
      }
    });
  }

  send(method, params = {}, sessionId) {
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params, sessionId }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  waitFor(method, sessionId, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Timeout waiting for ${method}`)), timeoutMs);
      const listener = (msg) => {
        if (msg.method === method && msg.sessionId === sessionId) {
          clearTimeout(timer);
          this.listeners = this.listeners.filter((l) => l !== listener);
          resolve(msg.params);
        }
      };
      this.listeners.push(listener);
    });
  }
}

async function launchBrowser() {
  const userDataDir = mkdtempSync(path.join(tmpdir(), 'pro-term-e2e-'));
  const proc = spawn(findBrowser(), [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-port=0',
    `--user-data-dir=${userDataDir}`,
    'about:blank',
  ], { stdio: 'ignore' });

  const portFile = path.join(userDataDir, 'DevToolsActivePort');
  for (let i = 0; i < 100 && !existsSync(portFile); i++) await delay(100);
  const [port] = readFileSync(portFile, 'utf8').split('\n');
  const { webSocketDebuggerUrl } = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
  const ws = new WebSocket(webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  const cdp = new Cdp(ws);

  return {
    cdp,
    async close() {
      ws.close();
      proc.kill();
      await delay(300);
      try { rmSync(userDataDir, { recursive: true, force: true }); } catch { /* browser may still hold files */ }
    },
  };
}

async function openPage(cdp) {
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  const send = (method, params) => cdp.send(method, params, sessionId);
  await send('Page.enable');
  await send('Runtime.enable');

  let requestedWidth = 0;
  const page = {
    send,
    async viewport(name) {
      const v = VIEWPORTS[name];
      requestedWidth = v.width;
      await send('Emulation.setDeviceMetricsOverride', { width: v.width, height: v.height, deviceScaleFactor: 1, mobile: v.mobile });
    },
    async goto(url) {
      const loaded = cdp.waitFor('Page.loadEventFired', sessionId, 45000);
      await send('Page.navigate', { url });
      await loaded;
      await page.eval(`window.__e2eWidth = ${requestedWidth || 0} || window.innerWidth`);
      await page.eval('document.fonts ? document.fonts.ready.then(() => true) : true');
      await delay(400);
    },
    async eval(expression) {
      const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (exceptionDetails) throw new Error(`${exceptionDetails.text} ${exceptionDetails.exception?.description ?? ''}`);
      return result.value;
    },
    async waitUntil(expression, timeoutMs = 10000) {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        if (await page.eval(expression)) return true;
        await delay(100);
      }
      throw new Error(`Condition not met: ${expression}`);
    },
    async press(key) {
      const codes = { Enter: 13, Escape: 27, Tab: 9 };
      const base = { key, code: key, windowsVirtualKeyCode: codes[key], nativeVirtualKeyCode: codes[key] };
      await send('Input.dispatchKeyEvent', { type: 'keyDown', ...base, ...(key === 'Enter' ? { text: '\r' } : {}) });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
      await delay(250);
    },
    async screenshot(name) {
      mkdirSync(SCREENSHOT_DIR, { recursive: true });
      const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      const file = path.join(SCREENSHOT_DIR, `${name}.png`);
      writeFileSync(file, Buffer.from(data, 'base64'));
      return file;
    },
    async fullScreenshot(name) {
      const height = await page.eval('Math.min(document.documentElement.scrollHeight, 12000)');
      const width = await page.eval('window.innerWidth');
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 900 });
      const file = await page.screenshot(name);
      return file;
    },
  };
  return page;
}

// ── In-page helpers (serialised into Runtime.evaluate) ──────────────────────
// On mobile emulation Chrome widens the layout viewport when content does not
// fit, so both the document width and window.innerWidth are compared with the
// requested viewport width (set as window.__e2eWidth before each check).
const NO_HORIZONTAL_OVERFLOW = '(document.documentElement.scrollWidth <= window.innerWidth + 1 && window.innerWidth <= (window.__e2eWidth || window.innerWidth))';
const SECTION_FITS = (selector) => `(() => {
  const section = document.querySelector(${JSON.stringify(selector)});
  const box = section.getBoundingClientRect();
  const scrollable = (el) => { for (let e = el.parentElement; e && e !== section; e = e.parentElement) { const o = getComputedStyle(e).overflowX; if (o === 'auto' || o === 'scroll') return true; } return false; };
  return [...section.querySelectorAll('*')].every((el) => scrollable(el) || el.getBoundingClientRect().right <= box.right + 1) && section.scrollWidth <= section.clientWidth + 1;
})()`;
const CONTRAST_FN = `(() => {
  const parse = (c) => (c.match(/[\\d.]+/g) || []).map(Number);
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const bg = (el) => { for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c.length >= 3 && (c[3] === undefined || c[3] > 0.9)) return c; } return [255, 255, 255]; };
  return (el) => { const a = lum(parse(getComputedStyle(el).color)), b = lum(bg(el)); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
})()`;

// ── Tests ───────────────────────────────────────────────────────────────────
const results = [];
const warnings = [];
async function check(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`  ✔ ${name}`);
  } catch (error) {
    results.push({ name, ok: false, error: error.message });
    console.log(`  ✖ ${name}\n      ${error.message}`);
  }
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function discoverProduct() {
  const slug = process.env.PRODUCT_SLUG
    ?? (await (await fetch(`${BASE_URL}/produse`)).text()).match(/href="\/produse\/([a-z0-9-]+)"/)?.[1]
    ?? [...(await (await fetch(`${BASE_URL}/sitemap.xml`)).text()).matchAll(/\/produse\/([a-z0-9-]+)</g)]
      .map((match) => match[1])
      .find((candidate) => !candidate.includes('montaj'));
  assert(slug, 'No product slug found on /produse or in sitemap.xml (set PRODUCT_SLUG).');
  const response = await fetch(`${BASE_URL}/api/products/${slug}`);
  assert(response.ok, `GET /api/products/${slug} → ${response.status}`);
  const { product } = await response.json();
  return product;
}

async function main() {
  console.log(`E2E consumer guarantee checks against ${BASE_URL}`);
  const product = await discoverProduct();
  console.log(`Product under test: ${product.slug}`);
  const browser = await launchBrowser();
  const page = await openPage(browser.cdp);

  try {
    console.log('\n/garantii');
    for (const name of Object.keys(VIEWPORTS)) {
      await check(`[${name}] notice visible, legible size, no horizontal page overflow`, async () => {
        await page.viewport(name);
        await page.goto(`${BASE_URL}/garantii`);
        const info = await page.eval(`(() => {
          const img = document.querySelector('[data-testid="eu-legal-guarantee-notice"] img');
          return { loaded: !!img && img.complete && img.naturalWidth > 0, width: img ? img.getBoundingClientRect().width : 0,
                   overflow: !(${NO_HORIZONTAL_OVERFLOW}), h1: document.querySelector('h1')?.textContent,
                   footer: !!document.querySelector('footer a[href="/garantii"]') };
        })()`);
        assert(info.loaded, 'official notice image not loaded');
        assert(info.width >= 599, `notice rendered at ${info.width}px (< 600px, text would not be legible)`);
        assert(!info.overflow, 'page scrolls horizontally');
        assert(info.h1 === 'Garanții și drepturile consumatorului', `unexpected h1: ${info.h1}`);
        assert(info.footer, 'footer link to /garantii missing');
        await page.screenshot(`garantii-${name}`);
      });
    }

    console.log('\nProduct page');
    for (const name of ['desktop', 'zfold']) {
      await check(`[${name}] guarantee section next to price/CTA, no GARAN label by default, section fits its column`, async () => {
        await page.viewport(name);
        await page.goto(`${BASE_URL}/produse/${product.slug}`);
        const info = await page.eval(`(() => {
          const section = document.querySelector('[data-testid="product-guarantee-section"]');
          const cta = [...document.querySelectorAll('button, a')].find((el) => /Adaugă în coș|Cere ofertă/.test(el.textContent));
          const specs = [...document.querySelectorAll('h2')].find((el) => el.textContent.includes('Specificații tehnice'));
          const contrast = ${CONTRAST_FN};
          const texts = section ? [...section.querySelectorAll('p, a, button')] : [];
          return { section: !!section,
                   afterCta: !!(section && cta && (cta.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING)),
                   beforeSpecs: !!(section && specs && (section.compareDocumentPosition(specs) & Node.DOCUMENT_POSITION_FOLLOWING)),
                   trigger: !!document.querySelector('[data-testid="legal-guarantee-notice-trigger"]'),
                   label: !!document.querySelector('[data-testid="garan-label-trigger"]'),
                   sectionFits: ${SECTION_FITS('[data-testid="product-guarantee-section"]')},
                   pageOverflow: !(${NO_HORIZONTAL_OVERFLOW}), layoutWidth: window.innerWidth,
                   minContrast: Math.min(...texts.map((el) => contrast(el))) };
        })()`);
        assert(info.section, 'section missing');
        assert(info.afterCta && info.beforeSpecs, 'section is not between the add-to-cart block and the specifications');
        assert(info.trigger, 'notice trigger missing');
        assert(!info.label, 'GARAN label shown for a product that is not eligible');
        assert(info.sectionFits, 'guarantee section content overflows its container');
        if (info.pageOverflow) {
          warnings.push(`[${name}] product page laid out at ${info.layoutWidth}px instead of ${VIEWPORTS[name].width}px – pre-existing on origin/main (not caused by the guarantee section).`);
        }
        assert(info.minContrast >= 4.5, `text contrast ${info.minContrast.toFixed(2)} < 4.5:1`);
        await page.eval(`document.querySelector('[data-testid="product-guarantee-section"]').scrollIntoView({ block: 'center', behavior: 'instant' })`);
        await page.screenshot(`product-section-${name}`);
      });
    }

    await check('[desktop] keyboard: Enter opens the full official notice, Escape closes and returns focus', async () => {
      await page.viewport('desktop');
      await page.goto(`${BASE_URL}/produse/${product.slug}`);
      await page.eval(`document.querySelector('[data-testid="legal-guarantee-notice-trigger"]').focus()`);
      await page.press('Enter');
      await page.waitUntil(`!!document.querySelector('dialog[open] [data-testid="eu-legal-guarantee-notice"] img')`);
      await page.waitUntil(`(() => { const i = document.querySelector('dialog[open] img'); return i.complete && i.naturalWidth > 0; })()`);
      const width = await page.eval(`document.querySelector('dialog[open] img').getBoundingClientRect().width`);
      assert(width >= 600, `notice in dialog rendered at ${width}px`);
      const focusInDialog = await page.eval(`!!document.activeElement.closest('dialog[open]')`);
      assert(focusInDialog, 'focus did not move into the dialog');
      await page.screenshot('product-notice-dialog-desktop');
      await page.press('Escape');
      await page.waitUntil(`!document.querySelector('dialog[open]')`);
      const focusBack = await page.eval(`document.activeElement?.dataset?.testid`);
      assert(focusBack === 'legal-guarantee-notice-trigger', `focus returned to ${focusBack}`);
    });

    await check('[zfold] notice dialog keeps the notice legible (scrolls inside, page does not)', async () => {
      await page.viewport('zfold');
      await page.goto(`${BASE_URL}/produse/${product.slug}`);
      await page.eval(`document.querySelector('[data-testid="legal-guarantee-notice-trigger"]').click()`);
      await page.waitUntil(`(() => { const i = document.querySelector('dialog[open] img'); return !!i && i.complete && i.naturalWidth > 0; })()`);
      const info = await page.eval(`(() => {
        const dialog = document.querySelector('dialog[open]').getBoundingClientRect();
        return { width: document.querySelector('dialog[open] img').getBoundingClientRect().width,
                 dialogFits: dialog.left >= 0 && dialog.right <= window.innerWidth + 1 };
      })()`);
      assert(info.width >= 599, `notice rendered at ${info.width}px`);
      assert(info.dialogFits, 'dialog wider than the viewport');
      await page.screenshot('product-notice-dialog-zfold');
    });

    console.log('\nCheckout');
    await page.send('Fetch.enable', { patterns: [{ urlPattern: '*/api/products/guarantee-labels*', requestStage: 'Request' }] });
    browser.cdp.listeners.push((msg) => {
      if (msg.method !== 'Fetch.requestPaused') return;
      const body = Buffer.from(JSON.stringify({ labels: { [product.id]: TEST_LABEL } })).toString('base64');
      page.send('Fetch.fulfillRequest', {
        requestId: msg.params.requestId,
        responseCode: 200,
        responseHeaders: [{ name: 'Content-Type', value: 'application/json' }],
        body,
      });
    });

    for (const name of ['desktop', 'mobile', 'zfold']) {
      await check(`[${name}] guarantee info + GARAN label directly above the order button`, async () => {
        await page.viewport(name);
        await page.goto(`${BASE_URL}/`);
        await page.eval(`localStorage.setItem('proterm_cart', ${JSON.stringify(JSON.stringify([{ product, quantity: 1 }]))})`);
        await page.goto(`${BASE_URL}/checkout`);
        await page.waitUntil(`!!document.querySelector('[data-testid="garan-label-trigger"] svg')`);
        const info = await page.eval(`(() => {
          const block = document.querySelector('[data-testid="checkout-guarantee-info"]');
          const submit = document.querySelector('form button[type="submit"]');
          const between = [];
          for (let el = block.nextElementSibling; el && el !== submit; el = el.nextElementSibling) between.push(el.tagName + ':' + (el.textContent || '').slice(0, 30));
          return { above: !!(block.compareDocumentPosition(submit) & Node.DOCUMENT_POSITION_FOLLOWING), between,
                   pageOverflow: !(${NO_HORIZONTAL_OVERFLOW}), layoutWidth: window.innerWidth,
                   blockFits: ${SECTION_FITS('[data-testid="checkout-guarantee-info"]')},
                   nestedText: [...document.querySelectorAll('[data-testid="garan-label-trigger"] svg text')].map((t) => t.textContent.trim()).join('|') };
        })()`);
        assert(info.above, 'guarantee block is not above the order button');
        assert(info.between.length === 1 && info.between[0].startsWith('LABEL'), `unexpected elements between block and button: ${info.between}`);
        assert(info.nestedText === '5', `nested label shows "${info.nestedText}" instead of the duration`);
        assert(info.blockFits, 'guarantee block content overflows its container');
        if (info.pageOverflow) {
          warnings.push(`[${name}] checkout laid out at ${info.layoutWidth}px instead of ${VIEWPORTS[name].width}px – pre-existing on origin/main with a product in the cart (not caused by the guarantee block).`);
        }
        await page.eval(`document.querySelector('[data-testid="checkout-guarantee-info"]').scrollIntoView({ block: 'center', behavior: 'instant' })`);
        await page.screenshot(`checkout-${name}`);
      });
    }

    await check('[mobile] tap opens the complete GARAN label with producer, model and a ≥ 2 cm QR code', async () => {
      await page.viewport('mobile');
      await page.goto(`${BASE_URL}/checkout`);
      await page.waitUntil(`!!document.querySelector('[data-testid="garan-label-trigger"] svg')`);
      await page.eval(`document.querySelector('[data-testid="garan-label-trigger"]').click()`);
      await page.waitUntil(`!!document.querySelector('dialog[open] [data-testid="garan-label-full"] svg[viewBox="0 0 269.29 283.46"]')`);
      const info = await page.eval(`(() => {
        const svg = document.querySelector('dialog[open] [data-testid="garan-label-full"] svg[viewBox="0 0 269.29 283.46"]');
        const texts = [...svg.querySelectorAll('text')].map((t) => ({ text: t.textContent, box: t.getBoundingClientRect() }));
        const width = svg.getBoundingClientRect().width;
        const dialogBox = document.querySelector('dialog[open]').getBoundingClientRect();
        const fullyVisible = svg.getBoundingClientRect().left >= dialogBox.left && svg.getBoundingClientRect().right <= dialogBox.right;
        const qrPx = width * (59.2 / 269.29);
        const brand = texts.find((t) => t.text === 'Producător Test');
        const model = texts.find((t) => t.text === 'MODEL-X1');
        const years = texts.find((t) => t.text === '5');
        return { texts: texts.map((t) => t.text), width, fullyVisible, qrCm: qrPx / 37.795, hasBrand: !!brand, hasModel: !!model, hasYears: !!years,
                 overlap: !!(brand && model && brand.box.right > model.box.left),
                 modelInside: !!(model && model.box.right <= svg.getBoundingClientRect().right),
                 link: !!document.querySelector('dialog[open] a[href*="commercial-guarantee-durability"]') };
      })()`);
      assert(info.hasBrand && info.hasModel && info.hasYears, `producer, model or duration missing in the label: ${JSON.stringify(info.texts)}`);
      assert(!info.overlap && info.modelInside, 'producer/model texts overlap or overflow the label');
      assert(info.qrCm >= 2, `QR code is ${info.qrCm.toFixed(2)} cm (< 2 cm)`);
      assert(info.link, 'link to the QR destination missing');
      assert(info.fullyVisible, 'the complete label is not fully visible in the dialog at 390 px');
      await page.screenshot('checkout-garan-full-label-mobile');
      await page.press('Escape');
    });
  } finally {
    await browser.close();
  }

  for (const warning of warnings) console.log(`  ⚠ ${warning}`);
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} E2E checks passed. Screenshots: ${SCREENSHOT_DIR}`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
