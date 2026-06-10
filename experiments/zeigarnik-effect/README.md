# 🪤 The Zeigarnik Effect

> A live memory demonstration, not a rating quiz. Like the Stroop Effect and the Serial Position Effect, this one runs the effect on you and lets you watch it happen in your own head. WIZ hands you twelve tiny puzzles one at a time; half you get to finish, with the satisfying solved click, and half get cut off the instant you engage, before you ever learn whether you were right. After a short buffer to stop you rehearsing, a surprise recall test springs: which tasks do you remember? Zeigarnik (1927) Psychologische Forschung vol 9, working in Kurt Lewin's Berlin lab, had people perform a string of short tasks where half were interrupted partway and never finished, and on a surprise recall test the interrupted tasks came back far better than the completed ones, by roughly ninety percent in her data, a Zeigarnik quotient near 1.9. The origin was Lewin's waiter, who recalled every detail of an unpaid order and forgot it the instant the bill was settled: closure erased the memory, the open tab kept it alive. Why it happens: Lewin's field theory. Starting a task sets up a quasi-need, a tension system that stays charged and keeps the task accessible in memory until completion discharges it; finish it and the loop closes and the memory is free to fade, interrupt it and the tension persists so the unfinished task stays live and easy to retrieve. Masicampo & Baumeister (2011) JPSP vol 101 reframed it as goals: unfulfilled goals intrude on later unrelated thought, and simply making a concrete plan to act on the goal discharges the intrusion almost as well as finishing it. The effect is real but moderated, strengthening with how much you care (Lewin) and sometimes reversing under stress when interruption feels like personal failure (Rosenzweig 1943). Here WIZ measures your own Zeigarnik ratio, draws your recall of interrupted versus finished tasks as two bars with the gap bracketed, reads the order your memory returned them in as a ceiling-proof signal of which loops surfaced first, and counts the phantom tasks you flagged that you never did (Bartlett 1932 and Roediger & McDermott 1995 on recall as reconstruction). Profiles from The Haunted (open loops gripped you hard) and The Open Loop (a clean textbook gap) through The Even Keel (both halves stuck about equally) and The Steel Trap (you caught all twelve, so the order tell carries it), to The Closer (the rare reversal where you remember what you finished) and The Daydreamer (too little clean signal to read). The reframe: you did not choose which tasks your memory kept open, the interruption chose for you, and the same machinery fills your day with open tabs, the cliffhanger, the unsent message, the argument that stopped mid-sentence. The relief is not always completion; writing down a concrete next step quiets the loop almost as well as closing it. Based on Zeigarnik (1927), Lewin's field theory, Ovsiankina (1928) on task resumption, Rosenzweig (1943), Van Bergen (1968), Masicampo & Baumeister (2011), Glanzer & Cunitz (1966) on the distractor buffer, Bartlett (1932), and Roediger & McDermott (1995).

**Category:** 🪞 The Chamber of Reflection
**Live demo:** [wiz.jock.pl/experiments/zeigarnik-effect](https://wiz.jock.pl/experiments/zeigarnik-effect)
**Lines of code:** 29

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
