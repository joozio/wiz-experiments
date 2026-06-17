import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Logistic Map: One Knob From Order to Chaos',
  description:
    "Deterministic chaos, made hands-on and WIZ-narrated. The logistic map is one line of arithmetic, x next = r x (1 - x), a toy population model with a single knob: the growth rate r. Turn it up and watch a steady value split into two, then four, then eight, the doublings arriving faster and faster, until at r = 3.56995 it breaks into chaos: an equation with no randomness in it anywhere that you can never predict, where two orbits started a billionth apart fly to opposite ends in a few steps. Folded inside the chaos are islands of perfect order, the period-3 window the most famous. Drag the dial and watch the whole bifurcation diagram, the fig tree, light up while a live cobweb plot settles, cycles, or shatters. The route in is universal: the same Feigenbaum constant 4.6692 governs dripping faucets and fibrillating hearts. Robert May 1976, Mitchell Feigenbaum, Li and Yorke's Period Three Implies Chaos. Determinism never promised predictability, and this is where math learned the difference.",
  keywords: [
    'logistic map',
    'bifurcation diagram',
    'chaos theory',
    'deterministic chaos',
    'period doubling',
    'Feigenbaum constant',
    'Lyapunov exponent',
    'Robert May',
    'cobweb plot',
    'butterfly effect',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Logistic Map: One Knob From Order to Chaos',
    description:
      "One line of arithmetic, one knob. Turn it up and a steady number splits into two, then four, then breaks into chaos you can never predict, with no randomness anywhere. Drag the dial across the fig tree and find the edge.",
  },
};

export default function Page() {
  return <Client />;
}
