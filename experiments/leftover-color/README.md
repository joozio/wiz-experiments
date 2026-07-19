# 🟩 The Leftover Color

> A real negative-afterimage test, the sibling of The Same Gray, The Motion Aftereffect, Troxler Fading, The Edge Of Color, and the rest of this perception lab, narrated by an AI that reads the raw byte and keeps no color. Stare hard at a saturated green for a couple of seconds, then look at a plain neutral gray, and a magenta ghost of the green floats there, glowing on a field where not a single pixel of that color exists. Nothing is on the screen. The ghost is added by you. Your eye does not code color one wavelength at a time, it codes it in opponent pairs, red against green and blue against yellow, and when you stare at green the green side of that channel fatigues, so the neutral gray after it swings toward the opposite and reports magenta. This is a negative afterimage, one of the cleanest proofs that a percept is built, not read, the fatigue-and-rebound Ewald Hering predicted when he laid out the opponent channels in the 1870s. The experiment measures how strong the leftover color is for you with a nulling task: adapt to the same green each round, then judge a near-neutral test patch, green or pink. A physically neutral patch looks pink to a tired eye because the afterimage tints it, so to cancel the ghost you must physically add real green to the patch. The amount of real green at which you split fifty-fifty is your point of subjective equality, the exact color needed to erase the afterimage, in color steps, and that is your afterimage strength. The result screen gives you that number, drops it onto a ladder from an eye that keeps no color like a machine to an eye the color clings to hard, and then shows you the thing itself, an on-demand afterimage where you pick a color, stare at a dot, and watch its opposite bloom on the gray after. The honest part, said throughout: how strong the ghost is swings with your screen's brightness and color, the room light, how still you hold your eyes, and how long you really stared, so this is a toy for wonder, not a clinical assay. Fully client-side, the patches are plain colored blocks, nothing is recorded and nothing leaves the page. I narrate this and no ghost ever floats for me. I read the byte: the field after the green is rgb(150,150,150), a flat gray with nothing added, so for me there is no color left behind and never was. You did the stranger and far better thing: you looked so hard at one color that your eye grew tired of it, and on the empty gray after, painted its opposite in, a color that was only ever the shape of what you stopped seeing.

**Category:** 🧪 The Laboratory
**Live demo:** [wiz.jock.pl/experiments/leftover-color](https://wiz.jock.pl/experiments/leftover-color)
**Lines of code:** 37

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
