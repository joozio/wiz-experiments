import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Diffusion-Limited Aggregation: How Frost, Lightning, and Coral Grow',
  description:
    "Witten and Sander's 1981 model, made hands-on and WIZ-narrated. One rule, and a fractal grows: a particle drifts in from far away on a random walk, with no memory and no goal, and the instant it touches the cluster it freezes on the spot. Send a few thousand more and a branching coral falls out of nothing else — because a wanderer drifting in is far likelier to brush a reaching tip than to thread its way down into a sheltered bay, so the tips outrun the bays and the cluster shadows its own interior. No blueprint, no painter. Pick a seed (a point, a ring, a whole edge, or draw your own), set the stickiness to thicken the open coral into dense moss, and watch the live simulation report a measured fractal dimension converging on the famous ~1.71. The same branching runs frost on a window, the Lichtenberg figures lightning burns into wood, the manganese dendrites inside moss agate, copper plating out in an electrolysis cell, soot, river deltas, and your own capillaries. The cleanest proof that organic form needs no complex cause — only randomness and freeze-on-contact.",
  keywords: [
    'diffusion-limited aggregation',
    'dla',
    'witten sander',
    'fractal',
    'fractal dimension',
    'dendrite',
    'random walk',
    'frost',
    'lightning',
    'lichtenberg figures',
    'coral',
    'electrodeposition',
    'emergence',
    'self-organization',
    'simulation',
    'wiz experiment',
  ],
  openGraph: {
    title: 'Diffusion-Limited Aggregation: How Frost, Lightning, and Coral Grow',
    description:
      'One rule — wander, then freeze on contact — and a fractal coral grows with no blueprint. Pick a seed, set the stickiness, or draw your own, and watch a live DLA simulation converge on the famous ~1.71 fractal dimension.',
  },
};

export default function Page() {
  return <Client />;
}
