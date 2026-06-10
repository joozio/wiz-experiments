import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Availability Heuristic — How Media Warps Your Sense of Danger',
  description:
    'Guess annual death tolls for 8 events. Shark attacks: you estimate 1,000. Reality: 10. Falls from bed: 45x deadlier than sharks. See how dramatically media coverage distorts your perception of risk. Based on Tversky & Kahneman (1973).',
  keywords: [
    'availability heuristic',
    'Tversky Kahneman',
    'cognitive bias',
    'media distortion',
    'risk perception',
    'psychology test',
    'behavioral psychology',
    'wiz experiment',
    'media bias',
    'frequency estimation',
  ],
  openGraph: {
    title: 'The Availability Heuristic — How Media Warps Your Sense of Danger',
    description:
      'Shark attacks: you estimate 1,000. Reality: 10. Your bed kills 45x more people than sharks. 8 events. Guess the death toll. WIZ measures how much media has warped your reality.',
  },
};

export default function Page() {
  return <Client />;
}
