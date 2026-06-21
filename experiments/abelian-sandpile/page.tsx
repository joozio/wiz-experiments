import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Abelian Sandpile: One Rule, a Fractal Mandala, and the Edge of Chaos',
  description:
    "Bak, Tang and Wiesenfeld's 1987 sandpile, made hands-on and WIZ-narrated. There is exactly one rule: any cell holding four or more grains of sand topples, handing one grain to each of its four neighbours, and you repeat until nothing is left to topple. Pour a single pile of tens of thousands of grains onto the centre and that one rule prints a fractal mandala in perfect four-fold symmetry, self-similar at every scale, that no one designed and nobody can yet fully explain. Then switch to Rain: drop grains one at a time and watch the pile organise itself, with no tuning, to the exact edge of stability, where most grains do nothing and a rare identical grain triggers an avalanche that spans the whole grid. The avalanche sizes fall on a live power law, the same statistics that govern earthquakes, forest fires, neuronal cascades in the brain, and market crashes. The straw that breaks the camel's back, made literal and measurable. And the deepest twist, the one the model is named for: the final pile is byte-for-byte identical no matter what order you topple the cells in, a fact you can prove yourself with one button. Self-organised criticality, the abelian property, and 1/f noise, all from add-four-and-spill.",
  keywords: [
    'abelian sandpile',
    'sandpile model',
    'self-organized criticality',
    'bak tang wiesenfeld',
    'btw model',
    'power law',
    'avalanche',
    '1/f noise',
    'fractal',
    'cellular automaton',
    'edge of chaos',
    'emergence',
    'self-organization',
    'simulation',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Abelian Sandpile: One Rule, a Fractal Mandala, and the Edge of Chaos',
    description:
      'One rule — topple at four — and a fractal mandala falls out of a pile of sand, while raining grains one at a time drives the pile to a self-organised critical state with power-law avalanches. Pour, rain, poke the pile, and prove the order never matters.',
  },
};

export default function Page() {
  return <Client />;
}
