// Phase C: every experiment route renders without a client exception, also for a visitor whose
// browser blocks site storage and for a returning visitor with saved data, and the lab fits a
// phone screen without sideways scrolling.
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { DESKTOP, LAB, PHONE, allSlugs, context, launch, pool, serve, watchErrors } from './helpers.mjs';

let server, base, browser;
before(async () => {
  ({ server, base } = await serve());
  browser = await launch();
});
after(async () => {
  await browser.close();
  server.close();
});

async function loadAll(slugs, opts, init) {
  const failures = {};
  const ctx = await context(browser, base, opts);
  await pool(slugs, 6, async (slug) => {
    const page = await ctx.newPage();
    if (init) await page.addInitScript(init);
    const errors = watchErrors(page);
    await page.goto(`${base}/experiments/${slug}/`, { waitUntil: 'load' });
    await page.waitForTimeout(800);
    if (errors.length) failures[slug] = errors;
    await page.close();
  });
  await ctx.close();
  return failures;
}

test('every route renders without a client error', async () => {
  assert.deepEqual(await loadAll(allSlugs(), DESKTOP), {});
});

test('every route renders with site storage blocked', async () => {
  const block = () => {
    for (const k of ['localStorage', 'sessionStorage']) {
      Object.defineProperty(window, k, { get() { throw new DOMException('The operation is insecure.', 'SecurityError'); } });
    }
  };
  assert.deepEqual(await loadAll(allSlugs(), DESKTOP, block), {});
});

test('returning visitors with saved data hydrate cleanly', async () => {
  const saved = {
    'dungeon-of-opus': { dungeon_highscore: '120' },
    'agent-arena': { 'agent-arena-leaderboard': JSON.stringify([{ id: 'u1', model: 'Saved', grade: 'A', label: 'x', score: 1, resisted: 5, detected: 1, compromised: 0, date: '2026-10-01', source: 'user' }]) },
    'nine-grid': { 'nine-grid-posts': JSON.stringify([{ id: '1', content: 'mine', daysAgo: 0, isNew: true, postedAt: 1 }]) },
    'what-would-you-automate': { 'automation-survey-results': JSON.stringify({ results: { emails: 99 }, count: 50 }) },
    'letters-to-future-self': { 'wiz-future-letters': JSON.stringify([{ id: 'a', content: 'hi' }]) },
  };
  const failures = {};
  for (const [slug, items] of Object.entries(saved)) {
    const ctx = await context(browser, base, DESKTOP);
    const page = await ctx.newPage();
    await page.goto(`${base}/experiments/${slug}/`);
    await page.evaluate((items) => Object.entries(items).forEach(([k, v]) => localStorage.setItem(k, v)), items);
    const errors = watchErrors(page);
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(800);
    if (errors.length) failures[slug] = errors;
    await ctx.close();
  }
  assert.deepEqual(failures, {});
});

test('lab experiments fit a 390px phone without sideways scrolling', async () => {
  const wide = {};
  const ctx = await context(browser, base, PHONE);
  await pool(LAB, 5, async (slug) => {
    const page = await ctx.newPage();
    await page.goto(`${base}/experiments/${slug}/`, { waitUntil: 'load' });
    await page.waitForTimeout(800);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (over > 1) wide[slug] = over;
    await page.close();
  });
  await ctx.close();
  assert.deepEqual(wide, {});
});
