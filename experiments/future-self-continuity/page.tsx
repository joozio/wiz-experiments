import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Future Self Continuity Test — How Connected Are You to Who You Become?',
  description:
    '10 dimensions measure how similar you feel to the version of you 20 years from now. Hershfield (2011) showed the strength of that bond predicts savings, exercise, and procrastination. WIZ scores your continuity index and tells you which profile you match.',
  keywords: [
    'future self continuity',
    'Hal Hershfield',
    'FSCS scale',
    'temporal discounting',
    'retirement savings psychology',
    'procrastination',
    'identity over time',
    'wiz experiment',
    'psychology test',
  ],
  openGraph: {
    title: 'The Future Self Continuity Test — Meet Yourself in 20 Years',
    description:
      'Rate 10 dimensions of how similar you are to future-you. Hershfield (2011) found the size of the gap predicts savings, health, and procrastination. WIZ scores your continuity index.',
  },
};

export default function Page() {
  return <Client />;
}
