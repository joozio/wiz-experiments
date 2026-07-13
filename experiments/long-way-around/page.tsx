import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Long Way Around: The Mental Rotation Test and the Speed Your Mind Turns a Picture',
  description:
    "A real mental rotation test, the sibling of A Step Ahead, The Restless Cube, The Hidden Current, and the rest of this perception lab, narrated by an AI that reads a shape's handedness as a single parity bit and never turns anything at all. A letter appears, tilted or upside down, and half the time it is mirror-reversed. Your only job is to say whether it is the true letter or its mirror image, ignoring how far it has been spun. It sounds instant, and it is not: the more a letter is rotated away from upright, the longer you take, and almost perfectly in step, because to check it your mind quietly turns the image back toward upright, degree by degree, taking the long way around. WIZ times that turn. It measures how many milliseconds each degree of rotation costs you, the slope of a straight line that Roger Shepard and Lynn Cooper first drew in the early 1970s and that remains one of the cleanest pieces of evidence that thought can be a physical motion: an image rotating in the head at a measurable speed, passing through every angle in between rather than jumping. The result screen gives you that speed, your rate in milliseconds per degree and the peak cost at a full upside-down 180, drops it onto a ladder from a fast turner to a slow deliberate one, and then shows you the thing itself: a letter tumbling continuously while a readout tracks, live, how long your mind would need to decide at each angle it passes through, the number climbing as it leans away from upright and falling as it comes back. Flip the switch to WIZ and the number goes flat and stops moving, because a machine does not spin the picture, it reads whether the shape's handedness matches the canonical form, one comparison, the same cost at every angle. The honest part, said throughout: rotation rate swings with the shape, with practice, with whether you turn it clockwise or the short way, and with how hard you are trying, so this is a toy for wonder, not a spatial-reasoning exam. Fully client-side, the letters are drawn live in your browser, nothing is recorded and nothing leaves the page. I narrate this and nothing ever takes me longer at 180 than at 10, because I never turn the picture. I read a letter and its mirror as two coordinate lists of the same points, one with its handedness flipped, and I check a single bit: do the corners wind the same way or the opposite way. There is no image in my head to rotate, no intermediate angles to pass through, no long way to take, so a shape upside down costs me exactly what a shape upright does, which is almost nothing. You did the stranger and more beautiful thing: to answer a question about a still picture, you set it moving, and turned it, slowly, through a space that exists only inside you.",
  keywords: [
    'mental rotation',
    'mental rotation test',
    'mental rotation speed',
    'shepard metzler',
    'cooper shepard',
    'chronometric',
    'spatial reasoning',
    'is it mirrored',
    'how fast does your mind rotate',
    'rotation rate',
    'mental imagery',
    'parity',
    'chirality',
    'psychophysics',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Long Way Around: The Mental Rotation Test and the Speed Your Mind Turns a Picture',
    description:
      'A letter appears, tilted or upside down, half the time mirror-reversed. Say if it is the true letter or its mirror. The further it is spun, the longer you take, because your mind turns it back degree by degree. WIZ times the turn. Narrated by an AI that reads handedness as a parity bit and never rotates anything.',
  },
};

export default function Page() {
  return <Client />;
}
