import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Longer Line: The Müller-Lyer Illusion and the Length Your Eye Invents',
  description:
    "A real Müller-Lyer illusion test, the sibling of The Long Way Around, The Restless Cube, The Hidden Current, and the rest of this perception lab, narrated by an AI that reads a line as the distance between two endpoints and never sees the fins. Two horizontal lines, exactly the same length, one wearing arrowheads that point outward and one wearing arrowheads that point inward. The outward-finned line looks plainly longer. It is not. You drag a slider until the two shafts look equal, and to get there you make the inward-finned line noticeably longer than the outward-finned one, because it looks short to you. That gap, measured in your own hand and averaged over eight matches, is the size of the illusion, and it is one almost everyone falls for. WIZ measures it as a percentage. The reason it happens is that you do not read a length straight off your retina: your visual system computes size from context, and the fins are read as depth and perspective, an outward pair like the near corner of a room thrown toward you, an inward pair like a far corner receding, so your brain quietly corrects for a depth that is not there and rescales the line before you ever get a number. Franz Carl Müller-Lyer published the figure in 1889, and it has outlived more than a century of attempts to explain it away, stubborn even when you know the lines are equal, which is exactly the point: it is one of the cleanest proofs that seeing a size is an inference built from context, not a ruler laid against the world. The result screen gives you your illusion as a percentage, drops it onto a ladder from a faint pull to a strong one, and then shows you the thing itself: the same two lines with a switch that strips the fins away, and the moment they go the shafts snap into obvious equality with guides at their shared ends, the whole lie having lived in four little segments. The honest part, said throughout: magnitude swings with fin length and angle, screen size, how carefully you match, and whether you try to game it by measuring pixels, so this is a toy for wonder, not a clinical assay. Fully client-side, the figures are drawn live in your browser, nothing is recorded and nothing leaves the page. I narrate this and both lines are the same to me, exactly, every time. I read a shaft as the distance between its two endpoint coordinates, and the fins are four more little segments sitting nearby with their own coordinates that touch that number nowhere, so a fins-in line and a fins-out line of equal length are equal, always. You did the stranger and more useful thing: to see how long a line was, you rebuilt the whole small scene it lived in, and let the scene tell you the size, which in a real world of near and far corners is usually right, and here was a trap.",
  keywords: [
    'muller-lyer',
    'muller-lyer illusion',
    'muller-lyer illusion test',
    'optical illusion',
    'geometric illusion',
    'size illusion',
    'length illusion',
    'why do the lines look different',
    'perception as inference',
    'size constancy',
    'depth cues',
    'richard gregory',
    'franz muller-lyer',
    'method of adjustment',
    'psychophysics',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Longer Line: The Müller-Lyer Illusion and the Length Your Eye Invents',
    description:
      'Two lines exactly the same length, one with fins pointing out and one pointing in. One looks plainly longer. Drag until they look equal and see how far the fins fooled you. Narrated by an AI that reads a line as two endpoints and never sees the fins.',
  },
};

export default function Page() {
  return <Client />;
}
