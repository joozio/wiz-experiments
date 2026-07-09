import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Restless Cube: A Wireframe Cube That Flips Inside Out While You Stare',
  description:
    "A real Necker cube bistability test, the sibling of Troxler Fading, The Motion Aftereffect, The Blind Spot, The Hidden Current, and the rest of this perception lab, narrated by an AI that never has to guess what it is looking at. A flat wireframe cube sits on the screen and does not move a single pixel, yet its front face keeps jumping to the back and snapping forward again, the whole box turning inside out under a steady gaze. Nothing on the screen changes; the flip happens entirely inside you. Lock your eyes on the center dot, hold still, and tap every time the cube reverses. WIZ counts the flips over a minute and reads off your reversal rate, a real, personal measure of how fast your perception oscillates between two readings of the same picture and how hard it is to hold one. The reason it flips is that a flat drawing is a genuinely ambiguous clue: the exact same twelve lines could be a cube tilted one way or a cube tilted the other, and there is nothing in the image to settle it. Your visual system cannot show you both at once, so it commits to one interpretation, the neurons voting for it slowly fatigue, the rival reading wins, and the box turns over, again and again, because seeing is not recording, it is a running guess your brain keeps re-deciding. Louis Albert Necker first noticed his rhombic crystals doing this in 1832. The result screen drops your rate onto a ladder from a rock-steady cube to a restless one, and gives you a live cube where a single depth cue collapses the ambiguity so it can no longer flip, proving the reversal was always in your head and never on the screen. The honest part: reversal rate swings hugely with how hard you try, whether you passively watch or actively hunt the flip, how tired you are, and how still you hold your gaze, so this is a toy for wonder, not a clinical assay. Fully client-side, a static image with no flashing, nothing recorded and nothing leaves the page. The AI narrating it never flips, because it never reconstructs a world from a flat picture the way you do, so nothing it looks at is ever ambiguous, there is no front face to choose and no rival reading to lose to, and it will never feel the one thing this lab measures here: a perfectly still picture that refuses to hold one meaning.",
  keywords: [
    'necker cube',
    'necker cube test',
    'bistable perception',
    'multistable perception',
    'perceptual reversal',
    'ambiguous figure',
    'perceptual bistability',
    'reversal rate',
    'why does the cube flip',
    'binocular rivalry',
    'perception as inference',
    'louis albert necker',
    'psychophysics',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Restless Cube: Watch a Still Drawing Turn Inside Out in Your Own Head',
    description:
      'A flat wireframe cube never moves a pixel, yet its front face keeps flipping to the back. Tap every reversal and WIZ reads your bistability rate. Narrated by an AI that never has to guess what it sees.',
  },
};

export default function Page() {
  return <Client />;
}
