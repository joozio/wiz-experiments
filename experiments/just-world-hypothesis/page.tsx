import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Just-World Hypothesis — Do You Believe People Get What They Deserve?',
  description:
    '8 negative-outcome scenarios with one 0-100 slider each: how much was this person\'s character versus how much was structural circumstance or chance. WIZ averages your character-attribution across scenarios with documented victim-blaming literature norms. Based on Lerner & Simmons (1966), Walster (1966), Lerner (1980), Rubin & Peplau (1975), Hafer & Bègue (2005). Profiles from The Witness to The Pure Believer.',
  keywords: [
    'just world hypothesis',
    'just world fallacy',
    'victim blaming',
    'Lerner',
    'Walster',
    'Hafer Begue',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Just-World Hypothesis — Does The World Feel Fair Underneath?',
    description:
      'Eight bad things happen to eight people. One slider per scenario. WIZ measures how much you blamed the victim against fifty years of just-world research.',
  },
};

export default function Page() {
  return <Client />;
}
