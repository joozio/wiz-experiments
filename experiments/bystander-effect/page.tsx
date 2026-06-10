import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Bystander Effect — Would You Help When Others Are Watching?',
  description:
    '8 emergency scenarios in 4 hidden pairs across cardiac collapse on a subway platform (Darley & Latane 1968 founding seizure paradigm with documented 85% alone vs 31% in a 6-person group, a 54-point intervention gap), smoke seeping under an office door (Latane & Darley 1968 ambiguous-emergency paradigm with 75% alone vs 38% in a 3-person group), a stranger collapsed on a quiet street (Latane & Rodin 1969 lady-in-distress with 70% alone vs 7% with a passive stranger), and a child struggling in shallow water at a lakeshore (Cramer McMaster Bartell & Dragna 1988 cost-benefit emergency band). Each pair shows the same emergency twice — once you are the only witness, once you are one of many. WIZ measures your Bystander Gap: average intervention likelihood when alone minus when in a group. Profiles from The Witness (gap <5) through The Vanished (>50) based on Latane & Nida (1981) Psychological Bulletin 56-study meta and Fischer Krueger Greitemeyer Vogrincic Kastenmuller Frey Heene Wicher & Kainbacher (2011) Psychological Bulletin 105-study meta showing d=0.45 across decades and continents.',
  keywords: [
    'bystander effect',
    'Darley Latane 1968',
    'Kitty Genovese',
    'diffusion of responsibility',
    'pluralistic ignorance',
    'evaluation apprehension',
    'group size effect',
    'social psychology',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Bystander Effect — Would You Help When Others Are Watching?',
    description:
      'Four emergencies, each presented twice. Once you are the only person who could act. Once you are one of many. Same person, same emergency, opposite role. WIZ measures the gap that 60 years of experimental data say opens the moment a crowd assembles.',
  },
};

export default function Page() {
  return <Client />;
}
