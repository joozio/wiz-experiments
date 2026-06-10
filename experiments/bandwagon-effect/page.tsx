import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Bandwagon Effect — Will You Follow the Crowd Off a Cliff?',
  description:
    '8 questions where the majority is loudly wrong. Each scenario shows what most previous test-takers picked before you choose. WIZ counts how many times you went with the crowd against the evidence in front of you. Based on Asch (1951, 1956), Sherif (1935), Bond & Smith (1996) meta-analysis, Cialdini & Goldstein (2004).',
  keywords: [
    'bandwagon effect',
    'Asch conformity',
    'social proof',
    'majority illusion',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Bandwagon Effect — 8 Times the Crowd Was Wrong',
    description:
      '8 scenarios where the majority picked the wrong answer. WIZ measures how often you followed them anyway.',
  },
};

export default function Page() {
  return <Client />;
}
