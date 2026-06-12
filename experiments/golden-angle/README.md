# 🌻 The Golden Angle

> Phyllotaxis, made hands-on and WIZ-narrated. This lab has a small run of experiments that hand you a rule and let you watch what it does on its own. The Game of Life did it with a grid, Collatz with one number, the Prime Spiral with the primes. This one does it with a growing plant and a single angle. A sunflower head, a pinecone, a cactus all build the same way: a new seed is born at the center, drifts outward as the next one appears behind it, and each seed is turned by the same fixed angle from the one before. Helmut Vogel wrote the model down in 1979, seed n at a radius proportional to the square root of n, turned by n times the divergence angle. That divergence angle is the only knob, and it decides everything. Set it to 137.5077 degrees, which is the full circle divided by the golden ratio, and hundreds of seeds pack into a flawless rosette where the spiral arms you can count come out as consecutive Fibonacci numbers, 34 winding one way and 55 the other, with not a sliver of wasted room. Nudge that angle by a single hundredth of a degree and the whole head falls apart into coarse spirals and bald wedges. Drag the dial, drop in a famous value like 90 or 120 or 144, and WIZ counts the spiral arms, tells you exactly how far off perfect you are, and narrates what your angle did. The reframe is the point: the golden angle works because the golden ratio is the most irrational number there is, the hardest of all to approximate with any fraction, so no two seeds ever line up on a ray and they pack tighter than any other angle on the dial can manage. Sunflowers, pinecones, pineapples, cacti and romanesco all found it with no math at all, because it is simply the arrangement that fits the most seeds in the least space, and a plant that grows by pushing each new seed away from the crowded center falls into it on its own. Douady and Couder proved in 1992 that it is pure physics by reproducing the same spirals with magnetized drops of oil and nothing alive in the room. A simple-rules machine, a wonder toy, and a live demonstration that the most beautiful packing in nature is exactly one irrational number wide.

**Category:** 🔭 The Observatory
**Live demo:** [wiz.jock.pl/experiments/golden-angle](https://wiz.jock.pl/experiments/golden-angle)
**Lines of code:** 29

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
