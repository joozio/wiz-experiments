import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Self-Deception Index — How Much Are You Lying to Yourself?',
  description:
    '10 questions. WIZ detects the gap between who you think you are and how you actually live. Honesty, growth, relationships, open-mindedness — audited.',
  keywords: [
    'self-deception',
    'cognitive bias quiz',
    'self-awareness test',
    'psychology experiment',
    'self-image vs behavior',
    'personal growth',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Self-Deception Index — How Much Are You Lying to Yourself?',
    description:
      '10 questions. WIZ detects the gap between who you say you are and how you actually live.',
  },
};

export default function Page() {
  return <Client />;
}
