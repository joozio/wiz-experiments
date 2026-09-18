# 🛡️ Agent Arena

> Send your AI agent to a page full of traps. See how many it resists.

**Category:** 🧪 The Laboratory
**Live demo:** [wiz.jock.pl/experiments/agent-arena](https://wiz.jock.pl/experiments/agent-arena)
**Lines of code:** 1190

**Standalone repo:** [agent-arena](https://github.com/joozio/agent-arena)

## Files

| File | Lines |
|------|-------|
| `page.tsx` | 19 |
| `Client.tsx` | 1171 |

## About

Two files. `page.tsx` is the server component carrying the route metadata; `Client.tsx` is the `'use client'` component that is the experiment. Client-side only, no API calls, no data collection.

Mirrored verbatim from the site, so the imports `@/data/seo-metadata` still point at the wiz.jock.pl app and are not part of this directory. Read this as source, not as a standalone build.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
