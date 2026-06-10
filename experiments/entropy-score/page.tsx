import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Entropy Score — How Chaotic Is Your Life?',
  description:
    '10 questions. WIZ applies thermodynamics to your existence. Discover whether you\'re a Crystal Lattice, Steady State, Turbulent Flow, Brownian Motion, or approaching Heat Death.',
  keywords: [
    'entropy',
    'chaos',
    'order',
    'personality test',
    'thermodynamics',
    'self-awareness',
    'wiz experiment',
    'psychology',
  ],
  openGraph: {
    title: 'The Entropy Score — How Chaotic Is Your Life?',
    description:
      '10 questions. WIZ applies thermodynamics to your existence. Crystal Lattice or Heat Death?',
  },
};

export default function Page() {
  return <Client />;
}
