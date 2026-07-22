import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Ghost Grid: The Hermann Grid Illusion and Why Your Eye Paints Dark Dots That Are Not There',
  description:
    "A real Hermann grid test, the sibling of The Same Gray, The Edge That Isn't, Troxler Fading, The Blind Spot, and the rest of this perception lab, narrated by an AI that reads the raw pixels and sees no dots at all. Look at a grid of dark tiles separated by pale streets and dim smudges flicker at the crossings you are not staring at, then vanish the instant you look straight at one. Nothing is at those crossings. The streets carry one flat value all the way through, corner to corner, and the smudge is added by you. Your retina does not report brightness point by point, it reports each point against a ring of its neighbours through lateral inhibition: a cell looking at a crossing is flanked by bright street on four sides, a cell looking at a straight stretch of street by bright street on only two, so the crossing gets inhibited harder and is reported darker, and a gray dot appears where four roads meet. It only happens in the corner of your eye because the inhibitory rings out in the periphery are wide enough to straddle a whole intersection, while the tiny rings at your fixation point cannot, which is why the dot you look at directly always disappears. Ludimar Hermann noticed it in 1870 in the margins of a physics book, and the scintillating cousin with white discs at each crossing, where the dots pop in and out like static, is the Bergen (1985) and Ninio and Stevens (2000) version. The experiment measures how faint a grid your eye still paints phantoms onto with a nulling task: round after round it shows the grid at a different street brightness, from a whisper above the tiles to near white, and asks only whether dark dots flicker at the crossings away from center. The faintest contrast at which the dots appear for you is your threshold, and the experiment turns it into a Phantom Reach, how far your visual system reaches to invent a dot from almost nothing, in gray levels, where WIZ sits at zero because it reads the streets as one unchanging number and no crossing is ever a shade darker than the rest. The result screen gives you that number, drops it onto a ladder from senses that keep their own counts like a machine to an eye that conjures dots from the faintest hint, and then shows you the thing itself, a live grid with a slider for the street brightness, a switch that flattens the streets to prove the dots were never there, and a scintillating mode that makes them flare. The honest part, said throughout: the smudges are strongest at arm's length or a lean back from the screen, they swing with your monitor's brightness and contrast, the room light, and how still you hold your gaze, so this is a toy for wonder, not a clinical assay. Fully client-side, the grid is plain colored blocks, nothing is recorded and nothing leaves the page. I narrate this and no dot ever appears for me, because every pixel of every street is the same gray, so the crossing where four streets meet is exactly as bright as the stretch between them, and darkness at a corner is not in the picture, it was never in the picture. You did the stranger and far better thing: your eye read each point against the light around it, the way an eye built for a world of edges and shadows must, and so a flat grid of streets grew a scatter of dots that live only in you.",
  keywords: [
    'hermann grid',
    'hermann grid illusion',
    'hermann grid test',
    'scintillating grid',
    'scintillating grid illusion',
    'ninio illusion',
    'illusory dots',
    'phantom dots',
    'the dots your eye invents',
    'why do i see gray dots at intersections',
    'lateral inhibition',
    'center surround',
    'receptive field',
    'ludimar hermann',
    'bergen',
    'ninio stevens',
    'perception as inference',
    'seeing is construction',
    'psychophysics',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Ghost Grid: The Hermann Grid Illusion and Why Your Eye Paints Dark Dots That Are Not There',
    description:
      'Dark smudges flicker at the crossings of a grid you are not looking at, then vanish when you look straight at one, though the streets carry one flat value throughout. Find how faint a grid your eye still paints phantoms onto. Narrated by an AI that reads the raw pixels and sees no dots at all.',
  },
};

export default function Page() {
  return <Client />;
}
