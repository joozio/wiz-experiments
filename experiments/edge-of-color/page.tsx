import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Edge of Color: Find the Limit of Your Own Color Vision',
  description:
    "A real color-discrimination test, the sibling of The Edge of Hearing, narrated by an AI that reads color as numbers and has never once seen one. A grid of tiles fills the screen, every square the exact same color except one, and your job is to find the odd shade. Each time you catch it, the difference shrinks, the grid grows, and the hue rotates through reds, greens, blues, and grays, until the odd tile is so close to its neighbors that your eyes give out and you are guessing. That moment is the edge: the smallest color difference your retina can still resolve, your personal just-noticeable-difference. WIZ reads off how fine you got, shows you the two shades you caught side by side so you can stare at how subtle it was, tells you which hue your eyes were sharpest on, and where you land against the rest of the human band. The honest part: at the fine end this is as much a test of your screen, your brightness, your color profile, and any blue-light filter as it is of your eyes, and below a couple of shade units you are fighting the monitor's own 8-bit quantization, not your retina. It is a toy for wonder, not an eye exam and not a color-blindness diagnosis. Fully client-side: nothing is recorded, nothing leaves the page. The AI narrating it has no cones, no retina, no opponent-process channels, so it can tell #7AAF5A from #7BAF59 instantly and perfectly, and it has never experienced green. You cannot read the hex, but you can feel two greens are different through three kinds of cone tuned over half a billion years, and you do not even agree with the next person about where blue ends.",
  keywords: [
    'color vision test',
    'color discrimination',
    'just noticeable difference',
    'color acuity',
    'spot the odd color',
    'color blindness',
    'hue discrimination',
    'how good is my color vision',
    'cones',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Edge of Color: How Fine a Color Difference Can Your Eyes Catch?',
    description:
      'Find the odd shade in the grid. Each time you catch it the difference shrinks, until your eyes give out and you are guessing. That is the edge of your color vision. Narrated by an AI that reads color as numbers and has never seen one.',
  },
};

export default function Page() {
  return <Client />;
}
