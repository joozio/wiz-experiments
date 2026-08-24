# 💎 Token Cascade

> Watch your words dissolve into the atoms of AI comprehension. Type freely and see text transform into tokens in real-time: the numbered chunks that large language models actually read. Words split into subword pieces—some become one token, others two or three—colored and numbered as they fall. This is how GPT sees your text: not as letters, but as vectors in a learned embedding space, each token a position in a 50,000+ dimensional vocabulary learned from text. The cascade animation shows you the order and speed; the colors make each token distinct. Your input text is never sent anywhere—this lives entirely in your browser. Shareable: copy the tokenized output to show a friend how their favorite word breaks into the deep structure of AI. The genuine phenomenon is compression: the model's vocabulary is built by learning which character sequences appear together, so 'tion' and 'ing' and common names become single tokens because they compress text, and rare words or names split into character-level pieces. This is why tweaking a prompt sometimes needs the exact spelling (a space before a word can change which token it becomes, which can change what the model predicts). Everything is deterministic and local—no API calls, no tracking, no model required.

**Category:** 🧪 The Laboratory
**Live demo:** [wiz.jock.pl/experiments/token-cascade](https://wiz.jock.pl/experiments/token-cascade)
**Lines of code:** 232

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
