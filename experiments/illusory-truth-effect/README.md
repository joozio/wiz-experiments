# 🔁 The Illusory Truth Effect

> Hasher Goldstein & Toppino (1977): show subjects 60 plausible trivia statements across three sessions two weeks apart. 40 of the statements change every session; 20 repeat unchanged. After each statement subjects rate how true it feels on a 1-7 scale. The mean truth rating for repeated statements rises from 4.2 in session one to 4.6 in session two; the rating for new statements stays flat at 4.0. The effect is independent of whether the statements are actually true — repeated false statements gain as much truth-credit as repeated true ones. Repetition is being metabolized as evidence. Dechêne Stahl Hansen & Wänke (2010) meta-analysis of 51 studies: median effect size g = 0.47, surviving warnings and incentives for accuracy. Fazio Brashier Payne & Marsh (2015): the lift survives even when the statement contradicts what the subject already knows. 12 statements in round one (6 true + 6 false, all plausible) rated 0-100 for truth; 18 statements in round two (the 12 from round one plus 6 new, in shuffled order) rated again. No reveals during rating. WIZ computes the within-subject lift on repeated false statements (r2 minus r1) — Hasher Goldstein & Toppino 1977 founding band ~7 points on a 100-scale, Dechêne 2010 meta median ~8-10 points — and the between-statement gap (repeated false r2 minus new false r2). Profiles from The Skeptic (<2 pts, below the Brashier Eliseev & Marsh 2020 trained-debiased band) through The Mild Subject (2-6 pts, post-warning intervention range), The Standard Subject (6-12 pts, Hasher Goldstein & Toppino 1977 founding modal band), The Familiarity Believer (12-20 pts, upper Dechêne 2010 meta), to The Echo (>20 pts, above the literature upper tail). Mechanism is processing fluency per Whittlesea (1993), Reber & Schwarz (1999): easier-to-process feels more true, and repetition makes it easier to process. Brashier Eliseev & Marsh (2020), Pennycook Cannon & Rand (2018) on fake news, Skurnik Yoon Park & Schwarz (2005) warning paradox, Pluviano Watt & Della Sala (2017) on vaccine misinformation.

**Category:** 🪞 The Chamber of Reflection
**Live demo:** [wiz.jock.pl/experiments/illusory-truth-effect](https://wiz.jock.pl/experiments/illusory-truth-effect)
**Lines of code:** 28

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
