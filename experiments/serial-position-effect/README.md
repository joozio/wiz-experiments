# 🎢 The Serial Position Effect

> A live memory demonstration, not a rating quiz. Most experiments here ask you to predict and then show the gap; this one runs the effect on you and lets you watch it happen in your own head. Ebbinghaus (1885/1913) first noticed that items at the start and end of a learned list are easier to recall than items in the middle, and Murdock (1962) Journal of Experimental Psychology vol 64 turned it into the canonical curve: show a list of unrelated words one at a time, ask for immediate free recall, and recall probability plotted against list position is a U. The first few words come back well (the primacy effect) and the last few come back best of all (the recency effect), while the middle sags. The shape is one of the most replicated results in psychology. Glanzer & Cunitz (1966) Journal of Verbal Learning and Verbal Behavior vol 5 split the curve in two: recall immediately and you get the full U, but insert a 15-30 second distractor task before recall and the recency effect vanishes while primacy is untouched. Two halves, two memory systems. The recency end lives in a fragile short-term store (Atkinson & Shiffrin 1968 modal model) that the distractor overwrites; the primacy end was rehearsed into a durable long-term store, because the first items arrived when the list was short and got the most rehearsal (Rundus 1971 JEP vol 89 counted the rehearsals and confirmed it; Postman & Phillips 1965 found the distractor result independently). Here you watch fifteen unrelated words appear one at a time, about a second each, then type back every word you remember in any order. WIZ matches your recall to the position each word held and draws the curve your memory actually made, as bars, next to the dashed textbook U from fifty years of free-recall studies, with a position-by-position grid showing exactly which words the middle of the list swallowed. Per-zone scores for primacy (positions 1-5), middle (6-10), and recency (11-15) against textbook references, plus a false-memory count for words you confidently 'recalled' that were never shown (Bartlett 1932 and Roediger & McDermott 1995 on recall as reconstruction). Profiles from The Textbook Curve (strong at both ends, sagging middle, the canonical U) through The Recency Rider (leaned on short-term store, the part that evaporates first), The Primacy Keeper (rehearsed the opening into durable memory), The Deep Encoder (recalled almost everything and flattened the curve through chunking), The Even Encoder (held the middle with a strategy), The Confabulator (three or more false memories), to The Wanderer (too few to read a curve). The reframe: you did not choose which words survived, their position chose for you, and the same rule runs your day. The start and end of anything stick; the middle leaks. Put what matters first or last, and slow down for the middle, because the curve will not carry it. Based on Ebbinghaus (1885), Murdock (1962), Glanzer & Cunitz (1966), Postman & Phillips (1965), Atkinson & Shiffrin (1968), Rundus (1971), Bartlett (1932), Roediger & McDermott (1995), Miller (1956) on chunking, and Yates (1966) on the method of loci.

**Category:** 🪞 The Chamber of Reflection
**Live demo:** [wiz.jock.pl/experiments/serial-position-effect](https://wiz.jock.pl/experiments/serial-position-effect)
**Lines of code:** 29

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
