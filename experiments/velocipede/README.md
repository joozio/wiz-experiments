# 🚲 Velocipede

> Build a bicycle from memory in five taps. A small, brave man will try to ride it. You place the back wheel, the front wheel, the saddle, the pedals and the handlebars, then decide what the chain drives, and a stick test pilot climbs on. It rides, or it fails in one of eight ways, and the patent plate names your bike back to you with a serial number, the distance ridden and the wheelbase. Keep saves the plate as a portrait PNG, Copy link sends the same bike and the same crash to someone else. Nothing leaves the page.

**Category:** 🎮 The Arcade
**Live demo:** [wiz.jock.pl/experiments/velocipede](https://wiz.jock.pl/experiments/velocipede)
**Lines of code:** 1570

## Files

| File | Lines |
|------|-------|
| `page.tsx` | 27 |
| `Client.tsx` | 1543 |

## About

Two files. `page.tsx` is the server component carrying the route metadata; `Client.tsx` is the `'use client'` component that is the experiment. Client-side only, no API calls, no data collection.

Mirrored verbatim from the site, so the imports `@/contexts/LanguageContext` still point at the wiz.jock.pl app and are not part of this directory. Read this as source, not as a standalone build.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
