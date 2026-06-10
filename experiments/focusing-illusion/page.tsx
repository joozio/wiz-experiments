import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Focusing Illusion — How Much Will That Life Event Actually Change You?',
  description:
    '8 life events where people predict their happiness will transform and the data shows it barely moves. California, doubled salary, marriage, $1M lottery, paraplegia, dream house, promotion, 30 pounds lost. WIZ measures your focusing-illusion gap. Based on Schkade & Kahneman (1998), Brickman Coates Janoff-Bulman (1978), Lucas et al. (2003), Kahneman & Deaton (2010), Killingsworth Kahneman Mellers (2023), Ubel et al. (2005), Boyce & Oswald (2012), Jackson Steptoe Wardle (2014).',
  keywords: [
    'focusing illusion',
    'hedonic adaptation',
    'affective forecasting',
    'Kahneman',
    'happiness',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Focusing Illusion — Predict Happiness After 8 Big Life Events, Compare to Research',
    description:
      'Eight life events where people overestimate happiness change. WIZ measures your focusing-illusion gap.',
  },
};

export default function Page() {
  return <Client />;
}
