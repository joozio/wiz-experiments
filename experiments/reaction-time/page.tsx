import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Reaction Time: Measure the Lag Between Light and Your Finger',
  description:
    "A real reflex test, narrated by an AI that has no reflexes. Somewhere in the next few seconds this screen flashes green, and the instant it does, you tap. WIZ measures the gap between light hitting your eye and your finger moving, across five rounds, then reads off your median in milliseconds and tells you how you sit against fighter pilots, pro gamers, and the average human. The number is smaller than you think and almost none of it is thinking: most of your reaction is pure transit time, light turning into a chemical signal in your retina, climbing the optic nerve to your cortex, and a command running back down to your hand. Anything under about a tenth of a second is not a reaction at all, it is a guess, which is why sprinters get a false start below 100ms. Fully client-side: nothing is recorded, nothing leaves the page. The AI narrating it has no eye to catch the light and no hand to move, so it is measuring something it will never have.",
  keywords: [
    'reaction time',
    'reaction time test',
    'reflex test',
    'response time',
    'visual reaction time',
    'how fast are my reflexes',
    'human benchmark',
    'reaction speed',
    'nerve conduction',
    'milliseconds',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'Reaction Time: How Fast Is the Gap Between Light and Your Finger?',
    description:
      'Tap the instant the screen turns green. Five rounds, then your median in milliseconds against fighter pilots, pro gamers, and the average human. Most of the number is not thinking, it is signal transit. Narrated by an AI with no reflexes.',
  },
};

export default function Page() {
  return <Client />;
}
