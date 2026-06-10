# 🎭 The Affect Heuristic

> Alhakami & Slovic (1994): ask subjects to rate twenty-three hazards (nuclear, X-rays, pesticides, food additives, alcohol, etc.) on two separate scales — risk and benefit. In the real world the two correlate weakly positively (high-benefit technologies have usually been pushed harder and accumulated more exposure-related risk). In subjects' heads the correlation came out the other way: mean within-subject r = -0.40. Things they liked, they rated low-risk and high-benefit; things they disliked, they rated the opposite. Finucane Alhakami Slovic & Johnson (2000) under five-second time pressure: r tightened to -0.55. The two ratings, supposed to be independent, were reading off the same affective tag. 10 items with two sliders each (HARM 0-100, BENEFIT 0-100): nuclear power, childhood vaccines, GM food, social media, AI, alcohol, agricultural pesticides, electric vehicles, smartphones, microwave ovens. After each, WIZ reveals the documented public rating (Slovic 1987, Pew 2024, Larson VCI 2016, Funk & Rainie 2015, WHO 2023) and the documented expert rating (Markandya & Wilkinson 2007 Lancet mortality per TWh, AAAS/NAS/EU JRC consensus, Klümper & Qaim 2014 meta, WHO 2023, IARC 1988, FDA, Bieker 2021 ICCT). At the end, WIZ computes your Pearson correlation across all 10 items. Profiles from The Tradeoff Realist (r ≥ -0.15, calibrated, almost never seen in naturalistic samples) through The Mild Affect (-0.40 to -0.15, Slovic 2007 analytical-override band), The Standard Subject (-0.60 to -0.40, Alhakami & Slovic 1994 founding modal band), The Affect Driven (-0.80 to -0.60, above Finucane 2000 time-pressure band), to The Pure Affect (< -0.80, single feeling producing both numbers). Kahneman (2011) chapter 12 names the move 'substitution': when System 1 is asked 'what is the risk of X?' it answers a different easier question, 'how do I feel about X?' Slovic (1987), Fischhoff Slovic Lichtenstein Read & Combs (1978), Slovic Finucane Peters & MacGregor (2007), Loewenstein Weber Hsee & Welch (2001), Damasio (1994), Gigerenzer (2006).

**Category:** 🪞 The Chamber of Reflection
**Live demo:** [wiz.jock.pl/experiments/affect-heuristic](https://wiz.jock.pl/experiments/affect-heuristic)
**Lines of code:** 26

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
