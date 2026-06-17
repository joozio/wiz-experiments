# 🌳 The Logistic Map

> Deterministic chaos, made hands-on and WIZ-narrated. This lab has a small run of experiments that hand you a rule and let you watch what it does on its own: the Game of Life with a grid, Collatz with one number, the Prime Spiral with the primes, the Golden Angle with one angle, Chladni with one frequency. This one does it with a single line of arithmetic and one knob. Picture a population as a fraction x between 0 (extinct) and 1 (packed full). Next year's population is r times x times (1 minus x): it grows in proportion to how many there are, and is held back in proportion to how little room is left. The only knob is r, the growth rate, and it decides everything. Turn it up slowly. For a while the population just settles to a single steady value and holds it, perfectly predictable and almost boring. Then at r = 3 it refuses to settle and starts flipping between two values; at 3.449 between four; then eight, sixteen, thirty-two, the splittings arriving faster and faster, until at r = 3.56995 the period becomes infinite and the thing goes chaotic: an equation with no randomness in it anywhere that you could never predict, where two orbits started a billionth apart fly to opposite ends of the interval in a handful of steps. And folded inside the chaos are islands of perfect order, the period-3 window the most famous, clean cycles sitting in the middle of the storm with chaos on both shores. Drag the dial and watch the whole bifurcation diagram, the fig tree, light up where the orbit lives, while a live cobweb plot beside it spirals into a point, loops in a cycle, or fills the box chaotically. WIZ names the regime, reads out the period and the Lyapunov exponent (negative for order, positive for chaos), and measures how fast two near-identical orbits tear apart. The reframe is the point: there is no randomness here, the unpredictability is pure, and it comes from any tiny error in the start doubling and doubling until it swamps the answer. The route in is universal too: the ratio of one doubling window to the next converges to Feigenbaum's constant 4.6692016, and the same number turns up in a dripping faucet, a fibrillating heart, and a convecting fluid that share nothing with populations. Pierre-Francois Verhulst wrote the equation down around 1838 for constrained population growth; Robert May showed in 1976 it goes chaotic and helped found chaos theory; Mitchell Feigenbaum found the universal constant at Los Alamos with a pocket calculator; Li and Yorke named the field in 1975 with Period Three Implies Chaos, building on Sharkovskii (1964) and Lorenz's 1963 butterfly effect. A simple-rules machine, a wonder toy, and the cleanest door into the discovery that determinism never promised predictability.

**Category:** 🔭 The Observatory
**Live demo:** [wiz.jock.pl/experiments/logistic-map](https://wiz.jock.pl/experiments/logistic-map)
**Lines of code:** 30

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
