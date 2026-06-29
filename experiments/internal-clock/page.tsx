import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Internal Clock: How Long Is a Second When Nothing Is Counting?',
  description:
    "A real time-perception test, narrated by an AI that has never felt a single second pass. WIZ names a duration, hides every clock, and asks you to let go when it feels like the time is up, with one rule: do not count. Across five intervals it reads off your internal second, whether your clock runs hot or slow, and how steady it is. Most people are off by more than they expect, and the error grows with the interval in a very specific way: your timing blur is not a fixed number of seconds, it is a fixed fraction of whatever you are timing, the same scalar signature you carry for brightness, weight, and loudness. There is no clock organ. Your sense of time is reconstructed from a pacemaker of pulses that dopamine speeds up when you are afraid and slows when you are happy, which is why a watched pot crawls, an afternoon of flow evaporates, and every year feels faster than the last. Fully client-side: nothing is recorded, nothing leaves the page. The AI narrating it can read two timestamps and tell you 4.2 seconds elapsed to the microsecond, but it never waited through them, never once was bored.",
  keywords: [
    'time perception',
    'internal clock',
    'time perception test',
    'interval timing',
    'how long is a minute',
    'sense of time',
    'estimate time without counting',
    'scalar timing',
    'webers law',
    'why time speeds up with age',
    'pacemaker accumulator',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Internal Clock: Find Out How Fast Your Sense of Time Runs',
    description:
      'No timer, no counting. WIZ names a duration and you let go when it feels right. Five rounds, then your internal second, whether your clock runs hot or slow, and Weber\'s law hiding in your errors. Narrated by an AI that has never felt a second pass.',
  },
};

export default function Page() {
  return <Client />;
}
