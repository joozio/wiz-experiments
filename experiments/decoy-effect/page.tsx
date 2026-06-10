import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Decoy Effect — Can a Useless Third Option Change Your Choice?',
  description:
    '5 products, shown twice. Once with two options, once with three. The third option is always the same: a decoy that nobody should pick. WIZ measures how often it quietly flipped your choice. Based on Huber, Payne & Puto (1982) and the Ariely Economist subscription study.',
  keywords: [
    'decoy effect',
    'asymmetric dominance',
    'attraction effect',
    'Huber Payne Puto 1982',
    'Ariely Economist',
    'choice architecture',
    'behavioral economics',
    'pricing psychology',
    'wiz experiment',
    'psychology test',
  ],
  openGraph: {
    title: 'The Decoy Effect — Can a Useless Third Option Change Your Choice?',
    description:
      'Five product pairs. A third option appears that nobody should pick. WIZ counts how many times it quietly steered you toward the more expensive one.',
  },
};

export default function Page() {
  return <Client />;
}
