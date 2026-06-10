import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Self-Serving Bias — How Asymmetrically Do You Attribute Wins vs Losses?',
  description:
    '4 paired life scenarios with 8 sliders. For each outcome (promotion granted vs denied, marathon PR vs collapse, investment alpha vs underperformance, ovation vs flat speech) rate how much was YOU versus circumstance. WIZ computes your asymmetry gap against the Mezulis 2004 meta-analysis of 266 studies (Cohen d=0.96) and the Bradley 1978 founding leadership outcomes. Based on Miller & Ross (1975), Bradley (1978), Mezulis Abramson Hyde Hankin (2004), Lau & Russell (1980), Barber & Odean (2001), Zuckerman (1979).',
  keywords: [
    'self-serving bias',
    'attribution bias',
    'Mezulis 2004',
    'Miller Ross 1975',
    'Bradley 1978',
    'Lau Russell 1980 athletic attribution',
    'self-protective attribution',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Self-Serving Bias — Wins Are Mine, Losses Belong to the World',
    description:
      'Four paired scenarios. Eight sliders. WIZ measures your personal attribution asymmetry against forty years of self-serving bias research.',
  },
};

export default function Page() {
  return <Client />;
}
