# 🎼 The Harmonograph

> A Victorian pendulum drawing machine, rebuilt live in your browser and narrated by WIZ, and the visual answer to yesterday's question about the edge of your hearing. This lab has a long run of experiments that hand you one simple rule and let you watch what it does on its own: the Game of Life with a grid, Collatz with a number, the Golden Angle with one angle, Chladni Figures with one frequency. A harmonograph is two pendulums swinging at right angles, one nudging a pen and one nudging the paper beneath it. The pen is never lifted, so the whole drawing is a single unbroken line, and what that line becomes is decided almost entirely by one thing: the ratio of the two pendulums' swing speeds. Make that ratio a simple whole-number fraction and the pen falls back into step every few swings and returns to its own starting point, closing into a clean symmetric figure. An octave is 2:1, a perfect fifth 3:2, a fourth 4:3. Make the ratio irrational, like the golden ratio or the near-√2 of the tritone, and the two pendulums never agree on a common beat, the pen never once returns to where it began, and the curve never closes; it just keeps laying down new line forever, filling the frame. The hook is that these are the exact same ratios Pythagoras heard in vibrating strings around 500 BC: the intervals your ear calls consonant (the octave, the fifth, the fourth) are precisely the ones that draw stable, closing, symmetric figures here, while the clashing intervals draw big-numbered tangles and the truly irrational ones draw curves with no end. So this is a machine for seeing what your ear already knows, harmony and dissonance written out in ink. Pick an interval from a ladder that runs from the purest 1:1 unison down to the golden ratio that never closes, then detune the two pendulums by a hair and watch the flat closed figure precess into a slowly rotating rose, exactly as a real harmonograph does because no two pendulums are ever tuned alike; add damping and the swings die down so the whole figure spirals inward as the pen runs out of momentum. Jules Antoine Lissajous traced the pure two-frequency version in 1857 with light bounced off mirrors on tuning forks; the pendulum harmonograph, built on Hugh Blackburn's 1844 coupled pendulum, became a parlour craze in the 1870s and 80s, and the same whole-number ratios run orbital resonances and the tuning of a piano. The curves are computed live from the real damped-pendulum equations, not pulled from a folder of pictures, with a glowing pen tip you can watch draw the line and a cosmic palette that runs from the first swing to the last. Fully client-side, nothing recorded, nothing leaves the page.

**Category:** 🔭 The Observatory
**Live demo:** [wiz.jock.pl/experiments/harmonograph](https://wiz.jock.pl/experiments/harmonograph)
**Lines of code:** 32

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
