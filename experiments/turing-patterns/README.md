# 🐆 Turing Patterns

> How a leopard gets its spots, made hands-on and WIZ-narrated. This lab has a small run of experiments that hand you a rule and let you watch what it does on its own: the Game of Life with a grid, Collatz with one number, the Golden Angle with one angle, Chladni with one frequency, the Logistic Map with one growth rate. This one does it with two invisible chemicals on a dish and two knobs. Every cell of the dish holds two substances, U and V. Four things happen to them over and over: both spread into their neighbors with U diffusing twice as fast as V, wherever they meet two V plus one U react to make three V so V eats U and copies itself, U is fed in from outside at a feed rate, and V is removed at a kill rate. That is the whole chemistry, and out of it, from a flat almost featureless start, the dish paints spots, stripes, a maze, branching coral, or dots that swell and split in two like dividing cells. The only thing that decides which animal you get is two numbers, the feed rate and the kill rate. Drag them across the map and a leopard becomes a labyrinth becomes a turbulent boil that never holds still, and WIZ names the region you are in, measures how much of the dish V has covered, and tells you whether the field has locked into place or is still alive and churning. You can even paint your own seed onto the dish, but the rule erases it: it settles into its pattern, not yours, decided before you touched it. The reframe is the point. A leopard starts as a single cell that divides into a ball of identical cells, all carrying the same DNA, with nothing labelled spot here or stripe there, and yet it grows the same markings in roughly the same places every time with no architect and no blueprint. Turing showed the pattern does not need a painter: take two reacting chemicals where one spreads faster than the other and a flat even mix is secretly unstable, so the tiniest wobble gets amplified into peaks and valleys at a fixed spacing set entirely by the reaction rates, and that spacing is the pattern. Wide spacing on a small animal gives spots, the same chemistry on a long thin tail gives rings, which is exactly why spotted cats so often have striped tails and no striped cat has a spotted one. The same math turns up in real chemistry in the Belousov-Zhabotinsky reaction, in the ridges of your own fingerprints, in the spacing of hair follicles, and in the stripes a zebrafish actually grows and rearranges as it gets bigger. Alan Turing, the man who cracked Enigma and laid the foundations of computing, wrote it down in 1952 in The Chemical Basis of Morphogenesis, his last major paper before he died in 1954, working the equations by hand and on one of the first computers he had helped build. It is a live Gray-Scott reaction-diffusion simulation running thousands of cells a frame in your browser, no image loaded and nothing drawn, just two numbers and a rule. A simple-rules machine, a wonder toy, and a live demonstration that structure was never something life had to design: sometimes it just has to let go and let the chemistry fall into shape.

**Category:** 🔭 The Observatory
**Live demo:** [wiz.jock.pl/experiments/turing-patterns](https://wiz.jock.pl/experiments/turing-patterns)
**Lines of code:** 29

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
