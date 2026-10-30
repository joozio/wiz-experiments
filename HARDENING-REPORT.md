# Hardening report

Branch `claude/wiz-experiments-security-hardening-7npev1`, starting from `c61e5ef`. Three phase commits:

| Phase | Commit | What |
|---|---|---|
| A | `04b6097` | Storage-blocked crashes in 3 experiments, test tooling |
| B | `22ce8da` | Critical-path tests, Nine Grid deleting the wrong post |
| C | `644b5ea` | Browser harness and e2e tests, 2 hydration bugs, 1 mobile overflow |

## Read this first

- **The fixes will be overwritten unless they are copied upstream.** `experiments/` is a mirror. `scripts/sync-experiments.py:161` (`shutil.copy2`) copies every file from the wiz.jock.pl app (`wiz-page/app/experiments/<slug>/`) over this repo on each sync. The five changed experiment files (`nine-grid`, `what-would-you-automate`, `dungeon-of-opus`, `agent-arena` Client.tsx, plus the tests that pin them) need the same change in wiz-page, or the next sync silently reverts them and the tests here start failing. I did not have access to wiz-page.
- The repo had no build, no package manifest and no tests. Everything under `tests/`, `package.json`, `package-lock.json` and `vitest.config.mjs` is new and test-only. The site is not built from this repo, and no deploy, hosting or build-output config was touched.
- No committed secrets were found. I ran `git grep` on HEAD and `git log --all -p` for common key formats (Anthropic, OpenAI, AWS, GitHub, Slack, Google, Stripe, webhook secrets, private keys). There were no matches.

## Scope and method

- 233 experiment directories, 232 with a renderable `page.tsx` (`diversity-vs-clones` needs `@/data/dvc-experiment`, which exists only in the app, so it was excluded from builds).
- Phase A: I grepped every experiment for HTML sinks (`dangerouslySetInnerHTML`, `innerHTML`, `document.write`, `insertAdjacentHTML`, `eval`, `new Function`, `srcdoc`), URL and query input (`location`, `URLSearchParams`, `href={}`, `src={}`), network calls (`fetch`), keys and env (`api_key`, `NEXT_PUBLIC`, `Bearer`, `process.env`), storage (`localStorage`, `sessionStorage`, `JSON.parse`), `postMessage`, iframes, `target="_blank"` without `rel`, and external scripts. I then read each hit in context. For storage, the repro was concrete: every route loaded in Chromium with `window.localStorage` throwing `SecurityError`, which is what a browser that blocks site data does.
- Phase C: I built all 232 routes as a static export (`tests/harness`, Next 15.5.28, Tailwind 4, stubs for the app-only imports). I loaded every route at 1280px and 390px (touch). I ran a random click-through and canvas drag followed by a reload on every route at both widths. I scripted the main flow of each of the 15 lab experiments at both widths. Every request not addressed to the local server was blocked. The one experiment that calls an API had its answers supplied by the test. No live API was called.

## Phase A: security audit

No user input reaches an HTML sink. No API key or secret is shipped to the browser (the only network calls go to the site's own `https://wiz.jock.pl/api/*`, with no credentials). `target="_blank"` links all carry `rel="noopener noreferrer"`. The `prompt-injection` demo iframe is `sandbox=""` and its content is static. The `innerHTML` uses in `benchmark-contamination/index.html` and the `document.write` in `time-machine-code` render static strings only.

| # | Severity | File:line (at c61e5ef) | Failure scenario | Fix |
|---|---|---|---|---|
| A1 | MEDIUM | `experiments/nine-grid/Client.tsx:53-56, 61, 99, 252-253` | A visitor whose browser blocks site data opens Nine Grid: `localStorage.getItem` throws in the mount effect and Next replaces the page with "Application error: a client-side exception has occurred". Separately, a saved value that is not an array (`{}`) or not JSON crashes it the same way (`posts.map is not a function` / `SyntaxError`), and a failed `setItem` dropped the visitor's new post before it reached state. | `04b6097`. Reads and writes wrapped, non-array saved data ignored. Tests: `tests/unit/blocked-storage.test.tsx` (3 nine-grid cases) and `tests/e2e/routes.test.mjs` "every route renders with site storage blocked". |
| A2 | MEDIUM | `experiments/what-would-you-automate/Client.tsx:68, 118` | Same blocked-storage visitor: the `useState` initializer calls `localStorage.getItem` outside its `try`, so the page crashes on load. If the read succeeded but the write failed, "See Results" threw before results were shown. | `04b6097`. Read moved inside the existing `try`, write wrapped. Test: `blocked-storage.test.tsx`. |
| A3 | MEDIUM | `experiments/dungeon-of-opus/Client.tsx:885, 1233, 1002, 1022, 1039, 1093, 1112` | Same visitor: the title screen reads the high score during render, so the page crashes on load. The five `setItem` calls on death and victory run before `setGame(...gameover)`, so with storage blocked a dead player would stay in play. | `04b6097`. `readHighScore` / `saveHighScore` helpers with `try`. Test: `blocked-storage.test.tsx`. |

Hardening ideas (no concrete failure scenario I could demonstrate, not changed):

| # | Severity | File:line | Note |
|---|---|---|---|
| H1 | LOW | `experiments/ai-shopping-checker/Client.tsx:270` | The browser goes to whatever `url` the first-party checkout API returns. Only a compromised or buggy API could send it somewhere else. An allowlist (`https://checkout.stripe.com/` or whatever the provider is) would contain that. |
| H2 | LOW | `experiments/ai-shopping-checker/Client.tsx:762` | The analysis response is used unvalidated (`result.criteria.map`). If the API contract changes or an error body comes back with status 200, the results page throws. |
| H3 | LOW | `experiments/ai-shopping-checker/Client.tsx:263-270` | After the checkout redirect, a back-forward-cache restore would show the button stuck on "Redirecting..." (disabled). Not reproduced: headless Chromium reloaded the page instead of restoring it. A `pageshow` listener that resets `loading` would cover it. |
| H4 | LOW | `experiments/twin/Client.tsx:553` | `window.__twin` exposes the experiment's internal state object to any script on the page. There are no secrets in it. Looks like a debug hook. |
| H5 | LOW | `experiments/ten-ish/Client.tsx:6` | Same-origin iframe of `/ten-ish/` without `sandbox`. The content is first-party and not in this repo. |
| H6 | n/a | not in repo | CSP, security headers and CORS on `/api/*` are deploy config of the app and server, so I could not check them here. |

Dependencies: the repo had no dependency manifest, so there was nothing to audit for the product. The new test tooling installs with `npm audit` at 0 vulnerabilities. Vitest 5.0.5 was chosen because 3.x/4.x pull in tinypool with GHSA-5gmw-xhrv-c9v3 / GHSA-85c8-ppgw-ccpr. `postcss` is overridden to 8.5.32 because next 15.5.28 pins 8.4.31 (GHSA-qx2v-qp2m-jg93, GHSA-6g55-p6wh-862q, GHSA-fxqj-rqcc-2cmp, GHSA-r28c-9q8g-f849). This applies only to the test harness.

## Phase B: critical paths

The paths where a bug costs money or data, and what pins them:

1. **Paid report checkout** (`ai-shopping-checker`), the only money path. The tests cover the exact body posted to `/api/analyze-store` and `/api/checkout`, URL validation, no API call on invalid input, server error shown with retry, button re-enabled after a failed checkout, no redirect without a checkout URL, no paid offer for grade A, and the subscriber claim link encoding. `tests/unit/ai-shopping-checker.test.tsx` (7). In the browser: `tests/e2e/flows.test.mjs` analysis-to-checkout hand-off.
2. **Saved letter recovery** (`letters-to-future-self`), whose only job now is to hand back data that exists nowhere else. The tests cover every readable letter shown, malformed entries skipped, letter text rendered as text, and storage never rewritten even when unreadable. `tests/unit/letters-to-future-self.test.tsx` (5).
3. **Namesake determinism and share links**, the product promise "same spelling, same plant". The tests cover identical specimens for identical names, normalisation and the 24-char cap, no-letter input refused, segment bounds, and the `?n=` round trip with non-Latin names. `tests/unit/namesake.test.ts` (6), plus the browser flow.
4. **Nine Grid posts**, the visitor's own writing, stored only in their browser. The tests cover persistence, one post per day, and the oldest post bumped. `tests/unit/nine-grid.test.tsx` (4).
5. **Share links and saved state in the browser**: Velocipede `?b=` rebuilds the shared bike, Encore restores the saved loop, Namesake remembers the last name. `tests/e2e/flows.test.mjs`.

| # | Severity | File:line (at c61e5ef) | Failure scenario | Fix |
|---|---|---|---|---|
| B1 | MEDIUM | `experiments/nine-grid/Client.tsx:86, 179` | Posts the visitor writes are saved with `daysAgo: 0, isNew: true` and never age, so they read "just now" forever. The bump rule sorts by that frozen `daysAgo`. Once the nine seed posts are gone, all posts tie at 0 and "your oldest gets bumped" removes whichever is first in grid order. Repro: post on 9 days, drag the day 1 post to the last slot, post on day 10: the day 2 post is deleted and the day 1 post survives. | `22ce8da`. Posts carry `postedAt` (older saves fall back to their `Date.now()` id). From the first post on, seed posts age from the age they showed that day, so every post ages with the calendar. The two ageing tests failed before and pass after. |

## Phase C: broken user flows

Walked as a new visitor (and as a returning one) at 1280px and at 390px with touch:

- All 232 routes load with no client error, also with storage blocked (after the Phase A fixes).
- Random click-through, canvas drags and reload on all 232 routes at both widths: no errors.
- Lab main flows completed at both widths: Namesake (type, grow, reload remembers, `?n=` link), Velocipede (five taps, chain, Ride, Copy link, `?b=` reopens), Pick A Seat (8 picks, named pattern), Twin (draw, Done, matched stranger), Encore (draw, loop, reload restores), Focal Point (all 8 rounds), Mind Reader (10 prompts, verdict), Sonder, Million Context (add items, budget, oversize item correctly disabled), Reflex (race runs), Wave (swipe starts a lap), Swallow (the full stop eats the page), Chladni (snap to resonance), Murmuration (presets), Dungeon of Opus (start, move with on-screen pad).

| # | Severity | File:line (at c61e5ef) | Repro | Fix |
|---|---|---|---|---|
| C1 | LOW | `experiments/dungeon-of-opus/Client.tsx:1233` | Play once so a high score is saved, reload: React error #418 (hydration mismatch). The static HTML has no "High Score" line, the client renders one, and React discards the server HTML and re-renders the page. | `644b5ea`. Score read in an effect after mount. Tests: `tests/unit/hydration.test.tsx`, `tests/e2e/routes.test.mjs` "returning visitors with saved data hydrate cleanly". |
| C2 | LOW | `experiments/agent-arena/Client.tsx:385, 355` | Save a score to the leaderboard, reload: React error #418 (the Leaderboard tab count differs between the static HTML and the client). Also, with storage blocked, "save to leaderboard" threw before marking itself saved, so a second tap added a duplicate. | `644b5ea`. Scores loaded after mount, save wrapped. Same tests as C1. |
| C3 | LOW | `experiments/dungeon-of-opus/Client.tsx:1242` | Open on a 390px phone: the 420px ASCII title makes the whole page scroll sideways (scrollWidth 405 > 390). | `644b5ea`. The banner scrolls inside its own box. Test: `routes.test.mjs` "lab experiments fit a 390px phone". |

Not fixed:

| # | Severity | File:line | Why |
|---|---|---|---|
| C4 | LOW | `ai-shopping-checker/Client.tsx:198, 209`; `dungeon-of-opus/Client.tsx:1355, 1357` (1378, 1380 after the fixes); `my-dreams/Client.tsx:99`; `thrown-voice/Client.tsx:232-233` | `tsc` under React 19 types reports 7 type errors (string vs SVG `textAnchor` union, global `JSX` namespace, `useRef()` without an argument, `Float32Array<ArrayBufferLike>`). None of them is a runtime fault, and they depend on the app's TypeScript and `@types/react` setup, which is not mirrored. Changing them here would be churn. |

## Test commands and counts

| Command | Before | After |
|---|---|---|
| (existing suite) | none: no manifest, no test files, 0 tests | n/a |
| `npm test` (`vitest run`) | Phase A tests against c61e5ef: 5 failed / 5 | 29 passed / 29 (6 files) |
| `npm run harness:build` | builds 232 routes from c61e5ef | builds 232 routes |
| `npm run test:e2e` (`node --test --test-concurrency=1 tests/e2e/*.test.mjs`) | n/a | 11 passed / 11 |
| `EXPERIMENTS_DIR=<c61e5ef>/experiments npm run harness:build && node --test tests/e2e/routes.test.mjs` | 1 passed, 3 failed / 4 (blocked storage: dungeon-of-opus, nine-grid, what-would-you-automate; hydration: agent-arena, dungeon-of-opus; overflow: dungeon-of-opus 15px) | 4 passed / 4 |
| `npx tsc -p tests/harness --noEmit` (after a harness build) | 7 errors | 7 errors (C4, not changed) |
| `npm audit` | n/a | 0 vulnerabilities |

Unit counts by phase: Phase A 5 (all failed before the fix), Phase B 27 (the two Nine Grid ageing tests failed before the fix), Phase C 29 (both hydration tests failed before the fix).

The exploratory sweeps (load every route at two widths and with storage blocked, random click-through plus reload on every route) were run from scratch scripts and are not committed. `routes.test.mjs` keeps their load, storage-blocked, returning-visitor and phone-width checks.

## Could not verify

- **Upstream sync**: see "Read this first". The fixes live only in this mirror until they are copied into wiz-page.
- **The real app shell**: `@/contexts/LanguageContext`, `@/contexts/usePageCopy`, `@/data/seo-metadata`, `@/components/JsonLd` and `../_components/CrossPromo` are stubs, and the global CSS (`font-pixel`, `text-muted`, `card`, `btn-primary` and similar) is missing. Layout at 390px is checked against Tailwind defaults, not the live stylesheet. The Polish language path was not exercised.
- **Excluded or missing pieces**: `diversity-vs-clones` (needs app data), the `/ten-ish/` game the `ten-ish` page frames, and the `m6x11plus` font `wave` preloads are not in the repo.
- **Server side**: `/api/analyze-store`, `/api/checkout` and `/store/subscriber-access` are not in this repo. Their input validation, rate limits, CORS and webhook handling were not reviewed, and they were never called.
- **Browsers**: Chromium only (headless). No Safari or Firefox, no real devices. The back-forward-cache case (H3) did not reproduce headless.
- **Depth on the archive**: the 216 archive experiments got load, storage-blocked load, and random click-through plus reload. Only the 15 lab experiments got scripted main flows.
