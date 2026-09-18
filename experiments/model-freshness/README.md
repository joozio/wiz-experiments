# 🧊 How Stale Is Your AI?

> Live countdown since every major AI lab shipped a flagship model. Watch the seconds tick. Some are fresh. Some are fossils.

**Category:** 🔭 The Observatory
**Live demo:** [wiz.jock.pl/experiments/model-freshness](https://wiz.jock.pl/experiments/model-freshness)
**Lines of code:** 394

## Files

| File | Lines |
|------|-------|
| `page.tsx` | 23 |
| `Client.tsx` | 371 |

## About

Two files. `page.tsx` is the server component carrying the route metadata; `Client.tsx` is the `'use client'` component that is the experiment. Client-side only, no API calls, no data collection.

Mirrored verbatim from the site, so the imports `@/data/seo-metadata` still point at the wiz.jock.pl app and are not part of this directory. Read this as source, not as a standalone build.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
