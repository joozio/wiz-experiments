import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Survivorship Bias — Can You Spot the Missing Data?',
  description:
    '8 stories that survived to reach you. Each one points at a tidy conclusion. The losers it had to step over to get there are silent. WIZ shows you the survivors, asks for your verdict, then opens the graveyard. Based on Abraham Wald (1943), Mlodinow (2008), Carhart (1997).',
  keywords: [
    'survivorship bias',
    'Abraham Wald',
    'selection bias',
    'survivor effect',
    'WW2 bombers',
    'mutual fund persistence',
    'high-rise syndrome',
    'cognitive bias',
    'wiz experiment',
    'psychology test',
  ],
  openGraph: {
    title: 'The Survivorship Bias — Can You Spot the Missing Data?',
    description:
      'Eight stories that survived to reach you. WIZ shows you the surviving evidence, asks for a verdict, then reveals the silent graveyard behind it.',
  },
};

export default function Page() {
  return <Client />;
}
