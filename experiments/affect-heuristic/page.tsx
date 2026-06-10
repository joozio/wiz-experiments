import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Affect Heuristic — Is Emotion Doing Your Risk-Benefit Math?',
  description:
    '10 technologies and activities (nuclear power, vaccines, GM food, social media, AI, alcohol, pesticides, EVs, smartphones, microwaves). Two sliders each: HARM 0-100 and BENEFIT 0-100. WIZ computes the Pearson correlation between your harm and benefit ratings. The real world tradeoff is weakly positive; the affect heuristic makes it strongly negative. Profiles from The Calibrated Realist to The Pure Affect. Based on Alhakami & Slovic (1994), Finucane Alhakami Slovic Johnson (2000), Slovic Finucane Peters MacGregor (2007), Slovic (1987), Kahneman (2011) ch12.',
  keywords: [
    'affect heuristic',
    'risk benefit correlation',
    'Slovic',
    'Alhakami',
    'Finucane',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Affect Heuristic — Your Feeling Is Doing Both Sides Of The Math',
    description:
      'Ten things. Two sliders each. WIZ measures the negative correlation your gut put between harm and benefit, the signature of emotion driving the judgment.',
  },
};

export default function Page() {
  return <Client />;
}
