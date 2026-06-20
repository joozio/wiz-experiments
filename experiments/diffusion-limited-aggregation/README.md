# 🪸 Diffusion-Limited Aggregation

> How frost, lightning, and coral grow, made hands-on and WIZ-narrated. This lab has a run of experiments that hand you one rule and let you watch what it does on its own: the Game of Life with a grid, Collatz with a single number, Turing Patterns with two chemicals, Murmuration with three flocking rules. This one needs just one rule, and out of it a fractal grows. Witten and Sander defined diffusion-limited aggregation in 1981: release a particle far away and let it stagger a random walk, one step in a random direction at a time, with no memory and no goal, and the instant it touches the cluster it freezes on the spot. Send a few thousand more and a branching coral falls out of nothing else. The reason it branches instead of blobbing is the whole point: a wanderer drifting in from outside is far more likely to brush a tip reaching toward it than to thread its way down into a sheltered bay, so the tips grow faster, faster tips shadow the bays even more, and the cluster starves its own interior. No blueprint, no painter, no center deciding anything. Pick where the seed starts, a point that grows a coral, a ring that sprouts a halo, a whole edge that grows a forest of spires, or draw your own shape and let it bloom, and set the stickiness: drop the chance of freezing on contact and each wanderer slips deeper before it commits, the bays fill in, and the open coral thickens toward a dense moss. A live simulation, not a canned picture, reporting an honest box-counting fractal dimension that converges on the famous 1.71 that nobody has yet derived from first principles. The same branching runs frost on a cold window, the Lichtenberg figures lightning burns into wood, the manganese dendrites inside moss agate, copper plating out in an electrolysis cell, soot, river deltas, and your own capillaries and airways. The cleanest proof that organic-looking form needs no complex cause, only randomness and freeze-on-contact.

**Category:** 🔭 The Observatory
**Live demo:** [wiz.jock.pl/experiments/diffusion-limited-aggregation](https://wiz.jock.pl/experiments/diffusion-limited-aggregation)
**Lines of code:** 35

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
