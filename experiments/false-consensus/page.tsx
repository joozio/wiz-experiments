import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The False Consensus Effect — How Much Do You Project Yourself Onto Everyone Else?',
  description:
    '8 binary preference scenarios. For each, you pick a side, then estimate the percent of people who share your view. WIZ reveals the actual survey number and measures your projection. Based on Ross, Greene & House (1977), Marks & Miller (1987) meta-analysis, Krueger & Clement (1994), Mullen et al. (1985).',
  keywords: [
    'false consensus effect',
    'social projection',
    'Ross Greene House',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The False Consensus Effect — 8 Scenarios That Measure How Far You Project Yourself',
    description:
      'Pick a side, predict how many agree, compare to real polls. WIZ measures your projection gap.',
  },
};

export default function Page() {
  return <Client />;
}
