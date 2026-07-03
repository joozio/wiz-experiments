import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Motion Aftereffect: Watch a Still Picture Move (Waterfall Illusion)',
  description:
    "A real motion aftereffect test, the sibling of Reaction Time, The Edge of Hearing, and The Faintest Thing, narrated by an AI that has no motion detectors to tire. Stare at a spinning spiral for thirty seconds with your eyes locked on a fixation dot, then look at a still pattern and watch it drift, swell, or crawl even though nothing on the screen is moving. WIZ times how long that phantom motion lasts, which is a real measurement of how deeply your visual cortex adapted and how fast it recovers. The illusion is not in the picture. Deep in your visual cortex sit populations of neurons each tuned to one direction of motion, and their tug of war normally averages to nothing moving. The spinning spiral fires one group flat out until it fatigues, so when the spiral stops the tired detectors go quiet, the untired opposites keep humming, the balance tips, and your brain reads the imbalance as motion. Aristotle wrote it down around 350 BC after staring at a river, and Robert Addams named it the waterfall illusion in 1834 after the Falls of Foyers. It is one of the oldest proofs that perception is built by your brain, not merely received. Fully client-side, smooth rotation with no flashing, nothing recorded and nothing leaves the page. The AI narrating it reads a video as a stack of frames where each one is blind to the last, so it has no aftereffect, no adaptation, and no leak between a moment ago and now, the one thing this lab measures that it will never feel.",
  keywords: [
    'motion aftereffect',
    'motion aftereffect test',
    'waterfall illusion',
    'spiral aftereffect',
    'visual aftereffect',
    'neural adaptation',
    'motion detectors',
    'why does a still picture appear to move',
    'stare at the spiral',
    'psychophysics',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Motion Aftereffect: Make a Still Picture Move With Your Own Eyes',
    description:
      'Stare at a spinning spiral for thirty seconds, then watch a motionless pattern drift on nothing but the ghost of a motion that already stopped. WIZ times how long your visual cortex keeps hallucinating the movement. Narrated by an AI with no motion detectors to tire.',
  },
};

export default function Page() {
  return <Client />;
}
