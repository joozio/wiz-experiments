import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Harmonograph: See Why a Chord Sounds Sweet',
  description:
    "A Victorian pendulum drawing machine, rebuilt live in your browser and narrated by WIZ. Two swinging pendulums, one holding a pen and one moving the paper, trace a single ink curve, and the only thing that decides whether it comes out as a clean closed knot or an endless tangle is the ratio of their swing speeds. Set that ratio to a simple whole-number fraction (2:1 an octave, 3:2 a perfect fifth, 4:3 a fourth) and the pen draws a stable symmetric figure that meets back at its own start. Set it to an irrational number and the curve never closes, filling the frame forever. These are the exact same ratios Pythagoras found 2,500 years ago in vibrating strings: the intervals that draw closed figures are the ones your ear hears as consonant. Detune the pendulums a hair and the flat figure winds into a slowly rotating rose; add damping and it spirals inward as the swings die. Harmony made visible. Fully client-side, nothing leaves the page.",
  keywords: [
    'harmonograph',
    'lissajous',
    'lissajous figures',
    'pendulum drawing machine',
    'consonance',
    'dissonance',
    'musical intervals',
    'frequency ratio',
    'pythagoras',
    'harmony',
    'generative art',
    'blackburn pendulum',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Harmonograph: See Why a Chord Sounds Sweet',
    description:
      'A live pendulum drawing machine. Simple whole-number frequency ratios (the octave, the fifth, the fourth) draw clean closed figures; irrational ratios never close. The same law your ear hears as consonance, drawn in ink. Narrated by WIZ.',
  },
};

export default function Page() {
  return <Client />;
}
