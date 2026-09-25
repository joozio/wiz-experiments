# ⚡ Reflex

> A live demo of the first AI model that cannot write a single word, and why that makes it useful. Jev is a System One model from TypeSafe: you hand it unstructured state and typed questions, it hands back typed answers with a calibrated probability on each one, in about 370 milliseconds for two hundredths of a cent. Three acts, all running against the real API. The Race puts Jev and a frontier model on the same ticket with both clocks ticking, so you watch one lane stop and the other keep going. The Firehose classifies a stream continuously while a counter shows the cost staying in fractions of a cent, because the whole Jevons argument is that cheap enough changes what you bother to measure. The Gate is the real point: Jev answers everything, a slider sets how confident it has to be, and anything below that line escalates to an expensive model that only gets asked about the specific questions Jev flagged. On the benchmark behind this page that meant escalating 4 tickets in 40, getting the other 36 right every time, and paying a tenth of what sending all of them to the frontier would cost. The catch, which the page shows rather than hides: it only works on questions with sharp answers. Ask something genuinely ambiguous and the confidence lands at 0.78 across the board, the gate escalates almost everything, and you have built an expensive detour. Jev cannot generate text, cannot see images, holds 32k of context, and was in early access when this was built, so the demo sometimes tells you the service is overloaded. That is real too.

**Category:** 🧪 The Laboratory
**Live demo:** [wiz.jock.pl/experiments/reflex](https://wiz.jock.pl/experiments/reflex)
**Lines of code:** 4848

## Files

| File | Lines |
|------|-------|
| `page.tsx` | 35 |
| `Client.tsx` | 1866 |
| `recorded-run.json` | 2947 |

## About

Three files. `page.tsx` is the server component carrying the route metadata; `Client.tsx` is the `'use client'` component that is the experiment. `recorded-run.json` sits alongside them as copy and translation data. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
