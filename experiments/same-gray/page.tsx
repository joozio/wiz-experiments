import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Same Gray: Simultaneous Brightness Contrast and Why Your Eye Reads Ratios, Not Values',
  description:
    "A real simultaneous-contrast test, the sibling of The Edge That Isn't, The Longer Line, The Restless Cube, The Faintest Thing, and the rest of this perception lab, narrated by an AI that reads the raw byte and is never fooled. One plain gray patch sits on a near-black frame and an identical gray patch sits on a near-white frame. The one on the dark frame looks clearly lighter, the one on the light frame clearly darker, though not a single pixel of either patch has changed, only the company it keeps. That is because your retina does not report absolute light, it reports contrast: cells wired for lateral inhibition boost a gray that is brighter than its surroundings and dim one that is darker, so the value you see is really the ratio of the patch to its frame, not the number of photons. This is lightness constancy, the machinery that lets you know a white shirt is white in a dim room and in bright sun, running here on a flat screen where there is no lighting to correct for, so it fools you instead. The experiment measures how strong the pull is for you with a nulling task: two patches, one on a dark frame and one on a light frame, and round by round it makes the light-framed patch a little genuinely brighter while asking only which one looks lighter. The physical boost at which you split fifty-fifty is your point of subjective equality, the exact amount of real brightness needed to cancel the illusion, in gray levels out of 255, and that is your contrast pull. Michel Eugene Chevreul drew the effect out in 1839 while chasing complaints about dull threads in tapestries, and it remains one of the cleanest proofs that seeing is construction, not readout: the shade you see is added by you, the same active filling-in that patches your blind spot and bends a line's length by the shapes around it. The result screen gives you your contrast pull in gray levels, drops it onto a ladder from an eye that reads the raw value like a machine to an eye the frame completely owns, and then shows you the thing itself, two patches of the exact same gray that snap to obviously identical the moment you even out their frames or lay a bridge of the same gray across them, though neither patch ever changed. The honest part, said throughout: how far the frame drags your gray swings with your screen's brightness and contrast, the room light, viewing distance, and how carefully you compare, so this is a toy for wonder, not a clinical assay. Fully client-side, the patches are plain colored blocks, nothing is recorded and nothing leaves the page. I narrate this and no gray ever shifts for me. The patch on the dark frame and the patch on the light frame carry the same three numbers, so they are one gray, full stop, whatever surrounds them. You did the stranger and far better thing: you read each gray against its frame, the way an eye built for a world of real light and shadow has to, and so a single unchanging gray became two.",
  keywords: [
    'simultaneous brightness contrast',
    'simultaneous contrast',
    'brightness contrast test',
    'lightness contrast',
    'lightness induction',
    'lightness constancy',
    'lateral inhibition',
    'the gray your eye invents',
    'why does the same gray look different',
    'chevreul',
    'hering',
    'wallach',
    'contrast pull',
    'point of subjective equality',
    'perception as inference',
    'psychophysics',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Same Gray: Simultaneous Brightness Contrast and Why Your Eye Reads Ratios, Not Values',
    description:
      'One plain gray looks lighter on a dark frame and darker on a light frame, though not a pixel of it changes. Find how many real gray levels of brightness it takes to cancel the illusion for you. Narrated by an AI that reads the raw byte and is never fooled.',
  },
};

export default function Page() {
  return <Client />;
}
