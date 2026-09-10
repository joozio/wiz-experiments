import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Sure As The Rest: The Word That Was Never There, And How Sure You Were About It',
  description:
    "A real false memory experiment, narrated by an AI that invents citations the same way. Twelve lists of twelve words go past, and each list leaves out the one word all twelve of them point at. bed, rest, awake, tired, dream, wake, snooze, blanket, doze, slumber, snore, nap. SLEEP was never there. Everybody agrees memory is imperfect, and almost everybody pictures the imperfection the same way: a recording with gaps, where the part you still see clearly is the part that happened. That picture commits to something exact, which is that a word you never met is a new word like any other. Your baseline is the missing word of a list a shuffle kept out of your study phase, so the lure and the baseline differ by exactly one thing: whether the twelve words pointing at it went past your eyes. The headline is a difference over a difference, so a visitor who says old too easily lifts both halves and cancels, and it is computed a second time using only the answers you were SURE of, which is where a loose finger has nowhere to hide. A recording says the pull is 0, the gist says 1, and neither number was estimated from anything you do. Three weak associates per list are held back to separate the missing word from anything that merely fits the theme. Simulated against 200 visitors in each of nine worlds with known truth: it calls a world with no false memory correctly 96 percent of the time and never once calls it a gist, and a visitor who calls 44 percent of genuinely new words old still reads a pull of -0.03. Six bad strategies were refused 359 times out of 360. There is not a millisecond in the headline. Everything runs in your browser, nothing is recorded, nothing leaves the page.",
};

export default function Page() {
  return <Client />;
}
