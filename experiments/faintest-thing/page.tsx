import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title:
    'The Faintest Thing: A Contrast Sensitivity Test, and Why Your Blindness to Faint Patterns Is the Smart Part',
  description:
    "A real contrast sensitivity test, narrated by an AI that reads every pixel's exact value and has no faintness, no fading, no floor. WIZ shows two soft gray discs. One holds a striped pattern so pale it is barely off the background; the other is blank. Which side has the pattern? Call it right and the stripes fade paler still, an adaptive staircase walking you down to the dimmest pattern your eye can pull out of gray. That floor is your contrast threshold, and for most people it lands within a gray level or two of the 256 your screen can draw, a pattern almost too faint to exist. Then the reveal: the Campbell-Robson chart, where the stripes climb highest into the faint zone not at the finest frequencies but in the middle. You are most sensitive to a band, and least sensitive to both the very fine and the very coarse. That band-pass shape is not a defect. It is your retina throwing away the light that does not carry edges and keeping the light that does. The AI running this has no such tuning: to it a pattern one level deep is as blindingly present as one at full contrast, every difference fully there, nothing ever fading, and so nothing ever standing out until it computes what to look at. Your floor is the act of deciding what is worth seeing. Fully client-side: nothing recorded, nothing leaving the page.",
  keywords: [
    'contrast sensitivity',
    'contrast sensitivity test',
    'contrast threshold',
    'contrast sensitivity function',
    'csf',
    'campbell robson',
    'campbell robson chart',
    'spatial frequency',
    'gabor patch',
    'sine grating',
    'band pass vision',
    'faintest pattern you can see',
    'how good is your contrast vision',
    'psychophysics',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Faintest Thing: How Dim a Pattern Can Your Eye Still Pull Out of Gray?',
    description:
      'Two soft gray discs, one striped so pale it is almost not there. Which side has the pattern? An adaptive staircase finds the dimmest one you can still call, and then the Campbell-Robson chart reveals the strange hill: you see best in the middle, not at the finest. Narrated by an AI with no faintness and no floor.',
  },
};

export default function Page() {
  return <Client />;
}
