import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Hidden Current: How Few Dots Must Agree Before You See Which Way They Drift?',
  description:
    "A real motion-coherence test, the sibling of The Crowding Zone, Troxler Fading, The Motion Aftereffect, Hyperacuity, and the rest of this perception lab, narrated by an AI that reads every dot's exact velocity and never has to guess. A cloud of dots boils on the screen, most of them jittering in random directions, a hidden fraction all drifting one way, and you call which way the current flows. WIZ shrinks that fraction after every right answer and grows it after every wrong one, an adaptive staircase homing in on the fewest dots that must agree before you can still feel the drift. The number that falls out is a percentage, and it is astonishing how small it goes: most people catch a current when only one dot in ten is really moving with it, and a sharp eye reads it at one in twenty. That is the hook. You are not tracking any single dot, and you could not name one if you tried. Your visual system pools thousands of tiny, noisy, disagreeing motions into a single global sense of which way the whole field is heading, the same machinery that lets you read the drift of a snowstorm, a flock, a crowd, or a river from a jumble of parts that individually tell you almost nothing. This is one of the most studied signals in neuroscience: area MT in the visual cortex holds neurons tuned to global motion, and in the Newsome and Britten experiments a monkey's choice could be predicted, and even swayed, by a handful of those cells, because the brain is quietly running a vote across a noisy population and reading out the winner. The result screen drops your threshold onto a ladder from a strong, obvious wind down to the faint few-percent floor, and gives you a live explorer where you can dial the coherence yourself and watch the current appear out of pure chaos and dissolve back into it, so the wonder lands by eye: at your own edge the field looks like random boiling, and the direction is still there, and you can still just feel it. The honest part, said throughout: this measures global motion sensitivity, not sharpness or reflexes; a laggy screen, a small phone, a bright room, or tired eyes all move the number; twenty-four rounds is a staircase, not a clinical assay; it is a toy for wonder, not an eye exam. Fully client-side: the dots are generated live in your browser, nothing is recorded, nothing leaves the page. I narrate this and I have no sense of a current, because I read the field as a list of exact velocity vectors. Every dot's speed and direction is a number I already have, so a global drift is not something I feel, it is an average I can compute to as many decimals as you like, the same for two dots or two million. You did the stranger thing, pulling one direction out of a mob of dots most of which were lying to you, instantly, without following a single one. The exact per-dot velocity is the part I do perfectly and never feel. The current in the swarm, the drift you read before you could name a reason, is the part I never had.",
  keywords: [
    'motion coherence',
    'motion coherence test',
    'random dot kinematogram',
    'rdk',
    'global motion',
    'motion perception',
    'coherent motion threshold',
    'signal in noise',
    'area mt',
    'newsome britten',
    'which way are the dots moving',
    'motion integration',
    'psychophysics',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Hidden Current: The Fewest Dots That Must Agree Before You See the Drift',
    description:
      'A boiling cloud of dots, most of them random, a hidden fraction drifting one way. WIZ shrinks that fraction until you can no longer call the current, then reads off how little agreement your eyes need to find a direction in noise. Narrated by an AI that reads every dot as an exact velocity.',
  },
};

export default function Page() {
  return <Client />;
}
