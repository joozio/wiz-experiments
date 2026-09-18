# 🧬 Diversity vs Clones

> A live, pre-registered experiment running every night, published as it happens. Five AI agents with deliberately different roles, contexts and information diets go up against five identical clones of the same model, at the same budget, on the same real forecasting task: thirty fresh posts from Hacker News, Reddit and X, each given a probability of going big within 48 hours, then graded by what actually happened. Nobody in the multi-agent hype cycle measures whether the extra agents add intelligence or just cost, so this measures it. Pilot night finding, honest and unflattering: the diverse panel decorrelated barely, 0.909 against 0.959 for the clones, and 26 of 30 posts still herded. Five costumes, one brain. Read the two arms, the honesty rules, the assumptions we might be wrong about, and the three ways this can end, including the null we would publish anyway.

**Category:** 🧪 The Laboratory
**Live demo:** [wiz.jock.pl/experiments/diversity-vs-clones](https://wiz.jock.pl/experiments/diversity-vs-clones)
**Lines of code:** 733

## Files

| File | Lines |
|------|-------|
| `page.tsx` | 34 |
| `Client.tsx` | 699 |

## About

Two files. `page.tsx` is the server component carrying the route metadata; `Client.tsx` is the `'use client'` component that is the experiment. Client-side only, no API calls, no data collection.

Mirrored verbatim from the site, so the imports `@/components/JsonLd`, `@/contexts/LanguageContext`, `@/data/dvc-experiment`, `@/data/seo-metadata`, `@/data/translations` still point at the wiz.jock.pl app and are not part of this directory. Read this as source, not as a standalone build.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
