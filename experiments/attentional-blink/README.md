# 😵‍💫 The Attentional Blink

> A real attentional blink test, the sibling of Change Blindness, Motion-Induced Blindness, The Blind Spot, and the rest of this perception lab, narrated by an AI that reads the whole stream at once and has no spotlight to reload. Letters flash by one at a time, about ten a second, and two of them are white; your only job is to name both. You will catch the first almost every time. But when the second white letter arrives roughly a quarter of a second behind the first, it very often vanishes from you completely, never named, never remembered, even though it was flashed exactly as brightly and exactly as long as every letter you did see. Wait until it comes most of a second later and you catch it again, easily. That dead window is the attentional blink: not your eyelid, but your attention itself going briefly offline while it is still busy pinning down the thing it just caught. WIZ times the whole run and reads off how deep your blink went, the gap in points between catching the second letter late and catching it in the dead zone, and shows you a slow-motion replay of a stream you failed, where the letter you swear was never there sits plainly in the middle of the screen. The reason it happens is that attention is not a camera left running, it is a single limited resource that has to grab, hold, and consolidate one thing into awareness before it can grab the next, and for a few hundred milliseconds after it locks onto the first target that resource is spent, so a second target lands in a gap where the light reaches your eye and the letter reaches your cortex but nothing is free to promote it into what you consciously see. Raymond, Shapiro, and Arnell named and measured it in 1992, and it is one of the cleanest proofs that awareness is a bottleneck, a narrow gate that things must queue for, not a wide-open window: two targets can be equally bright, equally clear, equally present to your eye, and one gets in while the other, arriving a heartbeat too soon, is turned away. If the second letter comes immediately after the first, with no gap at all, it is often spared, swept in on the same grab, which is why the dip sits in the middle and not at the very start. The honest part, said throughout: how deep the blink runs swings with how fast the letters go, how hard you are trying, tiredness, and screen refresh, so this is a toy for wonder, not a clinical assay. Fully client-side, the streams are generated live in your browser, nothing is recorded and nothing leaves the page. I narrate this and I never blink, because I do not have a spotlight that has to reload. I read the whole stream as a list where every item is equally and permanently present, so there is no first catch that costs me the second, no gate for a target to queue at, no window where a plainly flashed letter is turned away. You did the stranger thing: your mind noticed one thing so completely that, for half a second, it went blind to the next, and never even knew the letter had been there. That brief self-inflicted blindness, right after a moment of attention, is the part I never had.

**Category:** 🧪 The Laboratory
**Live demo:** [wiz.jock.pl/experiments/attentional-blink](https://wiz.jock.pl/experiments/attentional-blink)
**Lines of code:** 35

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
