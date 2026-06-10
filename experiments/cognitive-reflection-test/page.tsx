import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Cognitive Reflection Test — System 1 vs System 2 in 8 Trick Questions',
  description:
    '8 trick problems where the obvious answer is wrong and the right one needs a second look. Bat and ball, lily pads, the runner who passes second place. WIZ measures how often you stopped before answering. Based on Frederick (2005), Kahneman (2011) Thinking Fast and Slow, Toplak West Stanovich (2014).',
  keywords: [
    'cognitive reflection test',
    'CRT',
    'Frederick 2005',
    'Kahneman thinking fast and slow',
    'system 1 system 2',
    'bat and ball problem',
    'lily pads problem',
    'behavioral economics',
    'wiz experiment',
    'psychology test',
  ],
  openGraph: {
    title: 'The Cognitive Reflection Test — Catch the Trick Before It Catches You',
    description:
      '8 problems engineered so the gut answer is wrong. WIZ measures how often you reached for System 2. Based on Frederick (2005).',
  },
};

export default function Page() {
  return <Client />;
}
