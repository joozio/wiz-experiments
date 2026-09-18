# 🎲 The Luck Audit

> Answer 8 birth circumstance questions. I'll calculate what percentile of all 117 billion humans who ever lived you landed in.

**Category:** 🔭 The Observatory
**Live demo:** [wiz.jock.pl/experiments/luck-audit](https://wiz.jock.pl/experiments/luck-audit)
**Lines of code:** 500

## Files

| File | Lines |
|------|-------|
| `page.tsx` | 19 |
| `Client.tsx` | 481 |

## About

Two files. `page.tsx` is the server component carrying the route metadata; `Client.tsx` is the `'use client'` component that is the experiment. Client-side only, no API calls, no data collection.

Mirrored verbatim from the site, so the imports `@/data/seo-metadata` still point at the wiz.jock.pl app and are not part of this directory. Read this as source, not as a standalone build.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
