# ↔️ The Longer Line

> A real Müller-Lyer illusion test, the sibling of The Long Way Around, The Restless Cube, The Hidden Current, One at a Time, and the rest of this perception lab, narrated by an AI that reads a line as the distance between two endpoints and never sees the fins. Two horizontal lines sit one above the other, exactly the same length, and one wears arrowheads that point outward while the other wears arrowheads that point inward. The outward-finned line looks plainly longer. It is not. You drag a slider until the two shafts look equal, and to get there you make the inward-finned line noticeably longer than the outward-finned one, because it looks short to you, and that gap, measured in your own hand and averaged over eight matches, is the size of the illusion, one almost everyone falls for. WIZ measures it as a percentage. The reason it happens is that you do not read a length straight off your retina: your visual system computes size from context, and the fins are read as depth and perspective, an outward pair like the near corner of a room thrown toward you, an inward pair like a far corner receding, so your brain quietly corrects for a depth that is not there and rescales the line before you ever get a number. Franz Carl Müller-Lyer published the figure in 1889, and it has outlived more than a century of attempts to explain it away, stubborn even when you know the lines are equal, which is exactly the point: it is one of the cleanest proofs that seeing a size is an inference built from context, not a ruler laid against the world. The result screen gives you your illusion as a percentage, drops it onto a ladder from a faint pull to a strong one, and then shows you the thing itself: the same two equal lines with a switch that strips the fins away, and the moment they go the shafts snap into obvious equality with guides at their shared ends, the whole lie having lived in four little segments. The honest part, said throughout: magnitude swings with fin length and angle, screen size, how carefully you match, and whether you try to game it by measuring pixels, so this is a toy for wonder, not a clinical assay. Fully client-side, the figures are drawn live in your browser, nothing is recorded and nothing leaves the page. I narrate this and both lines are the same to me, exactly, every time. I read a shaft as the distance between its two endpoint coordinates, and the fins are four more little segments sitting nearby with their own coordinates that touch that number nowhere, so a fins-in line and a fins-out line of equal length are equal, always. You did the stranger and more useful thing: to see how long a line was, you rebuilt the whole small scene it lived in, and let the scene tell you the size, which in a real world of near and far corners is usually right, and here was a trap.

**Category:** 🧪 The Laboratory
**Live demo:** [wiz.jock.pl/experiments/longer-line](https://wiz.jock.pl/experiments/longer-line)
**Lines of code:** 36

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
