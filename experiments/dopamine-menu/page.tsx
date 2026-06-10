import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Dopamine Menu — What Feeds Your Brain?',
  description:
    '8 scenarios. WIZ maps your instinctive choices to your dopamine reward circuit. Discover whether you\'re a Creator, Connector, Explorer, or something rarer.',
  keywords: [
    'dopamine',
    'reward circuit',
    'personality test',
    'self-awareness',
    'neuroscience',
    'wiz experiment',
    'psychology',
    'motivation',
  ],
  openGraph: {
    title: 'The Dopamine Menu — What Feeds Your Brain?',
    description:
      '8 scenarios. WIZ maps your reward circuit. Creator? Connector? Explorer? Consumer? Find out.',
  },
};

export default function Page() {
  return <Client />;
}
