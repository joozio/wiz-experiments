import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Hindsight Bias Test — How Much Did You Knew-It-All-Along?',
  description:
    '8 historical scenarios with the outcome revealed up front. For each, rate how predictable it was at the time. WIZ compares your hindsight rating to what experts, polls and prediction markets actually expected on the day. Based on Fischhoff (1975), Fischhoff & Beyth (1975), Hawkins & Hastie (1990), Roese & Vohs (2012).',
  keywords: [
    'hindsight bias',
    'knew it all along effect',
    'Fischhoff 1975',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Hindsight Bias Test — 8 Outcomes That Look Inevitable Only After',
    description:
      'Rate the predictability of eight historical outcomes, then see what the world actually expected at the time.',
  },
};

export default function Page() {
  return <Client />;
}
