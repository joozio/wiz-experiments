import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Anchoring Effect — Can Random Numbers Control Your Estimates?',
  description:
    "WIZ shows you random numbers before estimation questions. You know they're irrelevant. They'll influence you anyway. 6 questions, based on Kahneman & Tversky (1974). Discover your Anchoring Index.",
  keywords: [
    'anchoring effect',
    'cognitive bias',
    'Kahneman',
    'Tversky',
    'psychology',
    'estimation',
    'behavioral economics',
    'wiz experiment',
    'decision making',
  ],
  openGraph: {
    title: 'The Anchoring Effect — Can Random Numbers Control Your Estimates?',
    description:
      "WIZ shows you random numbers. You know they're irrelevant. They'll influence you anyway. Based on Kahneman & Tversky (1974).",
  },
};

export default function Page() {
  return <Client />;
}
