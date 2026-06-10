import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Illusory Truth Effect — Does Familiarity Feel Like Truth To You?',
  description:
    '12 plausible statements rated 0-100 for truth in round one. 18 statements in round two (the same 12 plus 6 new ones). WIZ measures the lift on your truth ratings for the repeated statements compared with the new ones, and on the repeated false statements compared with your own round-one ratings. The illusory truth effect: repetition makes claims feel more true, even when the second exposure adds no new information and even when the claim contradicts what you already know. Based on Hasher Goldstein & Toppino (1977), Dechêne Stahl Hansen & Wänke (2010) meta of 51 studies, Fazio Brashier Payne & Marsh (2015), Brashier Eliseev & Marsh (2020). Profiles from The Skeptic to The Echo.',
  keywords: [
    'illusory truth effect',
    'repetition truth',
    'familiarity heuristic',
    'Hasher Goldstein Toppino',
    'Dechêne',
    'Fazio',
    'cognitive bias',
    'misinformation',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Illusory Truth Effect — Repetition Becomes Truth',
    description:
      'Twelve statements, one truth slider each. Round two mixes the old with the new. WIZ measures the lift that familiarity put on your sense of truth.',
  },
};

export default function Page() {
  return <Client />;
}
