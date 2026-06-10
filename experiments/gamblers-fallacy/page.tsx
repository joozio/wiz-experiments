import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Gambler\'s Fallacy — When the Wheel Has No Memory',
  description:
    '8 streak scenarios. Roulette, coin flips, lottery numbers, slot machines, the 1913 Monte Carlo black-26 run, plus two skill-based events where the hot hand is actually real. For each, decide whether reversal is due, continuation is hot, or the next event is independent. WIZ counts how often you bet against randomness.',
  keywords: [
    'gambler\'s fallacy',
    'Monte Carlo fallacy',
    'maturity of chances',
    'hot hand fallacy',
    'Miller Sanjurjo 2018',
    'Tversky Kahneman 1971',
    'law of small numbers',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Gambler\'s Fallacy — Does the Wheel Remember?',
    description:
      '8 streak scenarios. Roulette, coin flips, the 1913 Monte Carlo black-26 incident, plus skill-based hot-hand cases. WIZ measures how often you expect randomness to "even out."',
  },
};

export default function Page() {
  return <Client />;
}
