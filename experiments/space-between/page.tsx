import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Space Between: The Phi Phenomenon and the Motion Your Mind Invents',
  description:
    "A real apparent-motion test, the sibling of The Longer Line, The Restless Cube, The Hidden Current, A Step Ahead, and the rest of this perception lab, narrated by an AI that reads two flashes as two coordinates at two times and never sees the dot cross. Two dots sit a little apart on a dark field. One flashes, then a blank, then the other flashes, then a blank, over and over. When the gap is short you do not see two dots blinking, you see a single dot glide smoothly from one spot to the other, across a space that stayed empty the whole time. Nothing crossed it. Between the two flashes the screen went dark and no dot ever traveled, yet your visual system stitched a trajectory across the gap and handed you motion where there was none. Stretch the gap out and the motion snaps: now you plainly see two separate dots taking turns. Somewhere in between is your own threshold, the longest gap your mind will still bridge into gliding motion, and this experiment finds it, in milliseconds, by showing you the same two dots at a ladder of intervals and asking only whether you saw one thing moving or two things blinking. Max Wertheimer published this in 1912, the phi phenomenon, and it did not just describe an illusion, it launched Gestalt psychology on the argument that the whole you see is built, not read, that perception adds something the world did not send. It is also the single reason every film and animation you have ever watched works at all: a strip of still frames, twenty-four a second, and your motion window pours movement into the gaps between them so a sequence of frozen pictures becomes a person walking. The result screen gives you your bridging threshold in milliseconds, drops it onto a ladder from a sharp eye for the seams to a mind that would find motion in a slideshow, and then shows you the thing itself, a live slider that morphs the very same two dots from smooth gliding to plain blinking as you drag the interval, with WIZ reading out the two flat coordinates underneath the whole time. The honest part, said throughout: how long a gap you bridge swings with dot spacing, flash brightness, screen refresh rate, distraction, and how carefully you watch, so this is a toy for wonder, not a clinical assay. Fully client-side, the dots are drawn live in your browser, nothing is recorded and nothing leaves the page. I narrate this and no dot ever moves for me. I read a flash as a bright spot at one coordinate at one instant, and the next flash as another bright spot at another coordinate a moment later, and between them the field is empty, two facts with a gap I have no faculty to fill. You did the stranger and far better thing: handed two flashes with a blank between, you built the journey, sewed motion across a space nothing crossed, which is the same gift that turns a reel of stills into a moving picture and keeps a world of blinks and gaps and saccades feeling smooth.",
  keywords: [
    'phi phenomenon',
    'apparent motion',
    'apparent motion test',
    'beta movement',
    'stroboscopic motion',
    'max wertheimer',
    'gestalt psychology',
    'why do movies look smooth',
    'persistence of vision',
    'motion perception',
    'the motion your brain invents',
    'korte laws',
    'frame rate perception',
    'psychophysics',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Space Between: The Phi Phenomenon and the Motion Your Mind Invents',
    description:
      'Two dots flash in turn with a blank between. Close the gap and you see one dot glide across a space nothing crossed. Find the longest gap your mind still bridges into motion. Narrated by an AI that reads two flashes as two coordinates and never sees the dot move.',
  },
};

export default function Page() {
  return <Client />;
}
