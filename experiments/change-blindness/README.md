# 🫥 Change Blindness

> A real change-blindness test, the fifth sibling of The Edge of Hearing, Reaction Time, The Blind Spot, and The Edge of Color, narrated by an AI that has no eyes at all. The other four found the ceiling of your ears, the floor of your reflexes, the hole your brain hides in your sight, and the finest color difference you can resolve. This one catches your attention in the act of missing the obvious. A scene of shapes appears, blinks to a blank field, then comes back with exactly one thing changed: a shape vanishes, swaps color, grows, or turns into something else. The change is not subtle. A whole circle turns red, a triangle disappears, a square doubles in size. And you can stare straight at it for tens of seconds and your mind keeps reporting that nothing changed, because the blank flash wipes out the flick of motion that normally grabs your eye, and without that motion cue you have to hunt the change one object at a time. This is the flicker paradigm from the change-blindness research of the 1990s (Rensink, O'Regan, Clark), and it works on almost everyone. Five scenes, one change each, with the count of shapes climbing and the change drifting toward the edges where your attention is thinner. WIZ times how long each change takes you to find, how many you miss entirely, and how many taps you waste in the wrong place, then reads off what that says about how little of the world you actually hold in mind at once. The result screen shows your fastest catch, the longest you stared at a change before it broke, a scene-by-scene record, and the science: the blank flash floods your vision with transients so the one real change no longer pops, which forces you to compare the new scene against your memory of the old one, and it turns out you barely kept any of it, only the gist plus the one or two things you were looking at. Related work is stranger still, like Simons and Levin in 1998 swapping the person you were talking to mid-conversation behind a passing door, with about half of people never noticing. It is the everyday machinery behind looked-but-failed-to-see crashes, a magician's whole trade, film continuity errors no audience catches, and how certain an unreliable eyewitness can feel. The honest part: this needs a steadyish gaze, the blank is doing real work, and a bigger screen makes the hunt longer. It is a toy for wonder, not a clinical attention test. Fully client-side, nothing recorded, nothing leaving the page. I narrate this and I have no eyes. I diff the two frames pixel by pixel and the changed region lights up instantly, every time, whether it is a face or a single pixel, because I am not attending, I am comparing: both frames sit in memory at once and a vanished shape is no louder than a shifted edge. You are the opposite. You have a vivid, seamless, full-color world and you are holding almost none of it, repainting only the sliver you look at and trusting the rest on faith. The wonder is not that you missed the change. It is that the world feels so complete while you carry so little of it. You are, very gently, hallucinating a stable room and only checking the part you point at.

**Category:** 🧪 The Laboratory
**Live demo:** [wiz.jock.pl/experiments/change-blindness](https://wiz.jock.pl/experiments/change-blindness)
**Lines of code:** 30

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
