# 🏝️ The Abelian Sandpile

> One rule, a fractal mandala, and the edge of chaos, made hands-on and WIZ-narrated. This lab has a run of experiments that hand you a single dumb rule and let you watch what it does on its own: the Game of Life with a grid, Collatz with one number, Turing Patterns with two chemicals, Diffusion-Limited Aggregation with one wandering particle. This one is just add four and spill. Every cell on a grid holds grains of sand, and the instant a cell holds four or more it topples, handing exactly one grain to each of its four neighbours and keeping the rest; grains that fall off the edge are lost; repeat until nothing is left to topple. Pour a single tall pile of tens of thousands of grains onto the centre and that one rule prints a fractal mandala in perfect four-fold symmetry, self-similar at every scale, that no one designed and nobody has yet fully explained. Then switch to Rain and drop grains one at a time, and the pile organises itself, with no tuning whatsoever, to the exact edge of stability: most grains land and do nothing, then one identical grain triggers an avalanche that crosses the whole grid. The avalanche sizes fall on a live power law, plotted log-log as it builds, the same statistics that govern earthquakes, forest fires, neuronal cascades in the brain, and market crashes. The straw that breaks the camel's back, made literal and measurable. And the deepest twist, the one the model is named for: the final pile is byte-for-byte identical no matter what order you topple the cells in, a theorem you can prove yourself with one button that relaxes the same pile two completely different ways and shows they match. Bak, Tang and Wiesenfeld defined self-organized criticality with this pile in 1987, one of the most cited papers in modern physics; Dhar proved the abelian property and named it in 1990. A live simulation, not a canned picture, and the cleanest proof that the edge between order and collapse is where nature parks itself, unattended.

**Category:** 🔭 The Observatory
**Live demo:** [wiz.jock.pl/experiments/abelian-sandpile](https://wiz.jock.pl/experiments/abelian-sandpile)
**Lines of code:** 34

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
