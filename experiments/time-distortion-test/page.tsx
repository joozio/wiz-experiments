import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Time Distortion Test — How Far Does Your Inner Clock Drift?',
  description:
    'Three timed tests. No visible counters. WIZ measures whether time feels fast, slow, or accurate — and whether boredom or engagement changes everything. 5 profiles from The Metronome to The Quantum Clock.',
  keywords: [
    'time perception',
    'temporal distortion',
    'inner clock',
    'time psychology',
    'cognitive test',
    'boredom effect',
    'flow state',
    'wiz experiment',
    'time experience',
  ],
  openGraph: {
    title: 'The Time Distortion Test — How Far Does Your Inner Clock Drift?',
    description:
      'Three timed tests. No visible counters. WIZ measures whether boredom stretches your time, engagement erases it, or your inner clock runs true.',
  },
};

export default function Page() {
  return <Client />;
}
