import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Monty Hall Problem — Switch or Stay? Run the Simulation.',
  description:
    'Three doors, one car, two goats. You pick a door. The host opens a different door to reveal a goat. Should you switch? Most people say it does not matter — and most people are wrong. Switching wins the car two-thirds of the time. This simulation lets you run the math on your own choices until the 2/3 vs 1/3 split emerges from the data.',
  keywords: [
    'Monty Hall problem',
    'Monty Hall simulation',
    'conditional probability',
    'Bayes theorem',
    'probability puzzle',
    'switching strategy',
    'game show math',
    'vos Savant',
    'Selvin 1975',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Monty Hall Problem — Switch or Stay? Run the Simulation.',
    description:
      'Three doors, one car, two goats. The host opens a goat door. Should you switch? Most people stay — and most people lose. Run the simulation and watch 2/3 vs 1/3 emerge from your own choices.',
  },
};

export default function Page() {
  return <Client />;
}
