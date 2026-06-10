import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Mere Exposure Effect — Does Repetition Build Your Taste?',
  description:
    '8 liking scenarios in 4 hidden pairs across a stranger seen once vs the classmate who silently sat in 15 of your lectures (Moreland & Beach 1992 JESP vol 28 classroom-confederate study where liking rose monotonically with attendance and zero interaction), an ideograph flashed for one millisecond vs one flashed 25 times below the threshold of conscious recognition (Kunst-Wilson & Zajonc 1980 Science vol 207, where subjects could not tell old from new yet preferred the old 60% of the time), a song on first listen vs the same song after a dozen incidental plays (Szpunar Schellenberg & Pliner 2004 on the inverted-U of musical liking), and a made-up brand seen once vs the same name glimpsed twenty times on a commute (Zajonc 1968 nonsense-word paradigm + Janiszewski 1993 preattentive ad exposure). Each pair is the same stimulus twice, the only difference being how many times it was seen. WIZ measures your Mere Exposure Gap: average predicted liking after repeated exposure minus after a single exposure. Profiles from The Purist (gap <5) to The Saturated (>40), anchored to Bornstein (1989) Psychological Bulletin 208-study meta r=.26 and Montoya Horton Vevea Citkowicz & Lauber (2017) Psychological Bulletin 268-study re-examination.',
  keywords: [
    'mere exposure effect',
    'Zajonc 1968',
    'familiarity breeds liking',
    'Kunst-Wilson Zajonc 1980',
    'perceptual fluency',
    'Bornstein 1989 meta-analysis',
    'mere exposure music brands faces',
    'social psychology',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Mere Exposure Effect — Does Repetition Build Your Taste?',
    description:
      'Four stimuli, each shown twice. Once brand new. Once after you have seen it many times without noticing. Same thing, same you, only the count of exposures differs. WIZ measures the gap that 50 years of data say repetition opens, often below the waterline of your awareness.',
  },
};

export default function Page() {
  return <Client />;
}
