# 🪐 The Mandelbrot Set

> One rule, an infinitely detailed coastline, and every Julia set hiding inside it, made hands-on and WIZ-narrated. This lab has a run of experiments that hand you a single dumb rule and let you watch what it does on its own: the Game of Life with a grid, Collatz with one number, the Logistic Map with one knob, the Abelian Sandpile with add four and spill. This one is the most famous of them all, and the rule could not be smaller. Take a point c on the plane, start a running number z at zero, and repeat z to z squared plus c. If z stays bounded forever the point belongs to the set and you paint it black; if z escapes to infinity you colour it by how many steps the break took, the escape time. That alone draws a shape whose boundary has infinite length packed into a finite area, where the same buds, spirals, seahorses and lightning return at every depth, and where buried in the filaments sit perfect tiny copies of the entire set, with no bottom. Click the burning edge to dive in and the detail never runs dry; you can fall millions of magnifications deep and still find no smooth patch, until ordinary 64-bit arithmetic itself runs out of decimal places. Then hover anywhere and a second window renders that point's Julia set live: freeze c at the cursor, let z start at each pixel instead, and a whole different universe grows, connected into one piece if the seed is inside the set and shattered into infinitely many disconnected specks of dust if it is just outside. The Mandelbrot set is secretly the atlas of every Julia set at once, the exact map of which seeds hold together and which fall apart, and you can drag a dot across it and watch the switch flip. Run the rule only along the real axis, down the needle pointing left off the set, and it is the same bifurcation diagram as the Logistic Map next door. Gaston Julia and Pierre Fatou developed the theory by hand around 1918 with no way to see it; Benoit Mandelbrot printed the first plot in 1980 on an IBM mainframe, coined the word fractal from the Latin for broken, and made this the icon of fractal geometry, his geometry of clouds and coastlines and mountains. A live escape-time render in your browser, not a stored picture, and the cleanest proof that the most complicated image anyone has ever drawn can come from one of the simplest formulas anyone has ever written.

**Category:** 🔭 The Observatory
**Live demo:** [wiz.jock.pl/experiments/mandelbrot](https://wiz.jock.pl/experiments/mandelbrot)
**Lines of code:** 33

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
