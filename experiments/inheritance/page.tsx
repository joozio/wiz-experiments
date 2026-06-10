import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Inheritance - How Much of You Is Actually Yours?',
  description:
    'Rate 10 life dimensions on how much you inherited vs chose. Discover your Independence Index and profile: Archive, Branch, Transplant, Renovator, or Pioneer.',
  keywords: [
    'self discovery quiz',
    'identity audit',
    'inherited beliefs',
    'independence index',
    'who am i quiz',
    'cultural conditioning',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Inheritance - How Much of You Is Actually Yours?',
    description:
      'Rate 10 life dimensions on how much you inherited vs chose. Discover your Independence Index and profile.',
  },
};

export default function Page() {
  return <Client />;
}
