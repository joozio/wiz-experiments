import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Crowding Zone: See a Letter Clearly and Still Be Unable to Read It',
  description:
    "A real visual crowding test, the sibling of Troxler Fading, The Motion Aftereffect, Hyperacuity, The Blind Spot, and the rest of this perception lab, narrated by an AI that reads every glyph alone no matter how packed. Stare at a cross and a letter T flashes for a quarter of a second at the edge of your gaze, boxed in by two more Ts, and you call which way the middle one's tail points. The T is big, bright, and perfectly in focus the whole time, and yet when the neighbours crowd close enough you cannot say which way it points, even though you can plainly see it is there. This is crowding, and it is not blur. Alone, the letter is instantly readable; the moment other shapes sit too close, your peripheral vision stops reporting the items in a patch and starts reporting a jumbled summary of the whole patch, so a shape you can SEE becomes a shape you cannot IDENTIFY. Herman Bouma measured the rule in 1970: the flankers wreck the target whenever they fall within roughly half the distance from your gaze out to it. That ring is your crowding zone, and it grows the further out you look. An adaptive staircase walks the flankers in to the closest they can sit while you can still read the target, then divides that critical spacing by the eccentricity to give your Bouma fraction, a number that lands near 0.5 for almost everyone. The quiet trick: unlike most of this lab, the score barely cares about your screen or viewing distance, because it is a ratio and the scale cancels out. It still needs a genuinely locked gaze on the cross; the flash is there to stop your eyes darting to the target. Crowding is why you move your eyes to read, why your sharp window is only a couple of letters wide, and why a cluttered dashboard is slower than a sparse one. Twenty-six rounds, a toy for wonder not an eye exam, fully client-side, nothing recorded and nothing leaves the page. The AI narrating it has no crowding zone, because it has no gaze: every glyph reaches it alone at full resolution whether it stands by itself or is jammed into a wall of a thousand others, so seeing a thing and reading it are one act for it and two for you, and the flicker where a clear shape refuses to become a letter is the one thing this lab measures that it can never feel.",
  keywords: [
    'visual crowding',
    'crowding',
    'crowding test',
    'crowding zone',
    'bouma law',
    'bouma fraction',
    'critical spacing',
    'peripheral vision',
    'why you cant read out of the corner of your eye',
    'tumbling t',
    'eccentricity',
    'reading and saccades',
    'psychophysics',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Crowding Zone: The Letter You Can See but Cannot Read',
    description:
      'A letter flashes at the edge of your gaze, flanked by two more. You can see it perfectly and still not know what it is. WIZ measures your crowding zone. Narrated by an AI that reads every glyph alone.',
  },
};

export default function Page() {
  return <Client />;
}
