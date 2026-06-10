import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Peak-End Rule — Why Your Memory Lies About Your Life',
  description:
    'Kahneman proved your brain remembers experiences by two moments only: the peak and the end. Duration gets deleted. 6 pairs of experiences — pick which you would remember more fondly. WIZ measures how much your memory ignores the rest.',
  keywords: [
    'peak-end rule',
    'Kahneman',
    'memory bias',
    'duration neglect',
    'cognitive bias',
    'remembering self',
    'experiencing self',
    'behavioral psychology',
    'wiz experiment',
    'psychology test',
  ],
  openGraph: {
    title: 'The Peak-End Rule — Why Your Memory Lies About Your Life',
    description:
      'Your brain remembers the peak and the end. Duration? Deleted. A 10-day vacation with a bad final day gets filed as bad. 6 experiences. Pick which you would remember more fondly. WIZ calculates the distance between what you lived and what you recall.',
  },
};

export default function Page() {
  return <Client />;
}
