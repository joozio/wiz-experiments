import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Endowment Effect — What Does Ownership Do to a Price?',
  description:
    '8 valuation scenarios in 4 hidden pairs across coffee mug (Kahneman Knetsch & Thaler 1990 founding mug paradigm), NCAA Final Four ticket (Carmon & Ariely 2000 Duke basketball lottery 14x ratio), childhood book (Strahilevitz & Loewenstein 1998 ownership-duration), and raffle ticket (Knetsch & Sinden 1984 founding empirical demonstration). Each pair shows the same item twice — once you own it (set your selling price), once you might buy it (set your buying price). 0-100 price slider where 50 = fair market price. WIZ measures your Endowment Gap: average selling price minus average buying price across the four pairs. Profiles from The Detached (gap <15) through The Forever Mine (>70) based on Horowitz & McConnell (2002) 45-study meta-analysis WTA/WTP median ratio of 2.6 and Sayman & Öncüler (2005) Decision Analysis meta-analysis.',
  keywords: [
    'endowment effect',
    'Kahneman Knetsch Thaler',
    'Richard Thaler 1980',
    'loss aversion',
    'WTA WTP gap',
    'mug experiment',
    'Carmon Ariely',
    'behavioral economics',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Endowment Effect — What Does Ownership Do to a Price?',
    description:
      'Four items, each priced twice. Once as the owner. Once as the buyer. Same person, same item, opposite role. WIZ measures the gap that 40 years of experimental data say appears the moment ownership is assigned.',
  },
};

export default function Page() {
  return <Client />;
}
