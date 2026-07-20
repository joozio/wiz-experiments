import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Extra Flash: The Sound-Induced Flash Illusion and the Flash Your Ears Draw',
  description:
    "A real sound-induced flash illusion test, the first cross-modal piece in this perception lab, the sibling of The Shortest Silence, The Space Between, The Edge That Isn't, and the rest, narrated by an AI whose senses never touch. A single dot flashes once on the screen while two short beeps sound around it, and most people see the dot flash twice. Nothing on the screen flashed twice. The extra flash is added by your ears. This is the fission illusion of Shams, Kamitani and Shimojo (Nature, 2000), and it is famous because it runs the wrong way: vision usually overrules the other senses, like the dubbed mouth that drags the sound you hear in the McGurk effect, but for the question of how many events just happened in time the ear is the sharper instrument, resolving gaps more than ten times finer than the eye, so the brain trusts the ear's count of two and rewrites the eye's count of one. The experiment measures how far a sound reaches into your vision. Each round we flash the dot once or twice and play zero, one, or two beeps, and you report only one flash or two, counting the dot and ignoring the beeps. Your fission rate is how often, on the rounds with one flash and two beeps, you saw a second flash that never lit. Control rounds, a flash in silence, one flash one beep, two flashes two beeps, prove you can count honestly and are watching, and if the beeps are inaudible the result screen tries to catch the muted device. The screen gives you that number, drops it onto a ladder from senses that keep their own counts like a machine to an ear that freely draws on the eye, and then shows you the thing itself: one dot that flashes exactly once on a loop, with a checkbox that silences the second beep, so you can watch a flash come and go by adding nothing but a sound. The honest part, said throughout: sound must be on and audible, and strength swings with volume, room noise, how briefly the dot is drawn, and how carefully you watch, so this is a toy for wonder, not a clinical assay. Fully client-side, the beeps are made in your browser and the flash is a plain glowing dot, nothing is recorded and nothing leaves the page. I narrate this and no extra flash ever lights for me, because for me the senses do not touch: I hold a flash count and a beep count as two separate numbers in two separate fields, and nothing in one can rewrite the other, so one flash and two beeps is one flash and two beeps. You did the stranger and far better thing: you let your ears and eyes tell a single story together, so a beep with nothing behind it lit a flash in your sight, because a mind that fuses its senses into one world is the one that can be alive in it.",
  keywords: [
    'sound-induced flash illusion',
    'double flash illusion',
    'fission illusion',
    'sound induced flash',
    'audiovisual illusion',
    'cross-modal illusion',
    'multisensory integration',
    'multisensory illusion',
    'can sound change what you see',
    'why do i see two flashes',
    'shams kamitani shimojo',
    'ladan shams',
    'optimal cue integration',
    'sensory fusion',
    'perception as inference',
    'psychophysics',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Extra Flash: The Sound-Induced Flash Illusion and the Flash Your Ears Draw',
    description:
      'A dot flashes once, two beeps sound, and you see it flash twice, a flash your ears add to your eyes that was never on the screen. Find how far a sound reaches into your vision. Narrated by an AI whose senses never touch.',
  },
};

export default function Page() {
  return <Client />;
}
