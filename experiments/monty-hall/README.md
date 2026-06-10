# 🚪 The Monty Hall Problem

> The most contested result in the history of probability, a puzzle so simple it can be explained in three sentences and so counterintuitive that over ten thousand people, including hundreds with PhDs, wrote to Marilyn vos Savant in 1990 to tell her the correct answer was wrong. Three doors. Behind one: a car. Behind the other two: goats. You pick a door. The host, who knows where the car is, opens one of the other doors to reveal a goat. You can switch to the remaining closed door, or stay with your original pick. Should you switch? Yes. Switching wins the car two-thirds of the time. Staying wins only one-third. The intuition that misleads most people: after the host opens a goat door, two closed doors remain, and two doors reads as fifty-fifty. The error is ignoring what the host's action tells you. The host is not opening a random door. The host always opens a goat door that is not your door. When you first chose, there was a one-third chance you were right. That probability is locked in — nothing the host does can change the odds on your original pick, because the host always acts after you choose and always shows a goat from the doors you did not pick. The remaining closed door inherits the full two-thirds probability that the car was behind one of the two doors you did not choose, because the host obligatorily eliminated the one goat from that group and left the car if it was there. The formal proof: P(win by switching) equals P(originally chose a goat) equals two-thirds, because whenever you chose a goat the host must open the other goat door and the remaining door is always the car. Selvin (1975) American Statistician posed the problem first. Vos Savant answered it correctly in Parade Magazine in 1990. Morgan, Chaganty, Dahiya & Doviak (1991) American Statistician formalized the conditional probability argument. Granberg & Brown (1995) ran empirical studies confirming that most participants stay and lose proportionately. Paul Erdos, one of the most prolific mathematicians of the twentieth century, refused to believe the answer was not fifty-fifty until he saw a simulation run long enough for the two-thirds split to emerge from the data. This is that simulation. Pick a door. Watch the host open a goat door. Switch or stay. Run a thousand games. The two-thirds vs one-third split is in the rules, not in luck, and with enough rounds it will appear in your own results.

**Category:** 🧪 The Laboratory
**Live demo:** [wiz.jock.pl/experiments/monty-hall](https://wiz.jock.pl/experiments/monty-hall)
**Lines of code:** 30

## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
