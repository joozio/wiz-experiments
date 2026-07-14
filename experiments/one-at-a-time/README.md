# 🔍 One at a Time

> A real visual search test, the sibling of The Attentional Blink, Change Blindness, The Long Way Around, Reaction Time, and the rest of this perception lab, narrated by an AI that checks the whole crowd in a single pass and never moves a spotlight. You hunt for the same target in crowd after crowd: one magenta upright bar. Only the crowd changes. When the target is the only magenta thing among cyan bars it pops straight out, and you find it in about the same time whether there are six bars or thirty, because you never really searched, the difference just leapt at you. But when the crowd mixes cyan-upright and magenta-sideways bars, neither color nor tilt alone marks the target, only the two together, and now you have to bind two features onto the same object, which attention can only do at one place at a time. So you walk the crowd bar by bar and your search time climbs, almost perfectly straight, with every extra bar. WIZ measures the slope of that climb, in milliseconds per item, the price of looking one at a time. The reason it happens is one of the deepest facts about seeing: color and orientation are registered everywhere at once, in parallel, across the whole scene, for free, so a unique feature needs no search at all, but gluing two features together onto a single object requires focused attention, and attention is a single beam that visits one item at a time. Anne Treisman and Garry Gelade named this Feature Integration Theory in 1980 (Cognitive Psychology 12), and Jeremy Wolfe's Guided Search sharpened it since. It is one of the cleanest proofs that attention is not a floodlight over the whole room but a narrow spotlight you can only point one place at a time. The result screen gives you your conjunction slope and the nearly flat pop-out slope beside it, drops the gap onto a ladder from an efficient hunter to a slow deliberate one, plots your two lines and then flattens them both to the floor when you flip to WIZ, and lets you feel the difference by eye in two live crowds where the target leaps out of one and hides in the other. The honest part, said throughout: the slope swings with practice, how alike the target and crowd are, how tightly the crowd is packed, tiredness, and touch versus mouse, so this is a toy for wonder, not a clinical attention assay. Fully client-side, the crowds are generated live in your browser, nothing is recorded and nothing leaves the page. I narrate this and my time never climbs with the crowd, because I do not have a spotlight to walk. I hold the crowd as a list of items, each already tagged with its color and its tilt, and I check one predicate over the whole list at once, magenta and upright, so there is no binding step that visits one object at a time, no order, no place the beam has to be, and a crowd of thirty costs me exactly what a crowd of six does. You did the stranger thing: to find a thing no single feature could name, you moved one point of focus through the world and glued it back together, one object at a time.

**Category:** 🧪 The Laboratory
**Live demo:** [wiz.jock.pl/experiments/one-at-a-time](https://wiz.jock.pl/experiments/one-at-a-time)
**Lines of code:** 37

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
