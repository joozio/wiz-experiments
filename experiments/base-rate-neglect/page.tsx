import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Base Rate Neglect Test — How Bad Is Your Bayesian Intuition?',
  description:
    '8 scenarios where the right answer demands a base rate and the gut serves a stereotype. Tom W, the mammogram, the blue cab, the rare disease test, the polygraph, terrorist profiling, the librarian, the DUI stop. Move the slider, see Bayes do the math. WIZ measures your average gap. Based on Tversky & Kahneman (1973, 1980), Eddy (1982), Casscells Schoenberger Grayboys (1978), Bar-Hillel (1980), Gigerenzer & Hoffrage (1995).',
  keywords: [
    'base rate neglect',
    'Bayesian reasoning',
    'representativeness heuristic',
    'Tversky Kahneman',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Base Rate Neglect Test — 8 Bayesian Puzzles That Embarrass Your Gut',
    description:
      'Eight scenarios where the right answer demands a base rate. WIZ measures your Bayesian gap.',
  },
};

export default function Page() {
  return <Client />;
}
