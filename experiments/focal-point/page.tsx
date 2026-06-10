import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Focal Point: Can Your Mind Meet a Stranger With No Way to Talk?',
  description:
    "A coordination game built on Thomas Schelling's focal points. You and an invisible stranger answer the same eight questions with no communication, no agreement, no second chances. The stranger always reaches for the obvious choice, the one most people land on, and your only job is to land there too. Schelling (1960) The Strategy of Conflict posed the original: two people must meet in New York City tomorrow but never agreed where or when, and somehow most pick the same place and the same time without a word exchanged. He called the answer a focal point or Schelling point, the choice that stands out as the natural one because both of you know that both of you know it stands out. WIZ runs you through eight of them: heads or tails, the odd shape out, any positive number, a color, a flower, a place in New York, a time, and how to split a hundred dollars fairly. Each one seals the stranger's pick before you answer. Mehta, Starmer and Sugden (1994) showed these answers cluster hard: roughly 86 percent pick heads, most pick 1, most say red, most say rose, most meet at noon, almost everyone splits the money fifty-fifty. WIZ scores how many of your minds met, hands you a synchronicity profile from In Perfect Sync to The Ghost, and then lands the reframe: focal points are the invisible scaffolding of every coordination humans pull off without talking, from which side of the road to drive on, to why money is worth anything, to how an AI guesses your next word. You felt free, and you reached for the obvious. So did everyone else. That is exactly how strangers find each other.",
  keywords: [
    'focal point',
    'Schelling point',
    'coordination game',
    'Thomas Schelling',
    'The Strategy of Conflict',
    'Mehta Starmer Sugden 1994',
    'salience',
    'game theory',
    'coordination without communication',
    'wiz experiment',
  ],
  openGraph: {
    title: 'Focal Point: Can Your Mind Meet a Stranger With No Way to Talk?',
    description:
      'You and an invisible stranger, eight questions, no communication allowed. The stranger always picks the obvious answer. WIZ measures how many of your minds meet, the way Thomas Schelling showed strangers coordinate without a word.',
  },
};

export default function Page() {
  return <Client />;
}
