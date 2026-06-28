import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Change Blindness: The Huge Change in Plain Sight You Cannot See',
  description:
    "A real change-blindness test, the fifth sibling of The Edge of Hearing, Reaction Time, The Blind Spot, and The Edge of Color, narrated by an AI that has no eyes at all. The other four found the ceiling of your ears, the floor of your reflexes, the hole your brain hides in your sight, and the finest color difference you can resolve. This one catches your attention in the act of missing the obvious. A scene of shapes appears, blinks to a blank field, then comes back with exactly one thing changed: a shape vanishes, swaps color, grows, or turns into something else. The change is not subtle. A whole circle turns red, a triangle disappears, a square doubles in size. And you can stare straight at it for thirty seconds and your mind keeps reporting nothing changed, because the blank flash wipes out the flick of motion that normally grabs your eye, and without that motion cue you have to hunt the change one object at a time. This is the flicker paradigm from the change-blindness research of the 1990s, and it works on almost everyone. WIZ times how long each change takes you to find, how many you miss entirely, and reads off what that says about how little of the world you actually hold in mind at once. The honest part: this needs a steadyish gaze, the blank is doing real work, and your screen size changes the difficulty. It is a toy for wonder, not a clinical attention test. Fully client-side: nothing is recorded, nothing leaves the page. The AI narrating it diffs two frames pixel by pixel and the changed region lights up instantly, every time, whether it is a face or a single pixel, because it is not attending, it is comparing. You, attending, can look right at a vanishing shape for a minute and never see it go, because seeing is not recording, it is a running guess refreshed only where you point it. The rich, stable world you feel is real, but almost none of it is actually stored.",
  keywords: [
    'change blindness',
    'change blindness test',
    'flicker paradigm',
    'spot the change',
    'attention test',
    'visual attention',
    'did you notice',
    'inattentional blindness',
    'how attention works',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'Change Blindness: Can You Spot the Huge Change in Plain Sight?',
    description:
      'A scene blinks, comes back with one big thing changed, and you stare straight at it and still cannot find it. That is change blindness. Narrated by an AI that diffs every pixel and never misses.',
  },
};

export default function Page() {
  return <Client />;
}
