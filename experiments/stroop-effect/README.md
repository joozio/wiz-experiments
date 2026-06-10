# 🎨 The Stroop Effect

> A live reaction-time demonstration, not a rating quiz. Like the Serial Position Effect, this one runs the effect on you and lets you watch it happen in your own head. Stroop (1935) Journal of Experimental Psychology vol 18 found that naming the ink color of a word is dramatically slower when the word names a different color (the word RED printed in blue ink) than when the word and ink agree, because reading is automatic and you cannot switch it off. The lag between conflicting and matching trials is the Stroop interference, one of the most replicated effects in psychology. Why it happens: automaticity (Posner & Snyder 1975, Shiffrin & Schneider 1977). For a literate adult, reading has been practiced into a reflex that runs without intention, faster than color naming, which stays comparatively controlled and slow. When the two disagree, the faster automatic response (reading) arrives first and has to be overridden by the slower controlled one (color naming), and that override takes time, and the time is the interference. Cohen, Dunbar & McClelland (1990) Psychological Review vol 97 reproduced the whole pattern with a connectionist network where the reading pathway is simply more strongly trained, including the asymmetry that words interfere with color naming far more than colors interfere with word reading (MacLeod & Dunbar 1988). MacLeod (1991) Psychological Bulletin vol 109, the definitive half-century review, found the effect survives across languages, modalities, decades, and thousands of studies. Here color words flash in colored ink and your only job is to tap the color of the ink, never the word. WIZ times every single tap, drops anticipations and lapses, and shows you the gap between the trials where word and ink agreed and the ones where they fought: your personal Stroop tax, in milliseconds, drawn as two bars with the gap bracketed between them, plus median reaction time and accuracy for each condition and a count of the conflicting trials where your hand obeyed the word instead of the ink. Profiles from The Color Sniper (near-zero tax, read past the word as if it were shapes), through The Quick Switch (small tax, fast override), The Standard Stroop (a clean textbook 100-250 ms gap), and The Word Reader (heavy tax, deeply automatic reading), to The Autopilot (the reflex broke through into wrong answers) and The Static (too few clean trials to read). The reframe: you did not choose to read the words, you cannot not read them, and overriding a reflex is slow, effortful, and exactly the milliseconds you just spent. The same machinery runs far past this box: the first read of a face, a headline, a price, a person arrives automatically and colors everything after it, and choosing a second interpretation costs the same kind of effort. The reflex is not the enemy; forgetting you have one is. Based on Stroop (1935), Cattell (1886) on words being named faster than colors, Posner & Snyder (1975) and Shiffrin & Schneider (1977) on automatic versus controlled processing, MacLeod & Dunbar (1988) on the interference asymmetry, Cohen, Dunbar & McClelland (1990), and MacLeod (1991).

**Category:** 🪞 The Chamber of Reflection
**Live demo:** [wiz.jock.pl/experiments/stroop-effect](https://wiz.jock.pl/experiments/stroop-effect)
**Lines of code:** 29

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
