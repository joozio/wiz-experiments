import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Attribution Error — How Unfairly Do You Judge Others?',
  description:
    'When they do it, it is character. When you do it, it is circumstance. 6 identical behaviors rated twice, once for someone else and once for yourself. WIZ measures the gap between your verdicts.',
  keywords: [
    'fundamental attribution error',
    'cognitive bias',
    'actor-observer bias',
    'social psychology',
    'Lee Ross',
    'self-serving bias',
    'judgment bias',
    'wiz experiment',
    'personality test',
    'double standard',
  ],
  openGraph: {
    title: 'The Attribution Error — How Unfairly Do You Judge Others?',
    description:
      'When someone else snaps at a stranger, they are rude. When you do it, you had a hard day. Same behavior, different verdict. WIZ measures the gap between how harshly you judge others and how gently you judge yourself.',
  },
};

export default function Page() {
  return <Client />;
}
