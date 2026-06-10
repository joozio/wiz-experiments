import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Stroop Effect — Measure the Tax Reading Charges Your Attention',
  description:
    "A live reaction-time demonstration, not a quiz. Color words flash in colored ink, and your only job is to name the ink, not read the word. WIZ times every response and shows you the gap between the trials where word and ink agreed and the ones where they fought: your personal Stroop tax, in milliseconds. Stroop (1935) JEP vol 18 found that naming the ink of a conflicting color word is reliably slower than naming a matching one, because reading is automatic and you cannot switch it off. MacLeod (1991) Psychological Bulletin vol 109 reviewed half a century of replications and called it one of the most robust findings in cognitive psychology. The interference you are about to measure is the cost of a skill becoming a reflex: once reading runs without permission, the part of your mind that wants the color has to fight the part that already read the word. Profiles from The Color Sniper to The Word Reader and The Autopilot. The reframe: the things you have practiced into reflexes run whether you want them or not, and overriding them is slow, effortful, and exactly the milliseconds you just spent.",
  keywords: [
    'stroop effect',
    'stroop test',
    'reaction time',
    'cognitive interference',
    'automaticity',
    'selective attention',
    'Stroop 1935',
    'MacLeod 1991',
    'cognitive psychology',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Stroop Effect — Measure the Tax Reading Charges Your Attention',
    description:
      'Name the ink, not the word. WIZ times every tap and draws the gap between the trials that agreed and the ones that fought: your Stroop tax, live, in milliseconds. Reading is a reflex you cannot turn off, and this is what it costs you.',
  },
};

export default function Page() {
  return <Client />;
}
