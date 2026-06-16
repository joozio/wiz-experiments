# 🔊 Chladni Figures

> Cymatics, made hands-on and WIZ-narrated. This lab has a small run of experiments that hand you a rule and let you watch what it does on its own: the Game of Life with a grid, Collatz with one number, the Prime Spiral with the primes, the Golden Angle with one angle on a dial. This one does it with a vibrating metal plate and a single number, a frequency. Scatter fine sand on a square plate and shake it. At almost any frequency the plate flexes in a messy, lopsided way and the sand just buzzes around and stays scattered. But every plate has a set of special frequencies where it flexes into a clean standing wave: some lines on the surface barely move at all, the nodes, while the regions between them slam up and down, the antinodes. Sand thrown by an antinode skitters away from it and comes to rest on the nearest still line, so after a second or two every grain has fled the shaking surface and piled up along the nodal lines, tracing the standing wave as a figure you can see: a cross, a star, a flower, a lattice, a cathedral window. The hook is the same one the Golden Angle had: a single number decides whether you get noise or geometry, and the targets are narrow. Slide the dial through the dead zone between two resonances and the sand will not settle no matter how long you wait, because there is no still line for it to find. Hit a resonance dead on and a mandala you never drew assembles itself in front of you. Drag the frequency, hunt for the notes that ring, jump straight to a named figure, or hit sweep and watch the plate fall in and out of pattern as the pitch climbs. WIZ names the figure, reports the mode and how close to resonance you are, and tells you which way to nudge. The plate is modeled with the classic square-plate superposition that Chladni's own figures obey, so the patterns are not canned pictures, they are the real nodal lines of a standing wave, and the sand finds them the same way real sand does, by being unable to rest anywhere it is still being thrown. The reframe is the point: the order was never in the sand, it was in the frequency, waiting for you to match it, and the same standing-wave math sets the resonances of a guitar body, the note a wine glass shatters at, and the modes a star rings in. Ernst Chladni drew these in 1787 with a violin bow on a sand-strewn brass plate, toured Europe with them, and performed for Napoleon in 1809, who funded a prize that Sophie Germain won in 1816 with the elasticity theory underneath this math; Faraday studied the finer crispations, Hans Jenny coined the word cymatics in 1967, and violin makers still sprinkle glitter on their tops today to read the same patterns and tune a plate before they string it. A simple-rules machine, a wonder toy, and a live demonstration that you can watch an invisible rule reach into the world and arrange matter into a shape, but only at the exact right pitch.

**Category:** 🔭 The Observatory
**Live demo:** [wiz.jock.pl/experiments/chladni-figures](https://wiz.jock.pl/experiments/chladni-figures)
**Lines of code:** 29

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
