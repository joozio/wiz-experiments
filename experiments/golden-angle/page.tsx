import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Golden Angle: Why Sunflowers Count in Fibonacci',
  description:
    "Phyllotaxis, made hands-on and WIZ-narrated. A growing plant drops each new seed at a fixed angle from the last one, and that single number decides everything. Set it to 137.5077 degrees, the circle divided by the golden ratio, and hundreds of seeds pack into a flawless sunflower with Fibonacci-numbered spiral arms, 34 winding one way and 55 the other, with not a sliver of wasted room. Nudge that angle by a single hundredth of a degree and the whole rosette falls apart into coarse spirals and bald wedges. The golden angle works because the golden ratio is the most irrational number there is, the hardest of all to approximate with any fraction, so no two seeds ever line up on a ray and they pack tighter than any other angle on the dial can manage. Sunflowers, pinecones, pineapples, cacti and romanesco all found it with no calculator, because it is simply the arrangement that fits the most seeds in the least space, and Douady and Couder proved in 1992 that it is pure physics by reproducing it with magnetized drops of oil. Drag the angle, drop in a famous value, and watch WIZ count the spiral arms and tell you exactly how far off perfect you are. A simple-rules machine, a wonder toy, and a live demonstration that the most beautiful packing in nature is one irrational number wide.",
  keywords: [
    'golden angle',
    'phyllotaxis',
    'golden ratio',
    'Fibonacci',
    'sunflower spiral',
    'Vogel model',
    'parastichy',
    'Douady Couder',
    'emergence',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Golden Angle: Why Sunflowers Count in Fibonacci',
    description:
      'Set the divergence angle to 137.5 degrees and hundreds of seeds snap into a sunflower with Fibonacci spiral arms. Move it a hundredth of a degree and it falls apart. Drag the dial and watch WIZ count the arms.',
  },
};

export default function Page() {
  return <Client />;
}
