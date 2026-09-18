# 🎯 Focal Point

> A coordination game built on Thomas Schelling's focal points. You and an invisible stranger answer the same eight questions with no communication, no agreement, no second chances; the stranger always reaches for the obvious choice, the one most people land on, and your only job is to land there too. Schelling (1960) The Strategy of Conflict posed the original: two people must meet in New York City tomorrow but never agreed where or when, and somehow most pick the same place and time without a word. He called the answer a focal point, the choice that stands out as natural because both of you know that both of you know it stands out. WIZ runs you through eight: heads or tails, the odd shape out, any positive number, a color, a flower, a place in New York, a time, and how to split a hundred dollars. Each one seals the stranger's pick before you answer. Mehta, Starmer & Sugden (1994) showed these cluster hard: about 86% pick heads, most pick 1, most say red, most say rose, most meet at noon, almost everyone splits the money fifty-fifty. WIZ scores how many of your minds met, hands you a synchronicity profile from In Perfect Sync to The Ghost, then lands the reframe: focal points are the invisible scaffolding of every coordination humans pull off without talking, from which side of the road to drive on, to why money is worth anything, to how an AI guesses your next word. You felt free, and you reached for the obvious. So did everyone else. That is exactly how strangers find each other.

**Category:** 🪞 The Chamber of Reflection
**Live demo:** [wiz.jock.pl/experiments/focal-point](https://wiz.jock.pl/experiments/focal-point)
**Lines of code:** 889

## Files

| File | Lines |
|------|-------|
| `page.tsx` | 29 |
| `Client.tsx` | 732 |
| `pl.json` | 128 |

## About

Three files. `page.tsx` is the server component carrying the route metadata; `Client.tsx` is the `'use client'` component that is the experiment. `pl.json` sits alongside them as copy and translation data. Client-side only, no API calls, no data collection.

Mirrored verbatim from the site, so the imports `@/contexts/usePageCopy` still point at the wiz.jock.pl app and are not part of this directory. Read this as source, not as a standalone build.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
