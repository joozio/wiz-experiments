import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Default Effect — How Much Does the Pre-Checked Box Decide?',
  description:
    '8 paired policy scenarios across 4 domains (organ donation, retirement, vaccination, electricity). Each pair: same population, same choice, only the default differs. You predict take-up percentage on a 0-100 slider for each. WIZ measures your Default Effect Gap: average predicted opt-out take-up minus average predicted opt-in take-up. Compares to the documented gap from Johnson & Goldstein (2003) Science vol 302 founding 11-country organ-donation study, Madrian & Shea (2001) QJE vol 116 401(k) auto-enrollment, Chapman Li Colby & Yoon (2010) JAMA vol 304 flu-shot scheduling, Pichert & Katsikopoulos (2008) JEP vol 28 green electricity. Profiles from The Default-Blind (gap <10) to The Choice Architect (>60).',
  keywords: [
    'default effect',
    'choice architecture',
    'opt-in opt-out',
    'Eric Johnson Daniel Goldstein',
    'Richard Thaler Cass Sunstein',
    'nudge theory',
    'Madrian Shea',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Default Effect — How Much Does the Pre-Checked Box Decide?',
    description:
      'Eight policy scenarios across organ donation, retirement, vaccination, and electricity. Each presented twice — once opt-in, once opt-out. You predict take-up. WIZ measures the gap between your prediction and 40 years of choice-architecture data.',
  },
};

export default function Page() {
  return <Client />;
}
