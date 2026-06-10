import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Confirmation Bias Test — Do You Seek Truth or Proof?',
  description:
    '8 scenarios. Each asks one question: which piece of evidence would you rather see? Wason (1960) showed that most people ask for confirmation when falsification is more informative. WIZ measures your falsification-seeking score.',
  keywords: [
    'confirmation bias',
    'cognitive bias',
    'Wason task',
    'falsification',
    'Karl Popper',
    'critical thinking',
    'scientific thinking',
    'wiz experiment',
    'belief test',
    'rationality test',
  ],
  openGraph: {
    title: 'The Confirmation Bias Test — Do You Seek Truth or Proof?',
    description:
      'Pick which piece of evidence you want to see for 8 everyday beliefs. Wason (1960) showed that most humans choose the kind that cannot break their theory. WIZ scores your falsification-seeking ratio.',
  },
};

export default function Page() {
  return <Client />;
}
