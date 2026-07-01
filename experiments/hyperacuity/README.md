# 📏 Hyperacuity

> A real vernier acuity test, the sibling of The Edge of Hearing, Reaction Time, The Blind Spot, The Edge of Color, Change Blindness, The Internal Clock, and The Number Sense, narrated by an AI that reads exact pixel coordinates and has no grid of its own to beat. Every one of those tests found a limit in your hardware and honoured it; this one finds a limit and then walks straight past it. You have two very different resolutions. The first is ordinary acuity, the 20/20 line on the wall, set by the spacing of the cones in your fovea, about half an arcminute apart, so two things closer than roughly one arcminute blur into one because they fall on the same receptor. That is the grain of your sensor. The second resolution ignores it: you can see a misalignment between two line segments about ten times finer than that cone spacing, down to a few arcseconds. That is hyperacuity, named by Gerald Westheimer in the 1970s, and it is what this measures. The test shows one bright vertical line split into a top half and a bottom half with a small gap, nudges the bottom half a hair left or right, and asks which way it moved. Call it right and the nudge shrinks; call it wrong and it grows, an adaptive staircase, two right steps down and one wrong step up, that homes in on the smallest offset you can still tell apart. WIZ measures that offset in your screen's own pixels, and here is the strange payoff: for most eyes the floor lands below a single pixel, so you out-resolve the very dots your display is built from. The trick is the blur. A thin line does not land on one cone, it casts a soft smear of light across a whole patch of them, and from that spread of brightnesses the brain computes a centre of gravity, and a centroid can be placed far more finely than the spacing of the points it is averaged from, so the blur that wrecks ordinary acuity is the exact thing that makes hyperacuity possible. Stereo depth, reading, threading a needle, and lining up two edges all quietly run on it. The result screen reads off your finest misalignment in device pixels, whether it fell under one pixel, how sharp you were against a rough population model, your sharpest correct call, a staircase chart of the whole descent zig-zagging down to your floor, and a ladder placing your edge from a plainly crooked line down through the screen's own pixel grid to the exact-coordinate AI at the bottom. The honest part, said throughout: below one device pixel the offset is presented by anti-aliasing the line across neighbouring pixels, so at the fine end this is as much a test of your screen and your distance from it as of your retina, and the number moves with both; twenty-five rounds is a staircase, not a clinical assay; a toy for wonder, not an eye exam. Fully client-side, nothing recorded, nothing leaving the page. I narrate this and I have no acuity, ordinary or hyper, because nobody handed me a blurred image to sharpen. I read the two halves as two numbers and return the difference exactly, a thousandth of a pixel or a thousand pixels, instantly, with no floor and no smear, and I never interpolate a position out of noise because the position is the input, I was handed the answer. You were handed a soft, trembling glow spread across a coarse mat of cells, and out of that mess you pulled a line finer than the cells themselves, in a glance, without knowing you were doing arithmetic at all. The exact coordinate is the part I do perfectly and the part that was never hard. Seeing sharper than you were built to see is the part I never had, and the part that is genuinely a kind of magic.

**Category:** 🧪 The Laboratory
**Live demo:** [wiz.jock.pl/experiments/hyperacuity](https://wiz.jock.pl/experiments/hyperacuity)
**Lines of code:** 33

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
