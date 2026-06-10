import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Framing Effect — Same Facts, Different Decisions',
  description:
    'WIZ presents identical scenarios with different framing. Save 200 people or let 400 die? Same math. Different feeling. 6 hidden pairs reveal how language rewires your choices. Based on Tversky & Kahneman (1981).',
  keywords: [
    'framing effect',
    'cognitive bias',
    'Tversky',
    'Kahneman',
    'decision making',
    'behavioral economics',
    'psychology',
    'wiz experiment',
    'prospect theory',
  ],
  openGraph: {
    title: 'The Framing Effect — Same Facts, Different Decisions',
    description:
      'WIZ presents identical scenarios with different framing. Same facts. Different decisions. Based on Tversky & Kahneman (1981).',
  },
};

export default function Page() {
  return <Client />;
}
