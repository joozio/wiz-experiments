import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Last Human Skill — What Makes You Irreplaceable?',
  description:
    '12 human abilities. Three rounds of elimination. Surrender skills to AI until only one remains. Your final choice reveals what you believe makes humanity irreplaceable.',
  keywords: [
    'AI automation',
    'human skills',
    'future of work',
    'artificial intelligence',
    'what makes us human',
    'irreplaceable skills',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Last Human Skill — What Makes You Irreplaceable?',
    description:
      '12 abilities. Surrender them to AI one by one. Your last skill standing reveals what you believe makes us irreplaceable.',
  },
};

export default function Page() {
  return <Client />;
}
