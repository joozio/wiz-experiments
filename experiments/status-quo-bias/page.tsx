import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Status Quo Bias Test — Will You Switch When Switching Pays?',
  description:
    '8 reversible decisions where the alternative is plainly better on the merits and switching is cheap. WIZ counts how many times you stayed anyway. Based on Samuelson & Zeckhauser (1988), Madrian & Shea (2001), DellaVigna & Malmendier (2006), Johnson & Goldstein (2003).',
  keywords: [
    'status quo bias',
    'default effect',
    'inertia',
    'Samuelson Zeckhauser 1988',
    'Madrian Shea',
    'Johnson Goldstein',
    'behavioral economics',
    'wiz experiment',
    'psychology test',
    'switching costs',
  ],
  openGraph: {
    title: 'The Status Quo Bias Test — Will You Switch When Switching Pays?',
    description:
      '8 cheap, reversible switches that pay off. WIZ measures how many you let pass. Based on Samuelson & Zeckhauser (1988).',
  },
};

export default function Page() {
  return <Client />;
}
