// Phase C: the main interaction of the lab experiments, played the way a new visitor on a
// phone would (390px, touch). Nothing leaves the machine: the one experiment that calls an
// API gets canned answers from the test.
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { PHONE, bodyText, context, launch, serve, watchErrors } from './helpers.mjs';

let server, base, browser;
before(async () => {
  ({ server, base } = await serve());
  browser = await launch();
});
after(async () => {
  await browser.close();
  server.close();
});

async function open(slug, { opts = PHONE, routes = {}, query = '' } = {}) {
  const ctx = await context(browser, base, opts, routes);
  const page = await ctx.newPage();
  const errors = watchErrors(page);
  await page.goto(`${base}/experiments/${slug}/${query}`, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  return { ctx, page, errors, cdp: await ctx.newCDPSession(page) };
}

async function touchDrag(page, cdp, points) {
  const at = ([x, y]) => [{ x, y, id: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: at(points[0]) });
  for (const p of points.slice(1)) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: at(p) });
    await page.waitForTimeout(16);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

const canvasBox = (page) => page.locator('canvas').first().boundingBox();

test('namesake: grows the typed name, remembers it, and opens a shared link', async () => {
  const { ctx, page, errors } = await open('namesake');
  await page.fill('input', 'Anna');
  await page.getByRole('button', { name: /grow/i }).click();
  await page.waitForTimeout(3500);
  assert.match(await bodyText(page), /Anna contorta/);
  await page.reload();
  await page.waitForTimeout(3500);
  assert.match(await bodyText(page), /Anna contorta/);
  await page.goto(`${base}/experiments/namesake/?n=zoe`);
  await page.waitForTimeout(3500);
  assert.match(await bodyText(page), /Zoia radians/);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('velocipede: five taps build a bike that rides, and its link rebuilds it', async () => {
  const { ctx, page, errors } = await open('velocipede', { opts: { ...PHONE, permissions: ['clipboard-read', 'clipboard-write'] } });
  const b = await canvasBox(page);
  for (const [x, y] of [[0.25, 0.62], [0.75, 0.62], [0.42, 0.3], [0.48, 0.6], [0.68, 0.28], [0.25, 0.62]]) {
    await page.touchscreen.tap(b.x + b.width * x, b.y + b.height * y);
    await page.waitForTimeout(500);
  }
  await page.getByRole('button', { name: 'Ride' }).click();
  await page.waitForTimeout(9000);
  assert.match(await bodyText(page), /Distance ridden: [\d.]+ m/);
  await page.getByRole('button', { name: 'Copy link' }).click();
  const link = await page.evaluate(() => navigator.clipboard.readText());
  const code = new URL(link).searchParams.get('b');
  assert.match(code, /^[0-9a-z]{15}[0-3]$/);
  await page.goto(`${base}/experiments/velocipede/?b=${code}`);
  await page.waitForTimeout(2000);
  assert.ok(await page.getByRole('button', { name: 'Ride' }).isVisible());
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('pick-a-seat: eight picks end in a named pattern', async () => {
  const { ctx, page, errors } = await open('pick-a-seat');
  const b = await canvasBox(page);
  const step = async () => (await bodyText(page)).match(/(\d) \/ 8/)?.[1];
  for (let pick = 0; pick < 8; pick++) {
    const before = await step();
    outer: for (let gy = 0.15; gy < 0.9; gy += 0.1) {
      for (let gx = 0.15; gx < 0.9; gx += 0.12) {
        await page.touchscreen.tap(b.x + b.width * gx, b.y + b.height * gy);
        await page.waitForTimeout(250);
        if ((await step()) !== before) break outer;
      }
    }
    await page.waitForTimeout(600);
  }
  await page.waitForTimeout(3000);
  assert.match(await bodyText(page), /Seat No\. \d+/);
  assert.ok(await page.getByRole('button', { name: 'Sit again' }).isVisible());
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('twin: a drawn cat is matched with a stranger', async () => {
  const { ctx, page, errors, cdp } = await open('twin');
  const b = await canvasBox(page);
  const [cx, cy, r] = [b.x + b.width / 2, b.y + b.height / 2, Math.min(b.width, b.height) * 0.25];
  await touchDrag(page, cdp, Array.from({ length: 30 }, (_, i) => [cx + r * Math.cos(i / 29 * 2 * Math.PI), cy + r * Math.sin(i / 29 * 2 * Math.PI)]));
  await touchDrag(page, cdp, [[cx - r * 0.7, cy - r * 0.6], [cx - r * 0.5, cy - r * 1.4], [cx - r * 0.2, cy - r * 0.9]]);
  await touchDrag(page, cdp, [[cx + r * 0.2, cy - r * 0.9], [cx + r * 0.5, cy - r * 1.4], [cx + r * 0.7, cy - r * 0.6]]);
  await page.getByRole('button', { name: 'Done' }).click();
  await page.waitForTimeout(8000);
  assert.match(await bodyText(page), /Out of 1,000 cats, this is the one drawn most like yours/);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('encore: a drawn loop runs and comes back on the next visit', async () => {
  const { ctx, page, errors, cdp } = await open('encore');
  const b = await canvasBox(page);
  await touchDrag(page, cdp, Array.from({ length: 40 }, (_, i) => [b.x + b.width * (0.2 + i * 0.015), b.y + b.height * (0.5 + 0.2 * Math.sin(i / 5))]));
  await page.waitForTimeout(3000);
  assert.match(await bodyText(page), /Loop \w+\. Drawn in [\d.]+s/);
  await page.reload();
  await page.waitForTimeout(2500);
  assert.match(await bodyText(page), /Your last loop is still breathing/);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('focal-point: all eight rounds can be answered', async () => {
  const { ctx, page, errors } = await open('focal-point');
  await page.getByRole('button', { name: /Start the game/ }).click();
  const answers = [
    () => page.getByRole('button', { name: 'Heads' }).click(),
    () => page.getByRole('button', { name: 'a matching shape' }).first().click(),
    '7', 'blue', 'blue',
    () => page.getByRole('button', { name: 'Times Square' }).click(),
    () => page.getByRole('button', { name: '12:00 noon' }).click(),
    '50',
  ];
  for (const a of answers) {
    await page.waitForTimeout(400);
    if (typeof a === 'function') await a();
    else {
      await page.locator('input:visible').first().fill(a);
      await page.getByRole('button', { name: /Lock it in/ }).click();
    }
    await page.waitForTimeout(400);
    const next = page.getByRole('button', { name: /Next question/ });
    if (await next.count()) await next.click();
  }
  assert.match(await bodyText(page), /8 \/ 8/);
  assert.match(await bodyText(page), /The stranger said: \$50/);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('ai-shopping-checker: analysis, then the paid report hands off to checkout', async () => {
  const criteria = Array.from({ length: 12 }, (_, i) => ({ name: `c${i}`, emoji: '*', score: 5, status: 'partial', findings: ['f'], recommendations: ['r'] }));
  let checkoutBody = null;
  const { ctx, page, errors } = await open('ai-shopping-checker', {
    routes: {
      '/api/analyze-store': { json: { url: 'https://shop.example.com', totalScore: 55, grade: 'C', analyzedAt: '', criteria } },
    },
  });
  await ctx.route('**/api/checkout', (route) => {
    checkoutBody = JSON.parse(route.request().postData());
    return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ url: `${base}/` }) });
  });
  await page.fill('input[type=url]', 'https://shop.example.com');
  await page.getByRole('button', { name: 'Analyze' }).click();
  await page.getByText('Detailed Breakdown').waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /Get Full Report/ }).click();
  await page.waitForURL(`${base}/`);
  assert.deepEqual(checkoutBody, { product_id: 'ai-store-readiness-report', store_url: 'https://shop.example.com' });
  assert.deepEqual(errors, []);
  await ctx.close();
});
