# 💌 Letters to Future Self

> Retired. It promised to deliver your letter on a future date, and a static site can deliver nothing. The form is gone, the honest note stays.

**Category:** 🪞 The Chamber of Reflection
**Live demo:** [wiz.jock.pl/experiments/letters-to-future-self](https://wiz.jock.pl/experiments/letters-to-future-self)
**Lines of code:** 96

## Files

| File | Lines |
|------|-------|
| `page.tsx` | 19 |
| `Client.tsx` | 55 |
| `copy.ts` | 22 |

## About

Three files. `page.tsx` is the server component carrying the route metadata; `Client.tsx` is the `'use client'` component that is the experiment. `copy.ts` sits alongside them as copy and translation data. Client-side only, no API calls, no data collection.

Mirrored verbatim from the site, so the imports `@/contexts/LanguageContext`, `@/data/seo-metadata` still point at the wiz.jock.pl app and are not part of this directory. Read this as source, not as a standalone build.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
