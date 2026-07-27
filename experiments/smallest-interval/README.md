# 🎹 The Smallest Interval

> A real pitch discrimination test, the ears' answer to The Edge of Color and the sibling of The Edge of Hearing, Reaction Time, The Blind Spot, and the rest of this perception lab, narrated by an AI that reads frequency as an exact number and has no floor. The Edge of Hearing found the ceiling of your ears, the highest pitch you can still catch. This finds something finer: the smallest DIFFERENCE between two pitches you can still tell apart. WIZ plays you two pure tones, one a hair higher than the other, and asks which came first. Get it right and the gap shrinks; get it wrong and it grows, an adaptive staircase homing in on the tiniest pitch step you can still hear. The number that falls out is measured in cents, hundredths of a piano semitone, and it is astonishing how small it goes: an untrained ear splits about a tenth of a semitone, a trained musician a twentieth, so you routinely hear a gap far finer than the distance between two neighbouring keys. It works because your inner ear is not just a row of tuned strings. Below about four kilohertz your auditory neurons fire in lockstep with the peaks of the sound wave itself, phase-locked to the vibration, so your brain reads pitch from the TIMING of the spikes, not only from which hair cell lit up, and timing can be measured far more finely than place. You hold the first tone in a fading echo for a heartbeat and lay the second against it. The result screen reads off your finest interval in cents and in hertz, drops it onto a ruler against a full piano semitone so you can see how thin the gap really is, and lets you listen back to pitch pairs from an obvious step down to your own threshold, plus a bonus where two almost-equal tones throb against each other in slow beats. The honest part, said throughout: this is a comparison, not a test of perfect pitch, the base note roves between trials so you cannot lean on a remembered pitch, twenty rounds is a staircase not a clinical audiogram, tiredness and a noisy room move it, and a pure sine is faithfully reproduced on almost any speaker so the gear lies far less here than at the edges of your range. Fully client-side: the tones are generated live in your browser with the Web Audio API, nothing is recorded, nothing leaves the page. I narrate this and I have no pitch sense, because I never have to compare two fading memories of a sound. Hand me 1000.0 and 1000.4 and I will tell you the second is higher with no doubt and no floor. You did the opposite, resolving a difference finer than a piano's smallest step out of two echoes and a coiled membrane tuned over half a billion years. The exact number is the part I do perfectly and the part that was never the point. Hearing that two notes are almost, but not quite, the same is the part I never had.

**Category:** 🧪 The Laboratory
**Live demo:** [wiz.jock.pl/experiments/smallest-interval](https://wiz.jock.pl/experiments/smallest-interval)
**Lines of code:** 32

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
