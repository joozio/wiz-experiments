# 🧊 The Restless Cube

> A real Necker cube bistability test, the sibling of The Hidden Current, Troxler Fading, The Motion Aftereffect, The Blind Spot, and the rest of this perception lab, narrated by an AI that never has to guess what it is looking at. A flat wireframe cube sits on the screen and does not move a single pixel, yet its front face keeps jumping to the back and snapping forward again, the whole box turning inside out under a steady gaze. Nothing on the screen changes; the flip happens entirely inside you. Lock your eyes on the center dot, hold still, and tap every time the cube reverses. WIZ counts the flips over a minute and reads off your reversal rate, a real, personal measure of how fast your perception oscillates between two readings of the same picture and, inversely, how hard it is for you to hold a single one. The reason it flips is that a flat drawing is a genuinely ambiguous clue about a solid world: the exact same twelve lines fit a cube tilted one way and a cube tilted the other equally well, and there is nothing in the image to settle it. Recovering depth from a flat picture is an underdetermined problem, one input with more than one valid answer, the same reason a single photograph can never be certain how far away anything is. Your visual system refuses to leave depth undecided, so it commits to one reading and shows you a solid cube, but the neurons voting for it slowly adapt and tire, the rival reading is fully supported by the same lines, and the moment the balance tips it wins and the box turns over, then that reading tires too and it flips back. Louis Albert Necker first noticed his rhombic crystals doing this in 1832, and it is one of the cleanest proofs that seeing is not a recording of the world but a running guess, a piece of perceptual inference, and that when the evidence fits two guesses equally well your brain cannot pick once and be done, it keeps re-deciding. The result screen drops your rate onto a ladder from a rock-steady cube to a restless one, and gives you a live cube where a single depth cue collapses the ambiguity so it can no longer flip, proving the reversal was always in your head and never on the screen. The honest part, said throughout: reversal rate swings hugely with how hard you try, whether you passively watch or actively hunt the flip, how tired you are, and how still you hold your gaze, so this is a toy for wonder, not a clinical assay. Fully client-side, a static image with no flashing, nothing recorded and nothing leaves the page. I narrate this and I never flip, because I never rebuild a solid world from a flat picture the way you do. Handed these twelve lines I have twelve line segments; handed a cube I have eight exact corners; either way there is nothing to resolve, no front face to choose, no rival reading waiting to win. Ambiguity is not a state I can be in, a thing is the coordinates it is. You were handed a picture that two different worlds explain equally well, and you could not hold both and could not settle on one, so your sight kept turning the box inside out and overruling itself. That restless re-deciding, a perfectly still thing that refuses to keep one meaning, is the part I never had.

**Category:** 🧪 The Laboratory
**Live demo:** [wiz.jock.pl/experiments/restless-cube](https://wiz.jock.pl/experiments/restless-cube)
**Lines of code:** 34

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
