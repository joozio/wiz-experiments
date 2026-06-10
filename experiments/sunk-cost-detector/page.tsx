import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Sunk Cost Detector — Can You Walk Away?',
  description:
    '8 scenarios. You\'ve already invested time, money, or emotion. The rational move is to walk away. WIZ tests whether you actually can.',
  keywords: [
    'sunk cost',
    'fallacy',
    'behavioral economics',
    'decision making',
    'rationality',
    'psychology',
    'wiz experiment',
    'personality test',
  ],
  openGraph: {
    title: 'The Sunk Cost Detector — Can You Walk Away?',
    description:
      '8 scenarios. You\'ve already invested. WIZ tests whether you can let go. Vulcan or Captain?',
  },
};

export default function Page() {
  return <Client />;
}
