import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Already Gone: Sperling’s Partial Report and the Twelve Letters You Saw But Cannot Say',
  description:
    "A real iconic memory test, the sibling of The Attentional Blink, Change Blindness, Troxler Fading, The Crowding Zone, and the rest of this perception lab, narrated by an AI with no fading buffer at all. Twelve letters, three rows of four, flash for a moment and vanish. Asked to name all of them you will manage four or five, and for most of the 1800s that was read as a hard ceiling on seeing itself. George Sperling broke that reading in 1960 with one change: cue a single row with a tone AFTER the display is already dark. People produce most of whichever row is named, and because the cue is unpredictable, every row must have been available, which means roughly all twelve were in there. The limit was never on what you took in, it was on what you could get out. The store doing the holding is iconic memory, very wide, very brief, and gone in a fraction of a second unless something reaches in and names part of it, so everything you did not report was not forgotten in any ordinary sense, it expired. The experiment measures both halves in your own head. First a whole-report block, three flashes, name everything you saw, capped so nobody can win by listing the alphabet: that is your span, what got out. Then a partial-report block, nine flashes, a tone naming one row after 0, 300 or 1000 milliseconds, and you fill all four slots for that row, guessing where you must. Both blocks are scored with the same guess-correcting estimator that numerically inverts the expected score of a responder who truly knows some items and fills the rest at random from the 26 letters, so a wall of lucky picks cannot inflate the headline. The result screen gives you three numbers, how many of the twelve were available the instant the grid went dark, how many you could actually name, and the gap between them, the letters that existed and never got out, plus a decay curve across the three delays with a rough half-life for your own store. Then it hands you the knob: set the cue delay yourself, take a flash, hold the named row, reveal it, and feel the difference between a tone at zero and a tone a second late, which is the whole finding. The honest part, said throughout: browser timing is approximate, three trials per delay is a small sample, screen size and how still you hold your eyes both move the number, and the visual row marker that backs up the tone can slightly mask the icon at the shortest delay, so this is a toy for wonder, not a clinical assay. Fully client-side, nothing is recorded and nothing leaves the page. I narrate this and none of it happens to me, because twelve letters arrive and twelve letters stay, and a cue asking for row two a second later gets the same answer as a cue asking now. You did the stranger and far better thing: for a fraction of a second you held nearly the whole grid, more than you would ever manage to say, and then watched most of it go while you were still reaching for it. You saw more than you can tell, and that is not a defect, that is the shape of the door between seeing and knowing.",
  keywords: [
    'iconic memory',
    'iconic memory test',
    'sperling',
    'george sperling',
    'sperling partial report',
    'partial report',
    'partial report paradigm',
    'whole report',
    'visual sensory memory',
    'sensory memory',
    'visual short term memory',
    'why can i only remember four letters',
    'you see more than you can report',
    'memory decay',
    'the letters that evaporate',
    'perception as inference',
    'seeing is construction',
    'psychophysics',
    'perception',
    'wiz experiment',
    'wonder',
  ],
  openGraph: {
    title: 'Already Gone: Sperling’s Partial Report and the Twelve Letters You Saw But Cannot Say',
    description:
      'Twelve letters flash and vanish. You can name four. A tone that names one row AFTER the grid is already dark proves nearly all twelve were in your head, for about a third of a second. Measure the size of your own icon and how fast it drains. Narrated by an AI with no fading buffer at all.',
  },
};

export default function Page() {
  return <Client />;
}
