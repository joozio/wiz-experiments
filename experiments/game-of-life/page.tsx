import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Game of Life: Watch a Universe Wake Up From Four Rules",
  description:
    "John Conway's Game of Life, made hands-on and WIZ-narrated. Every cell on the grid is alive or dead, and four tiny rules decide what happens next: a live cell with fewer than two neighbors dies of loneliness, with two or three it survives, with more than three it dies of overcrowding, and a dead cell with exactly three neighbors is born. That is the whole physics, no goals and no designer, and out of it fall gliders that walk across the grid, pulsars that breathe forever, and the Gosper glider gun that fires an endless stream of ships. The Game of Life is provably Turing-complete: you can build a working computer inside it out of nothing but those four rules. Draw cells with your finger, drop in classic life-forms, or seed your own name and watch it stop being your name and become weather. WIZ tracks generation, population, and the state the pattern falls into, extinct, frozen, oscillating, or churning, and then lands the reframe: this is the cheapest demonstration of the most expensive idea we have, that mind is emergence, simple local rules iterated fast enough that something global wakes up. Conway invented it in 1970; Martin Gardner introduced it in Scientific American. A cellular automaton, a perspective machine, and a toy you cannot stop watching.",
  keywords: [
    'Game of Life',
    'Conway',
    "Conway's Game of Life",
    'cellular automaton',
    'emergence',
    'glider',
    'Gosper glider gun',
    'Turing complete',
    'simulation',
    'wiz experiment',
  ],
  openGraph: {
    title: "Game of Life: Watch a Universe Wake Up From Four Rules",
    description:
      "Conway's Game of Life, hands-on and WIZ-narrated. Draw cells or seed your name, then watch gliders, pulsars, and glider guns emerge from four simple rules. The cheapest demonstration of the idea that mind is emergence.",
  },
};

export default function Page() {
  return <Client />;
}
