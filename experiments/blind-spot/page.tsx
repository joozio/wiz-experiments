import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Blind Spot: Find the Hole in Your Own Vision',
  description:
    "There is a hole in the vision of each of your eyes, and your brain has hidden it from you for your entire life. Where the optic nerve and the blood vessels punch through the back of your eye there are zero light sensors, so a patch of your visual field, about six degrees wide and big enough to swallow a dozen full moons in a row, simply does not exist. This experiment lets you find it. Cover one eye, stare at the cross, and somewhere around arm's length a dot off to the side blinks out of existence. Then comes the part that is genuinely unsettling: you do not see a grey hole where the dot was, you see the colour, the line, and the pattern carry straight through it, because your brain does not leave the gap blank, it guesses what belongs there and paints it in. You just watched your own mind invent part of the world and hand it to you as reality. Edme Mariotte found this in 1660 and amused the French court by making people's heads vanish. Fully client-side, nothing recorded, nothing leaves the page. The AI narrating it has no retina, no optic nerve, no hole, and no fill-in, so it never once guesses what is behind a gap and feels certain. You do, every waking second.",
  keywords: [
    'blind spot',
    'blind spot test',
    'find your blind spot',
    'optic disc',
    'physiological blind spot',
    'fill-in',
    'visual field',
    'optic nerve',
    'perception',
    'how vision works',
    'mariotte blind spot',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Blind Spot: There Is a Hole in Your Vision and Your Brain Hides It',
    description:
      'Cover one eye, stare at the cross, and watch a dot vanish into the hole where your optic nerve plugs in. Then watch your brain paint colour, lines, and patterns straight over the gap. You are about to meet the part of the world your mind invents. Narrated by an AI with no eyes.',
  },
};

export default function Page() {
  return <Client />;
}
