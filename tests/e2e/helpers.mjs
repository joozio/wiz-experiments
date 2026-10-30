// Shared setup for the browser tests: a static server for the harness export and a Chromium
// that cannot reach anything but that server. Build first: npm run harness:build
import { createReadStream, existsSync, readdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

export const OUT = path.resolve(import.meta.dirname, '../harness/out');

if (!existsSync(path.join(OUT, 'experiments'))) {
  throw new Error('No harness build found. Run `npm run harness:build` first.');
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };

export function serve() {
  const server = createServer((req, res) => {
    let file = path.join(OUT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!file.startsWith(OUT)) return res.writeHead(403).end();
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, base: `http://127.0.0.1:${server.address().port}` })));
}

export const PHONE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };
export const DESKTOP = { viewport: { width: 1280, height: 800 } };

export const LAB = ['twin', 'wave', 'swallow', 'pick-a-seat', 'velocipede', 'namesake', 'reflex', 'encore',
  'focal-point', 'murmuration', 'dungeon-of-opus', 'million-context', 'sonder', 'chladni-figures', 'mind-reader'];

export const allSlugs = () => readdirSync(path.join(OUT, 'experiments')).filter((s) => !s.startsWith('_'));

export async function launch() {
  return chromium.launch();
}

// A context whose pages can only talk to the harness server. `routes` lets a test answer a
// specific external URL itself instead (used to stand in for the wiz.jock.pl API).
export async function context(browser, base, opts = {}, routes = {}) {
  const ctx = await browser.newContext(opts);
  await ctx.route('**/*', (route) => {
    const url = route.request().url();
    for (const [part, body] of Object.entries(routes)) {
      if (url.includes(part)) {
        return route.fulfill({ status: body.status ?? 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body.json) });
      }
    }
    return url.startsWith(base) ? route.continue() : route.abort();
  });
  return ctx;
}

// Errors a visitor would hit. Missing files that only exist on the real site (the
// /experiments index, the /ten-ish game, one font) are not the experiment's fault here.
export function watchErrors(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 200)));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) errors.push(m.text().slice(0, 200));
  });
  return errors;
}

export const bodyText = (page) => page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));

export async function pool(items, size, fn) {
  const queue = [...items];
  await Promise.all(Array.from({ length: size }, async () => {
    while (queue.length) await fn(queue.shift());
  }));
}
