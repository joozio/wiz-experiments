import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Spotlight Effect — How Big Is Your Mental Stage?',
  description:
    'Gilovich, Medvec & Savitsky (1999): people estimate ~50% notice their embarrassing t-shirt. Actual: 23%. The Spotlight Effect is the illusion that you are more visible, more observed, more scrutinized than you are. 8 scenarios. Discover your personal spotlight radius.',
  keywords: [
    'spotlight effect',
    'social anxiety',
    'self-consciousness',
    'cognitive bias',
    'Gilovich',
    'behavioral psychology',
    'psychology test',
    'social visibility',
    'wiz experiment',
    'embarrassment psychology',
  ],
  openGraph: {
    title: 'The Spotlight Effect — How Big Is Your Mental Stage?',
    description:
      'You estimate 50% of people noticed your stumble. Research says 27%. Discover how much larger your perceived spotlight is than reality.',
  },
};

export default function Page() {
  return <Client />;
}
