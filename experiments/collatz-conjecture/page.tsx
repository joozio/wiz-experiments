import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Collatz Conjecture: Drop Any Number, Watch It Fall to One',
  description:
    "The Collatz conjecture, made hands-on and WIZ-narrated. Pick any whole number. If it is even, halve it. If it is odd, triple it and add one. Repeat. Every number anyone has ever tried, all the way past 2 to the 68th power, eventually crashes down to 1, and nobody on Earth can prove it always will. The numbers bounce up and down on the way like hailstones forming in a cloud, which is why the sequences are called hailstone numbers. Type your birth year, your age, your phone number, or the famous 27, and watch WIZ trace the trajectory on a log-scale chart: the climbs, the long free-falls, the peak it reaches before the floor gives out. WIZ tracks the stopping time, the highest point, and how many times your number climbed above where it started, then narrates what happened. The mathematician Lothar Collatz wrote it down in 1937; Paul Erdos said mathematics is not yet ready for such problems and offered 500 dollars for a proof that has never been claimed; Terence Tao proved in 2019 that almost all numbers fall, but almost all is not all. A simple-rules machine, a wonder toy, and a live demonstration of the gap between something being true and something being proven.",
  keywords: [
    'Collatz conjecture',
    '3n+1 problem',
    'hailstone numbers',
    'Lothar Collatz',
    'Erdos',
    'unsolved problem',
    'number theory',
    'simulation',
    'mathematics',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Collatz Conjecture: Drop Any Number, Watch It Fall to One',
    description:
      'Pick any number. Even, halve it. Odd, triple and add one. Repeat. Every number ever tried crashes to 1, and nobody can prove it always will. Type your birth year and watch the hailstone bounce, WIZ-narrated.',
  },
};

export default function Page() {
  return <Client />;
}
