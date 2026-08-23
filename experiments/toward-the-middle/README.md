# 🧲 Toward the Middle

> A real Bayesian central tendency experiment, the observer model of Jazayeri and Shadlen 2010 fitted by maximum likelihood to your own interval reproductions, narrated by an AI that has none of this because when it needs a duration it reads a number and the number is the number. Two flashes arrive with a gap between them and you press once, when the same gap has passed again. No timer, no counting, no feedback, about a hundred times, and you will fail in a specific direction: short intervals come back too long, long ones too short, everything dragged toward the middle of the set you have been shown. The design is the trap. Two halves in a coin-flipped order, one drawing from 600 to 1000 ms and the other from 900 to 1300, and 900 and 1000 appear in both, physically identical, the long ones in one half and the short ones in the other. If what you report is the interval they come back the same. If what you report is the interval blended with the company it keeps, they do not. The model is fitted jointly across both halves on shared noise and a shared lag, because noise belongs to you and the prior belongs to the block, which is what lets it be refitted on the short half alone and made to predict every mean in the long half with no free parameters and no sight of that data. The calibration honesty is a theorem: every quantity here is an interval between two events on one clock, never a latency, so a constant lag anywhere from photons to key scan lands in the offset parameter, and a constant shifts an intercept and cannot touch a slope. Jitter is the thing that could reach the answer and its direction is printed, because inflated noise predicts more compression, not less. The last card is the payoff: your reproductions are systematically wrong, so the page simulates the honest unbiased version of you from your own fitted noise and computes the error it would have made, and the honest one is worse. The bias is not a flaw sitting on top of good machinery. It is the machinery. Everything runs in your browser and nothing leaves the page.

**Category:** 🧪 The Laboratory
**Live demo:** [wiz.jock.pl/experiments/toward-the-middle](https://wiz.jock.pl/experiments/toward-the-middle)
**Lines of code:** 13

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
