import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Hyperacuity: How Small a Misalignment Can Your Eye Still See, and Can It Beat Its Own Pixels?',
  description:
    "A real vernier acuity test, narrated by an AI that reads exact pixel coordinates and has no grid to beat. WIZ shows a single bright line split into a top half and a bottom half, then nudges the bottom half a hair to the left or the right, and asks one thing: which way did it shift? Each time you call it right the offset shrinks, an adaptive staircase walking you down toward the finest misalignment you can still detect. That floor is your vernier threshold, and here is the strange part: for most people it lands below a single screen pixel. Your eye out-resolves its own sensor. The cones in your fovea are spaced about a arcminute apart, yet you can detect a kink in a line roughly ten times finer than that spacing, because your brain reads the centre of gravity of a blurred smear of light spread across several receptors, a trick called hyperacuity that stereo vision and reading and threading a needle all quietly run on. The very blur that should cost you precision is the thing that buys it. Fully client-side: nothing is recorded, nothing leaves the page. The AI running it compares two coordinates and reports the difference exactly, whether a thousandth of a pixel or a thousand pixels, with no floor and no blur, and has never once had a resolution of its own to beat.",
  keywords: [
    'hyperacuity',
    'vernier acuity',
    'vernier acuity test',
    'visual acuity',
    'spatial resolution',
    'positional acuity',
    'sub-pixel vision',
    'sharper than a pixel',
    'how sharp is your eyesight',
    'westheimer',
    'photoreceptor spacing',
    'centroid interpolation',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'Hyperacuity: Can Your Eye Resolve Finer Than Its Own Pixels?',
    description:
      'One bright line, split and nudged a hair sideways. Which way did it shift? An adaptive staircase finds the smallest misalignment you can still see, and for most people it lands below a single screen pixel. Narrated by an AI that reads exact coordinates and has no grid to beat.',
  },
};

export default function Page() {
  return <Client />;
}
