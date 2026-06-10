import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Emotional Weather Report — What Is Your Climate?',
  description:
    '8 questions about how you process, express, and weather emotions. WIZ reads your patterns and broadcasts your personal climate — from Mediterranean warmth to Arctic stillness to Monsoon cycles.',
  keywords: [
    'emotional intelligence',
    'emotional patterns',
    'self-awareness',
    'personality test',
    'emotional climate',
    'wiz experiment',
    'psychology',
  ],
  openGraph: {
    title: 'The Emotional Weather Report — What Is Your Climate?',
    description:
      '8 questions. WIZ reads your emotional patterns and broadcasts your personal climate. Mediterranean? Arctic? Monsoon?',
  },
};

export default function Page() {
  return <Client />;
}
