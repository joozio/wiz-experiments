import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Loss Aversion Calculator — What Is Your Lambda?',
  description:
    'Kahneman & Tversky found that losing $100 hurts roughly twice as much as gaining $100 feels good. They called this coefficient lambda (λ). Take 8 gambles — 5 financial, 3 from real life — and discover your personal loss aversion score. Research average: λ = 2.0.',
  keywords: [
    'loss aversion',
    'lambda coefficient',
    'Kahneman Tversky',
    'prospect theory',
    'behavioral economics',
    'cognitive bias',
    'psychology test',
    'financial psychology',
    'wiz experiment',
    'decision making',
  ],
  openGraph: {
    title: 'The Loss Aversion Calculator — What Is Your Lambda?',
    description:
      'The pain of losing $100 is roughly twice the joy of gaining $100. Kahneman called this lambda. Take 8 gambles and find yours.',
  },
};

export default function Page() {
  return <Client />;
}
