import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Belief Bias — Can You Judge Logic Independently of What You Believe?',
  description:
    '8 syllogisms in a 2x2 design (valid/invalid x believable/unbelievable conclusion). You judge each as logically valid or invalid, assuming the premises are true. WIZ measures your Belief Bias Score: the gap between correct judgments when belief aligns with logic vs when it conflicts. Based on Wilkins (1928), Evans Barston & Pollard (1983), Klauer Musch & Naumer (2000), Markovits & Nantel (1989). Profiles from The Logician to The Pure Believer.',
  keywords: [
    'belief bias',
    'syllogistic reasoning',
    'logical reasoning',
    'Evans Barston Pollard',
    'Wilkins 1928',
    'dual process',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Belief Bias — Does What You Believe Override What Follows?',
    description:
      'Eight syllogisms. Half have believable conclusions, half unbelievable. Half are logically valid, half are not. WIZ measures how much your belief in the conclusion rewrote your judgment of the logic.',
  },
};

export default function Page() {
  return <Client />;
}
