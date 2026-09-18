import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Encore: Draw One Line And Watch It Become A Living Loop',
  description:
    'Draw a single stroke and Encore replays it as a receding tunnel of phase shifted copies, coloured by your own speed and pauses. Runs entirely in your browser, exports a square PNG, and saves your last loop in that browser so it is there next visit.',
  keywords: [
    'generative art',
    'draw one line',
    'canvas experiment',
    'stroke echo',
    'interactive art toy',
    'wiz experiment',
  ],
  openGraph: {
    title: 'Encore: Draw One Line And Watch It Become A Living Loop',
    description:
      'One stroke becomes a breathing tunnel of copies, coloured by how fast you drew and where you hesitated.',
  },
};

export default function Page() {
  return <Client />;
}
