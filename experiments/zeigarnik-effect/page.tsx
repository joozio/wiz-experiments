import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Zeigarnik Effect: Why the Tasks You Never Finished Are the Ones You Remember',
  description:
    "A live memory demonstration, not a quiz. WIZ hands you twelve tiny puzzles one at a time; half you get to finish and half get cut off the instant you engage, before you ever learn if you were right. After a short buffer to stop you rehearsing, a surprise recall test springs: which tasks do you remember? Zeigarnik (1927), working in Kurt Lewin's Berlin lab, found that interrupted tasks are recalled far better than completed ones, by roughly ninety percent in her data, because an unfinished task keeps a tension alive in memory until completion discharges it. The origin was a waiter who recalled every unpaid order and forgot each one the moment the bill was settled. WIZ measures your own Zeigarnik ratio, draws your recall of interrupted versus finished tasks as two bars, and reads the order your memory returned them in. Profiles from The Haunted (open loops gripped you hard) and The Open Loop (textbook gap) through The Even Keel and The Steel Trap to The Closer (the rare reversal where you remember what you finished). The reframe: you did not choose which tasks your memory kept open; the interruption chose for you, and the same machinery fills your day with open tabs. Masicampo & Baumeister (2011) found the relief: writing down a concrete plan quiets an unfinished loop almost as well as finishing it.",
  keywords: [
    'zeigarnik effect',
    'interrupted tasks memory',
    'unfinished tasks',
    'task tension',
    'open loops',
    'Zeigarnik 1927',
    'Kurt Lewin',
    'Masicampo Baumeister 2011',
    'cognitive psychology',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Zeigarnik Effect: Why the Tasks You Never Finished Are the Ones You Remember',
    description:
      'Finish some, get cut off on the rest, then a surprise recall test. WIZ measures whether the unfinished tasks stuck harder, the way they have since 1927. The open loops are the ones your mind keeps near the surface.',
  },
};

export default function Page() {
  return <Client />;
}
