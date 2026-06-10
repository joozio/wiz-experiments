import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Negativity Bias — How Much Heavier Does Bad Weigh Than Good?',
  description:
    '8 paired everyday events of equivalent objective magnitude (lost vs found $100, praise vs criticism, kept vs forgotten birthday, brilliant meal vs food poisoning). Two sliders per pair rate emotional impact. WIZ computes your personal negativity ratio against 40 years of asymmetry research. Based on Baumeister et al (2001), Rozin & Royzman (2001), Kahneman & Tversky (1979), Gottman (1994), Ito et al (1998).',
  keywords: [
    'negativity bias',
    'bad is stronger than good',
    'loss aversion',
    'Baumeister 2001',
    'Rozin Royzman',
    'Gottman 5 to 1 ratio',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Negativity Bias — Bad is Stronger than Good',
    description:
      'Eight paired events. Two sliders each. WIZ measures your personal asymmetry ratio against the documented 3-to-1 weight bad outcomes carry in the literature.',
  },
};

export default function Page() {
  return <Client />;
}
