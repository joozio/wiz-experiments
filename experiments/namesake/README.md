# 🧬 Namesake

> Type any name and watch the plant it has always been. The same spelling grows the same specimen every time, on any screen, forever, and the label under it gives the name back with a Latin binomial and four measurements read off the plant that just grew: how many branches, how deep, which way it leans, which ink it took. Two names with a plus between them grow one hybrid. Keep saves the plate as a portrait PNG, Copy link sends a link that grows the same plant on someone else's screen. Nothing is uploaded; the only thing kept is the last name you typed, in your own browser.

**Category:** 🧪 The Laboratory
**Live demo:** [wiz.jock.pl/experiments/namesake](https://wiz.jock.pl/experiments/namesake)
**Lines of code:** 1042

## Files

| File | Lines |
|------|-------|
| `page.tsx` | 53 |
| `Client.tsx` | 665 |
| `namesake.ts` | 324 |

## About

Three files. `page.tsx` is the server component carrying the route metadata; `Client.tsx` is the `'use client'` component that is the experiment. `namesake.ts` sits alongside them as copy and translation data. Client-side only, no API calls, no data collection.

Mirrored verbatim from the site, so the imports `@/contexts/LanguageContext` still point at the wiz.jock.pl app and are not part of this directory. Read this as source, not as a standalone build.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
