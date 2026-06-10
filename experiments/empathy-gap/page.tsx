import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Empathy Gap — Can Your Cold Brain Simulate Your Hot Brain?',
  description:
    '8 scenarios where you are calm right now and have to predict the behavior of your future hungry, angry, scared, exhausted, embarrassed, in-pain, or craving self. Move the slider. WIZ shows what hot-state research actually measures. Based on Loewenstein (1996, 1999, 2005), Van Boven & Loewenstein (2003), Read & Loewenstein (1999), Nordgren Pligt Harreveld (2009), Wansink & Read (2002), Sayette Loewenstein Griffin Black (2008).',
  keywords: [
    'empathy gap',
    'hot cold empathy gap',
    'Loewenstein',
    'visceral influences',
    'restraint bias',
    'cognitive bias',
    'affective forecasting',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Empathy Gap — 8 Hot-State Predictions Your Cold Brain Will Botch',
    description:
      'Eight scenarios where you, calm right now, have to forecast your hot-state self. WIZ measures the gap between your cold prediction and what hot-state research actually finds.',
  },
};

export default function Page() {
  return <Client />;
}
