import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Finitude Test — Do You Actually Believe You Will Die?',
  description:
    'You\'ve always known you will die. But does that knowledge actually reach the part of your brain that makes decisions? 8 questions. WIZ measures your mortality awareness.',
  keywords: [
    'mortality',
    'finitude',
    'death awareness',
    'existential',
    'philosophy',
    'psychology',
    'wiz experiment',
    'personality test',
  ],
  openGraph: {
    title: 'The Finitude Test — Do You Actually Believe You Will Die?',
    description:
      'You\'ve always known it ends. WIZ tests whether that knowledge reaches the part of your brain that makes decisions.',
  },
};

export default function Page() {
  return <Client />;
}
