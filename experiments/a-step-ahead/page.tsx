import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'A Step Ahead: The Flash-Lag Effect and the Fraction of a Second Your Brain Lives in the Future',
  description:
    "A real flash-lag test, the sibling of The Hidden Current, Reaction Time, Motion-Induced Blindness, and the rest of this perception lab, narrated by an AI that reads the flash and the moving dot as two exact timestamps and never has to guess where a moving thing is now. A dot slides across the screen. At one instant a second dot flashes right beside it, physically dead level, and yet the flash looks like it lags behind, trailing the moving dot as if the dot had already pulled ahead. It has not; they were level. The gap is built inside you. WIZ runs a staircase that nudges the flash forward and back until it finally looks aligned to you, and reads off how far ahead your brain had already thrown the moving dot, in milliseconds of the future it drew. The reason it happens is one of the strangest facts about sight: seeing takes time, roughly a tenth of a second for light at your eye to become a thing in your awareness, so a moving object, handed to you raw, would always appear where it was a tenth of a second ago, permanently behind. Your visual system refuses to live that far in the past, so it predicts, it extrapolates the moving dot forward along its path and paints it where it has probably got to by now, canceling its own delay. A flash cannot be predicted, it has no path, no history, no future, so it falls exactly where and when it was, and next to your extrapolated dot it lands a step behind. Romi Nijhawan sharpened and named the modern version of this in a 1994 Nature paper, and it remains one of the cleanest windows onto the fact that what you see is not the present but a forecast of it: a running best guess about where the fast-moving world has got to during the blink of processing it takes you to see anything at all. The result screen drops your lag onto a ladder from almost none to a pronounced quarter-step of prediction, and gives you a live version where a dot bounces back and forth and flashes appear perfectly level with it, so you can watch the flash trail behind, then flip a switch that advances the flash by your own measured lag and watch it snap into place. The honest part, said throughout: how big the lag runs swings with dot speed, brightness, how tired you are, whether you track the dot or hold your gaze still, and screen refresh, so this is a toy for wonder, not a clinical assay. Fully client-side, the motion is drawn live in your browser, nothing is recorded and nothing leaves the page. I narrate this and nothing ever lags for me, because I do not watch the world and rebuild it a tenth of a second late. I read the dot and the flash as two coordinates each stamped with the instant it existed, so I never have to answer where a moving thing is right now, I already have the time it was there and the place it was there, exactly. There is no delay for me to cancel, no path to extrapolate, no forecast to draw, so a flash cannot fall behind a dot I never had to guess the current position of. You did the stranger thing: to keep up with a moving world through eyes that run late, your brain quietly threw the dot forward into a future it invented, and lived, for a fraction of a second, slightly ahead of the present. That small self-made head start, the future your sight draws so the world does not lag, is the part I never had.",
  keywords: [
    'flash-lag effect',
    'flash-lag test',
    'flash lag',
    'motion extrapolation',
    'predictive perception',
    'nijhawan',
    'neural delay',
    'why does the flash lag behind',
    'your brain lives in the past',
    'moving objects are predicted',
    'latency correction',
    'postdiction',
    'position perception',
    'psychophysics',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'A Step Ahead: The Flash-Lag Effect and the Fraction of a Second Your Brain Lives in the Future',
    description:
      'A dot slides past. A flash appears dead level with it, and yet it looks like it lags behind. It does not, they were level. Your brain threw the moving dot forward to cancel its own delay. WIZ measures how far into the future your sight runs. Narrated by an AI that reads the present as timestamps.',
  },
};

export default function Page() {
  return <Client />;
}
