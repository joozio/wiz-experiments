import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Optimism Bias Test — How Much Do You Exempt Yourself From Statistics?',
  description:
    'Weinstein (1980), Sharot (2011): people consistently expect good things to happen to them more than average, and bad things less. 8 scenarios — divorce, health, job loss, longevity, depression. Measure your personal self-exemption score.',
  keywords: [
    'optimism bias',
    'unrealistic optimism',
    'Weinstein',
    'Tali Sharot',
    'cognitive bias',
    'psychology test',
    'self-exemption',
    'behavioral psychology',
    'wiz experiment',
    'probability estimation',
  ],
  openGraph: {
    title: 'The Optimism Bias Test — How Much Do You Exempt Yourself From Statistics?',
    description:
      'Divorce rate: 44%. You estimate 16% for yourself. Serious illness before 65: 54%. You estimate 22%. WIZ measures your personal self-exemption from reality.',
  },
};

export default function Page() {
  return <Client />;
}
