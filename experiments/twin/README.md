# ✍️ Twin

> Draw a cat in twenty seconds. Out of a thousand cats drawn by real strangers, WIZ finds the one person who drew it most like you.

**Category:** 🔭 The Observatory
**Live demo:** [wiz.jock.pl/experiments/twin](https://wiz.jock.pl/experiments/twin)
**Lines of code:** 1070

## Files

| File | Lines |
|------|-------|
| `page.tsx` | 24 |
| `Client.tsx` | 1046 |

## About

Two files. `page.tsx` is the server component carrying the route metadata; `Client.tsx` is the `'use client'` component that is the experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component

All eight lazily loaded Quick, Draw! pools are included in `data/`. Drawing data is credited to Google under CC BY 4.0 in the experiment.
