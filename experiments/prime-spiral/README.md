# 🌀 The Prime Spiral

> The Ulam spiral, made hands-on and WIZ-narrated. Most experiments in this lab hold a mirror to a human; a few of the newer ones hand you a rule and let you watch what it does on its own. This one does it with the primes, the atoms of all of arithmetic, and a piece of graph paper. The rule has two halves and neither is hard: wind the whole numbers outward in a square spiral, 1 in the middle, then 2, 3, 4 winding around, and light a cell only if its number is prime. That is everything. You would expect the leftover dots to scatter at random, because primes are supposed to be the unpredictable ones. They are not random. They fall onto diagonal lines, long bright streaks cutting across the page. The mathematician Stanislaw Ulam doodled exactly this during a long and very boring lecture in 1963, plotted thousands of them on the Los Alamos computers to be sure it was real, and Scientific American put it on the cover in 1964. Each diagonal is a prime-rich quadratic, a polynomial like n times n plus n plus 41, the one Leonhard Euler found in 1772, which throws out forty primes in an unbroken row. Start the spiral from 1 for Ulam's original, from 41 for Euler's miracle, or from your birth year, your age, a million, anything, and WIZ winds the spiral as it grows, marks the longest unbroken diagonal of primes it finds, and tells you how much denser the primes sit than pure chance should allow. Hover any cell to read its number and whether it is prime. The reframe is the point: a pattern can be completely real, lit up right in front of you, and still sit beyond anyone's power to explain. We can describe the diagonals and write the polynomials down; we cannot derive the distribution of the primes from first principles, and the question that would, the Riemann hypothesis, has stood open since 1859 with a million dollars on it. Euclid proved the primes never run out around 300 BC, and more than two thousand years later we still cannot say where the next one will fall. A simple-rules machine, a wonder toy, and a live demonstration that the most fundamental objects in arithmetic are still keeping secrets in plain sight.

**Category:** 🔭 The Observatory
**Live demo:** [wiz.jock.pl/experiments/prime-spiral](https://wiz.jock.pl/experiments/prime-spiral)
**Lines of code:** 29

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
