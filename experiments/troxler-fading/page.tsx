import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Troxler Fading: Watch a Ring of Color Erase Itself From Your Own Vision',
  description:
    "A real Troxler fading test, the sibling of The Motion Aftereffect, The Blind Spot, Reaction Time, and the rest of this perception lab, narrated by an AI whose sight never fades. Lock your eyes on a single fixation dot and a ring of soft, low-contrast colored blobs around it dissolves within seconds, washing to the same flat gray as the field even though every blob is still on the screen exactly as bright as before. You have not closed your eyes and you are looking right at them; they are simply no longer part of what you see. The fade is not in the picture. Your visual system is built to report change, not to re-send you a constant, so neurons carrying an unchanging peripheral stimulus adapt, their firing sags, and the brain fills the gap with the surrounding field, the same fill-in it runs at your blind spot. The only thing that normally saves the image is that your eyes are never truly still: tiny involuntary flicks called microsaccades refresh the retina a few times a second. Hold your gaze rock steady and you suppress them, the refresh stops, adaptation wins, and the edge of your vision erases itself. WIZ times how long the whole ring takes to vanish, a real measurement of how fast your peripheral vision adapts and how still you can hold your eyes. Ignaz Troxler described it in 1804. Fully client-side, a static image with no flashing, nothing recorded and nothing leaves the page. The AI narrating it has no fovea and no periphery, no microsaccades, no adaptation, and nothing that fades, so it will never watch part of its own sight switch off from holding still, the one thing this lab measures that it can never feel.",
  keywords: [
    'troxler fading',
    'troxler effect',
    'troxler fading test',
    'peripheral fading',
    'perceptual fading',
    'filling in',
    'neural adaptation',
    'microsaccades',
    'why do things disappear when you stare',
    'fixation',
    'psychophysics',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'Troxler Fading: Delete a Ring of Color From Your Vision by Holding Still',
    description:
      'Lock your eyes on one dot and a ring of colors around it erases itself from your own sight within seconds, while it is still on the screen exactly as bright as before. WIZ times the vanish. Narrated by an AI whose sight never fades.',
  },
};

export default function Page() {
  return <Client />;
}
