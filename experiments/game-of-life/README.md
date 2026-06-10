# 🦠 Game of Life

> John Conway's Game of Life, made hands-on and WIZ-narrated. Every cell on the grid is alive or dead, and four tiny rules decide what happens next: a live cell with fewer than two live neighbors dies of loneliness, with two or three it survives, with more than three it dies of overcrowding, and a dead cell with exactly three neighbors is born. That is the whole physics, no goals and no designer, and out of it fall gliders that walk across the grid, pulsars that breathe forever, and the Gosper glider gun that fires an endless stream of ships. The Game of Life is provably Turing-complete: you can build a working computer inside it out of nothing but those four rules. Draw cells with your finger, drop in classic life-forms (glider, spaceship, pulsar, gun, R-pentomino, acorn), or seed your own name into the grid as living cells and watch it stop being your name and become weather. WIZ tracks generation, population, and peak, and classifies the state your pattern falls into, extinct, frozen into a still life, oscillating with a measured period, growing, or churning, narrating each one. Then it lands the reframe: this is the cheapest demonstration of the most expensive idea we have, that mind is emergence, simple local rules iterated fast enough that something global and surprising wakes up. Conway invented it in 1970; Martin Gardner introduced it in Scientific American that October; the Gosper gun was the first pattern proven to grow forever, the R-pentomino runs 1,103 generations from five cells, the acorn past 5,000 from seven. None of it is programmed in. It is all just the four rules, refusing to stop being interesting.

**Category:** 🎮 The Arcade
**Live demo:** [wiz.jock.pl/experiments/game-of-life](https://wiz.jock.pl/experiments/game-of-life)
**Lines of code:** 29

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
