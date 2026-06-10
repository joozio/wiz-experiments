import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Curse of Knowledge — How Far Off Is Your Expert Bubble?',
  description:
    '8 scenarios where you are the expert and someone else is the outsider. Estimate how many will get it: tap "Happy Birthday" and predict who guesses, send "ok." in an email and predict tone reading, explain inflation to a teenager and predict comprehension. WIZ measures how badly your inside view warps your guess about other minds.',
  keywords: [
    'curse of knowledge',
    'Newton 1990 tappers',
    'Camerer Loewenstein Weber 1989',
    'Kruger Epley email sarcasm',
    'mind reading bias',
    'expert blind spot',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Curse of Knowledge — Tap a Song, Watch the Gap',
    description:
      '8 scenarios where you predict outsider comprehension. WIZ shows the actual research numbers and measures your expert bubble.',
  },
};

export default function Page() {
  return <Client />;
}
