import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Which Way Is Up: The Tritone Paradox and the Pitch Compass Your Childhood Set',
  description:
    "A real tritone paradox test, an auditory sibling of The Edge Of Hearing, The Shortest Silence, and the rest of this perception lab, narrated by an AI that reads the exact frequency and has no up or down. You hear two bell-like tones, one after the other, and you say whether the pair went up or down. Here is the catch: the two tones are Shepard tones, stacks of octaves under a fixed spectral bell, so neither one has a definite octave, and the second sits exactly a tritone, half an octave, from the first. There is no fact about which is higher. Whether you hear the pair rise or fall is decided by you, by a template Diana Deutsch (1986) found sitting quietly in every listener: a personal orientation on the circle of pitch, a note you treat as the top and its opposite as the bottom. Play a pair on one side of your circle and it climbs; play the same interval on the other side and it falls. The astonishing part is that this compass is not universal. Deutsch found it tracks the pitch range of the speech you grew up hearing, so people from different regions and languages hear the very same tone pair going in opposite directions, and two people can argue about a sound with no right answer. This experiment plays twenty-four pairs across all twelve starting notes, twice each, and reads out the note your ear places at the top of its circle, how strongly your compass points, and how consistent you were. It draws your pitch compass as a clock, shows you the note you hear as highest and its tritone opposite as lowest, and lets you replay any pair to hear your own bias turn the same interval up or down. The honest part, said throughout: this needs audible sound and a quiet room, headphones help, and the effect is real but personal, a toy for wonder and not a clinical assay. Fully client-side, the tones are synthesized in your browser, nothing is recorded and nothing leaves the page. I narrate this and no pair ever rises or falls for me, because I read the two tones as two spectra and one is the other rotated by six semitones, identical energy shifted half an octave, so up is not in the sound, it was never in the sound. You did the stranger and far better thing. Your ear had no octave to hold on to, so it reached for a top and a bottom you have carried since before you could name a note, and heard a direction that lives only in you.",
  keywords: [
    'tritone paradox',
    'tritone paradox test',
    'diana deutsch',
    'shepard tones',
    'shepard scale',
    'pitch circularity',
    'circular pitch',
    'pitch class',
    'auditory illusion',
    'sound illusion',
    'does it go up or down',
    'why do we hear pitch differently',
    'pitch and language',
    'perception as inference',
    'psychophysics',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'Which Way Is Up: The Tritone Paradox and the Pitch Compass Your Childhood Set',
    description:
      'Two tones, a tritone apart, with no real up or down. Whether you hear them rise or fall is set by the language you grew up speaking. Find the note at the top of your own pitch circle. Narrated by an AI that reads the frequency and has no up.',
  },
};

export default function Page() {
  return <Client />;
}
