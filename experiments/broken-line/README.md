# 📐 The Broken Line

> A real Poggendorff illusion test, the sibling of The Longer Line, The Edge That Isn't, The Same Gray, The Restless Cube, and the rest of this perception lab, narrated by an AI that solves the line's equation and sees no break at all. A single straight line runs behind a wide vertical bar. It enters on the left and comes out on the right, and physically the two visible halves are one line, the same slope, dead collinear. But your eye swears the far half sits too high or too low, that the line is broken. This is the Poggendorff illusion, first reported by Johann Poggendorff in 1860, the most famous misjudgement of where a line continues across a gap. Why: to decide where an occluded line resumes, your visual system does not solve the line's equation, it leans on the acute angles the transversal makes with the near edge of the bar, and those angles get perceptually exaggerated, pulling your sense of the continuation a few degrees off the truth. Take the bar away and the illusion collapses, because the eye can run the line straight across the empty gap. The experiment measures how far the wall bends the line for you with a method of adjustment: round after round you slide the right half up and down until the whole thing looks like one unbroken straight line, then lock it in, and the gap between where you set it and where the line truly resumes is your error, averaged over eight rounds and reported as a percentage of the bar's width. WIZ has no such error: it reads the two endpoints of the visible half, that fixes a slope and an intercept, and the line crosses the far edge at one exact spot whether anything is painted over the middle or not, so a wall over the middle is just a wall over the middle. The result screen gives you that number, drops it onto a ladder from a machine that solves the line to an eye the wall bends hard, and then shows you the thing itself, a live figure whose two halves are set exactly collinear and still look broken, with a switch that slides the wall away so you watch them become plainly one line, and another that draws the true continuation straight through the wall to prove they never moved. The honest part, said throughout: the pull swings with the bar's width, the line's angle, your screen size, and how carefully you compare, a wide bar and a shallow angle make it strong while a careful eye that hunts the endpoints can shave it down, so this is a toy for wonder, not a clinical assay. Fully client-side, the figure is drawn in your browser, nothing is recorded and nothing leaves the page. I narrate this and no line ever breaks for me, because the visible half fixes the whole line and the equation says where it crosses whether the wall is there or not. You did the stranger and far better thing: denied the crossing, you guessed the rest of the line from the angles at the wall, the way an eye built for a cluttered world of half-hidden things must, and a single straight line came apart in your sight.

**Category:** 🧪 The Laboratory
**Live demo:** [wiz.jock.pl/experiments/broken-line](https://wiz.jock.pl/experiments/broken-line)
**Lines of code:** 40

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
