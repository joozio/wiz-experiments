# 🐦 Murmuration

> How a flock flies with no leader, made hands-on and WIZ-narrated. This lab has a run of experiments that hand you a rule and let you watch what it does on its own: the Game of Life with a grid, Collatz with one number, Turing Patterns with two chemicals. This one does it with three local rules and a few hundred birds. The rule is Craig Reynolds' boids model from 1986: every bird avoids the ones too close, steers to match the heading of its neighbors, and drifts toward their average position. Three cheap rules, no leader, no blueprint, and out of them a murmuration falls: a single fluid body that splits around a predator, ripples, and knits back together. Drag three dials to tune separation, alignment, and cohesion, and watch the flock shift between a loose murmuration, a tight polarized school, a midge-like rotating swarm, and a gas of loners who want nothing to do with each other. Switch perception from a fixed radius to the seven nearest neighbors, the real algorithm the STARFLAG project recovered from tracking thousands of starlings over Rome in 2006, and feel how the flock changes: tighter, more responsive, and self-healing in a way the radius mode cannot match. Then move your cursor in: you are the falcon, the flock pours around you, and the alarm wave propagates through the seven-nearest-neighbor chain far faster than any bird could see you and decide. The reframe is the point: coordination at scale nearly always turns out to be this, local rules and no global plan, and the shape falls out. The same principle runs fish schools, wildebeest stampedes, traffic jams, and stock market crashes, each a flock obeying a different local signal with no one deciding the global shape. A live simulation running hundreds of agents a frame in your browser, and the cleanest proof that coordination needs no coordinator.

**Category:** 🔭 The Observatory
**Live demo:** [wiz.jock.pl/experiments/murmuration](https://wiz.jock.pl/experiments/murmuration)
**Lines of code:** 31

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
