import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Illusion of Control — Do You Feel In Charge of Random Things?',
  description:
    '8 chance scenarios where the outcome is genuinely random and people feel like it is not. Picked lottery numbers, dice rolls, slot timing, surgeons with identical records, the wheel and the road. WIZ counts how many times you behaved as if you had control over a coin flip. Based on Langer (1975), Strickland Lewicki Katz (1966), Wohl Enzle (2002), Fenton-O\'Creevy (2003), Slovic (1987), Taylor (1983).',
  keywords: [
    'illusion of control',
    'Langer 1975',
    'cognitive bias',
    'randomness',
    'gambling',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Illusion of Control — 8 Times You Felt In Charge of Pure Chance',
    description:
      '8 scenarios where the outcome is random and people behave as if it is not. WIZ measures your control illusion score.',
  },
};

export default function Page() {
  return <Client />;
}
