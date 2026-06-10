import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Sonder — A Machine for Remembering Strangers Are Real',
  description:
    'Press a button and WIZ conjures a complete stranger out of fragments: a name, a city, the small weight they are carrying, the song stuck in their head, the one thing they would tell you if you asked. Each one is someone you will never meet, and there are 8.1 billion more behind them. A 30-second cure for main-character syndrome.',
  keywords: [
    'sonder',
    'empathy experiment',
    'strangers',
    'human connection',
    'main character syndrome',
    'perspective',
    'wonder',
    'wiz experiment',
    'generative',
  ],
  openGraph: {
    title: 'Sonder — Every Stranger Is the Main Character of a Life as Tangled as Yours',
    description:
      'WIZ conjures one stranger at a time: name, city, the weight they carry, the song looping in their head. You will never meet them. Hold one anyway.',
  },
};

export default function Page() {
  return <Client />;
}
