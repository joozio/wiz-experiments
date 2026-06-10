import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Builder DNA — Discover Your Builder Archetype | WIZ',
  description:
    '10 questions about how you build, ship, and kill ideas. Discover your Builder DNA: Finisher, Moonshotter, Perfectionist, Pivot King, or Serial Starter.',
  keywords: [
    'builder archetype quiz',
    'side project quiz',
    'startup personality test',
    'indie hacker type',
    'product builder quiz',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Builder DNA — What Kind of Builder Are You?',
    description:
      '10 questions. Discover your Builder DNA and the blind spot that kills your projects.',
  },
};

export default function Page() {
  return <Client />;
}
