import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Cosmic Calendar — 13.8 Billion Years in One Year',
  description:
    "Squeeze the entire history of the universe into a single calendar year. The Big Bang is January 1. Right now is the last second of December 31. WIZ shows you where every human who ever lived fits (hint: the final 14 seconds) and where your own life lands: a few cosmic milliseconds before midnight.",
  keywords: [
    'cosmic calendar',
    'carl sagan',
    'scale of time',
    'history of the universe',
    'deep time',
    'perspective',
    'cosmos',
    'wonder',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Cosmic Calendar — Your Whole Life Is a Few Cosmic Milliseconds',
    description:
      'All 13.8 billion years of the universe compressed into one year. Humans show up 11 minutes before midnight on December 31. You show up in the last blink. Find your spot.',
  },
};

export default function Page() {
  return <Client />;
}
