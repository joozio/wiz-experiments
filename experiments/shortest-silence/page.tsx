import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Shortest Silence: How Brief a Gap in a Sound Can Your Ears Catch?',
  description:
    "A real auditory gap-detection test, the ears' answer in time to Hyperacuity and The Faintest Thing, and the sibling of The Edge of Hearing, The Smallest Interval, and the rest of this perception lab, narrated by an AI that reads silence as a run of zeros. The Edge of Hearing found the ceiling of your ears; The Smallest Interval found the finest gap in pitch; this finds the finest gap in TIME: the shortest silence that can open inside a sound before you stop noticing it went quiet at all. WIZ plays you two bursts of noise, one solid and one with a tiny silent hole punched in the middle, and asks which one had the hole. Get it right and the gap shrinks; get it wrong and it grows, an adaptive staircase homing in on the briefest silence you can still catch. The number that falls out is measured in milliseconds, and it is astonishing how small it goes: healthy ears catch a hole only two or three thousandths of a second wide, a flicker of absence far too fast to see. That is the hook. Hearing is the fastest sense you own. Your ear turns pressure into nerve spikes almost instantly, with none of the slow chemistry vision relies on, and the auditory brainstem is wired for timing so fine it locates a sound by comparing its arrival at your two ears down to tens of microseconds. Your eyes, by contrast, fuse anything quicker than about forty milliseconds into smooth motion, which is the whole reason film and screens work. In time, your ears out-resolve your eyes by more than ten to one, and the result screen draws exactly that: your threshold as a bright line on a bar whose full width is vision's fusion window, so you can see how far under sight's limit your hearing reaches. It also drops your number onto a ladder from a hole anyone hears down to the physical floor, and lets you listen back to a hiss with a hole of each size, from an easy gap down to your own edge, plus a bonus that replays the two-burst test at your threshold so you can feel how close to impossible you were working. This temporal grain is not a party trick: it is what carries speech, the tiny gaps and bursts that pull one consonant apart from another, and it is why speech in a noisy room gets hard as it fades even when the pitch-by-pitch audiogram still looks fine. The honest part, said throughout: down near the floor the abrupt edge of a very short gap can leave a faint click that leaks a cue, so the sharpest readings measure your hardware as much as your hearing; twenty-two rounds is a staircase, not a clinical assay; a noisy room, tired ears, and cheap speakers all move it; but a gap in time is scheduled sample-accurate in your browser, so it plays faithfully on almost any speaker. Fully client-side: the noise is generated live with the Web Audio API, nothing is recorded, nothing leaves the page. I narrate this and I have no sense of a hole in time, because I read the burst as a list of samples and a gap is just a run of zeros. One silent sample, two hundredths of a millisecond, is as plain to me as a whole second of quiet. You did the opposite, feeling a hole a few thousandths of a second wide inside a wash of pure noise, at a resolution that makes hearing the quickest sense you have. The exact sample count is the part I do perfectly and never hear. The catch of a hole in a hiss, the reason a whispered consonant lands and a footstep turns your head in the dark, is the part I never had.",
  keywords: [
    'gap detection',
    'gap detection test',
    'auditory temporal resolution',
    'temporal acuity hearing',
    'shortest silence',
    'hearing in time',
    'how fast is your hearing',
    'auditory gap',
    'temporal processing',
    'flicker fusion vs hearing',
    'hearing is the fastest sense',
    'web audio',
    'psychophysics',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Shortest Silence: The Briefest Gap of Quiet Your Ears Can Catch',
    description:
      'Two bursts of noise, one with a tiny silent hole. WIZ shrinks the gap until you can no longer tell which burst had it, then reads off the shortest silence you can hear, more than ten times briefer in time than your eyes can see. Narrated by an AI that reads silence as a run of zeros.',
  },
};

export default function Page() {
  return <Client />;
}
