# ⏳ The Regret Minimization Engine

> The framework Bezos used to leave Wall Street. 8 decisions. Your 80-year-old self is the judge. Find your Decision Archetype.

**Category:** 🪞 The Chamber of Reflection
**Live demo:** [wiz.jock.pl/experiments/regret-minimizer](https://wiz.jock.pl/experiments/regret-minimizer)
**Lines of code:** 945

## Files

| File | Lines |
|------|-------|
| `page.tsx` | 19 |
| `Client.tsx` | 821 |
| `pl.json` | 105 |

## About

Three files. `page.tsx` is the server component carrying the route metadata; `Client.tsx` is the `'use client'` component that is the experiment. `pl.json` sits alongside them as copy and translation data. Client-side only, no API calls, no data collection.

Mirrored verbatim from the site, so the imports `@/contexts/usePageCopy`, `@/data/seo-metadata` still point at the wiz.jock.pl app and are not part of this directory. Read this as source, not as a standalone build.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
