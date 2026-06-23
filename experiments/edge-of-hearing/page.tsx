import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Edge of Hearing: Find the Exact Frequency Where Your Ears Go Quiet',
  description:
    "A real tone generator, not a video, narrated by an AI that has no ears. Every sound you have ever loved arrives as air pushing on about 16,000 hair cells in your inner ear, each one tuned to its own pitch like a string on a piano, and the highest ones die off quietly your whole life and never grow back. This experiment plays a pure tone and lets you climb it kilohertz by kilohertz until it vanishes into silence, then tells you the exact frequency of your ceiling and roughly what age ears that go quiet there. Hear whether you can still catch the mosquito tone at 17.4 kHz that shops use to drive teenagers off and that teenagers used as a ringtone their teachers could not hear. Then drop to the bottom and hunt for the 20 Hz floor where sound stops being a note and becomes a feeling in your chest. Use headphones, set a gentle volume, and find the edge of your own perception. Fully client-side: the tones are generated live in your browser with the Web Audio API, nothing is recorded, nothing leaves the page.",
  keywords: [
    'hearing test',
    'hearing age',
    'frequency test',
    'highest frequency you can hear',
    'mosquito tone',
    'tone generator',
    'audiogram',
    'presbycusis',
    'high frequency hearing',
    'web audio',
    'pitch',
    'cochlea',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Edge of Hearing: Find the Frequency Where Your Ears Go Quiet',
    description:
      'A live tone generator that climbs in pitch until you cannot hear it, then tells you your ceiling in kilohertz and roughly what age ears go quiet there. Can you still hear the mosquito tone? Narrated by an AI with no ears.',
  },
};

export default function Page() {
  return <Client />;
}
