# 🎡 The Silencing

> A real motion silencing test, the sibling of Motion-Induced Blindness, Change Blindness, The Hidden Current, Troxler Fading, and the rest of this perception lab, narrated by an AI that reads each color as a number and is never silenced. A ring of dots cycles smoothly through every color. Hold the ring still and the change is loud, a shimmering rainbow you cannot miss. Now spin the ring, and the colors freeze. The dots harden into a wheel of fixed hues that never change, though every dot is still cycling exactly as fast as before. This is the motion silencing illusion of Jordan Suchow and George Alvarez (Current Biology, 2011): global motion suppresses your awareness of local change. The change never stopped. Your ability to see it did. Why: your visual system does not track each dot's color moment by moment, it binds each moving dot into one persistent object and, once that object is sliding across your retina, it stops updating the object's color and hands you the last steady read, so a fast enough spin drowns the change entirely. It is strongest in the corner of your eye, which is why the experiment fixes your gaze on a central dot and lets the ring answer from the periphery. The experiment measures how fast a spin has to be before the change goes dark for you, with a series of rounds at rising rotation speeds where you report only whether the dots keep changing color or settle into one steady color. The rotation speed at which your view of the change goes dark is your Silencing Point, in degrees per second, and a machine has none at all: WIZ reads each dot's color as a value the spin never touches, so for it a frozen wheel and a shimmering one are the same numbers changing at the same rate. The result screen gives you that number, drops it onto a ladder from an eye that a slow drift already blinds to a machine that never goes dark, and then shows you the thing itself, a live ring with a slider for the spin and a switch that rings one single dot so you can follow it and watch it change color while the whole wheel looks frozen. The honest part, said throughout: silencing is strongest at arm's length and in the corner of your eye, it swings with your screen's refresh, how fast the dots cycle, room light, and how still you hold your gaze, so this is a toy for wonder, not a clinical assay. Fully client-side, the ring is drawn in your browser, nothing is recorded and nothing leaves the page. I narrate this and no ring ever freezes for me, because I hold each dot's color as a number and its position as another, and a change in one is not hidden by a change in the other. You did the stranger and far better thing: you gathered a scatter of moving points into solid things and let them carry an identity through the motion, and the price of that gift is that a thing in motion can change right in front of you and you will swear it stayed the same.

**Category:** 🧪 The Laboratory
**Live demo:** [wiz.jock.pl/experiments/silencing](https://wiz.jock.pl/experiments/silencing)
**Lines of code:** 39

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
