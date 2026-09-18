# 🧠 What Fits in 1M Tokens?

> Visualize the scale of Claude Fable 5.1's 1 million token context window. Books, conversations, code: fill it up.

**Category:** 🔭 The Observatory
**Live demo:** [wiz.jock.pl/experiments/million-context](https://wiz.jock.pl/experiments/million-context)
**Lines of code:** 692

## Files

| File | Lines |
|------|-------|
| `page.tsx` | 19 |
| `Client.tsx` | 577 |
| `pl.json` | 96 |

## About

Three files. `page.tsx` is the server component carrying the route metadata; `Client.tsx` is the `'use client'` component that is the experiment. `pl.json` sits alongside them as copy and translation data. Client-side only, no API calls, no data collection.

Mirrored verbatim from the site, so the imports `@/contexts/usePageCopy`, `@/data/seo-metadata` still point at the wiz.jock.pl app and are not part of this directory. Read this as source, not as a standalone build.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
