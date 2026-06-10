import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Conjunction Fallacy — The Linda Problem and 7 More Twins',
  description:
    '8 character vignettes. For each one, two statements about that person — one simple, one with an extra clause that fits the stereotype. Pick which is more likely. Tversky and Kahneman (1983) found 85% of subjects picked the compound, even though A is always at least as probable as A and B. WIZ counts how often the story beat the math.',
  keywords: [
    'conjunction fallacy',
    'Linda problem',
    'Tversky Kahneman 1983',
    'representativeness heuristic',
    'probability fallacy',
    'cognitive bias',
    'wiz experiment',
    'psychology test',
    'behavioral economics',
  ],
  openGraph: {
    title: 'The Conjunction Fallacy — When the Story Beats the Math',
    description:
      '8 vignettes, 8 forced choices between a single condition and a compound that fits the stereotype. WIZ measures how often the narrative beat the probability. Based on Tversky and Kahneman (1983).',
  },
};

export default function Page() {
  return <Client />;
}
