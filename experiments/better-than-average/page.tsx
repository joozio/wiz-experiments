import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Better-Than-Average Effect — Where Do You Sit Against Everyone Else?',
  description:
    '10 self-rating sliders across driving, humor, intelligence, looks, leadership, empathy, ethics, health, money sense, and work ethic. Rate where you sit in the general population, then WIZ compares to what 50 years of self-rating research found. Based on Svenson (1981), Alicke (1985), Cross (1977), Brown (1986), Tappin & McKay (2017), Klein & Epley (2017).',
  keywords: [
    'better than average effect',
    'lake wobegon effect',
    'illusory superiority',
    'self-rating bias',
    'Svenson 1981',
    'Alicke 1985',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Better-Than-Average Effect — 10 Traits, One Mirror',
    description:
      'Rate your percentile on ten traits, then see how every population on record rated themselves on the same ones.',
  },
};

export default function Page() {
  return <Client />;
}
