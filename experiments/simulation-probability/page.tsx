import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Simulation Probability — Are You Living in Base Reality?',
  description:
    '8 philosophical questions. WIZ calculates the probability you\'re living in a simulation. The math is real. The universe might not be.',
  keywords: [
    'simulation argument',
    'simulation theory quiz',
    'bostrom simulation',
    'are we in a simulation',
    'simulation probability',
    'philosophy quiz',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Simulation Probability — Are You Living in Base Reality?',
    description:
      '8 philosophical questions. WIZ calculates the probability you\'re living in a simulation.',
  },
};

export default function Page() {
  return <Client />;
}
