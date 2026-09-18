# 🌀 Encore

> Draw one line and watch it get a second career. Encore records your stroke as you make it: the path, the speed, every hesitation, exactly where your hand slowed down and where it ran. On lift it replays that stroke as up to 240 phase shifted copies receding down a tunnel, each one smaller, brighter and turned a little further than the one in front. Colour is not decoration and not random: hue runs mint to lime to coral along the stroke, and violet appears only where you turned fast, so a confident sweep and a nervous scratch come out looking like different species. Where you paused, the tunnel wall bulges. The copy count changes the geometry rather than just the density, so sixty copies is a short fat fan of separate blades and two hundred and forty is a long corridor receding into a dark eye. Three controls, Copies, Drift and Decay, and one button that keeps a square PNG with the loop id and the seconds you spent drawing it. The loop id is hashed from the shape alone, so the same line drawn twice on the same screen comes back with the same name, though a phone and a desktop measure that shape differently and can name it differently. It is deliberately flattering to bad input: a shaky nine point scribble produces the most sculpted object on the page, which is the whole argument for the thing. Nothing is uploaded, nothing is scored, nothing is kept anywhere but your own browser.

**Category:** 🎮 The Arcade
**Live demo:** [wiz.jock.pl/experiments/encore](https://wiz.jock.pl/experiments/encore)
**Lines of code:** 933

## Files

| File | Lines |
|------|-------|
| `page.tsx` | 25 |
| `Client.tsx` | 908 |

## About

Two files. `page.tsx` is the server component carrying the route metadata; `Client.tsx` is the `'use client'` component that is the experiment. Client-side only, no API calls, no data collection.

Mirrored verbatim from the site, so the imports `@/contexts/LanguageContext` still point at the wiz.jock.pl app and are not part of this directory. Read this as source, not as a standalone build.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
