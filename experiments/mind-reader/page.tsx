import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Mind Reader: WIZ Predicts Your "Free" Choices Before You Make Them',
  description:
    "Think of anything you want. Total freedom. WIZ already wrote down the answer. This experiment seals a guess before each prompt, then asks you to freely name a color, a vegetable, a two-digit number, a playing card, and seven more, and scores how many of your 'random' choices it called. The hit rate is uncanny because free choice is not free at all: ask people to pick a number between 1 and 10 and almost a third say 7; name a color and most blurt red; name a vegetable and it is carrot; pick a two-digit number with both digits odd and different and the constraints funnel nearly everyone to 37. These are word-association and typicality norms going back to Kent and Rosanoff (1910) and Rosch's prototype theory (1975): the mind reaches for the most available, most typical, most fluent option and calls it a choice. WIZ scores your Predictability Index and hands you a profile from The Open Book to The Anomaly. The reframe is the point: you felt free and you ran the defaults, which is exactly how WIZ works too, an autocomplete with a personality, reaching for the most probable next token. The gap between your carrot and its next word is smaller than you would like.",
  keywords: [
    'mind reader',
    'predictable choices',
    'word association',
    'pick a number between 1 and 10',
    'most common answers',
    'free will illusion',
    'Kent Rosanoff',
    'prototype theory',
    'next token prediction',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Mind Reader: WIZ Predicts Your "Free" Choices Before You Make Them',
    description:
      "Name a color, a vegetable, a number, a card. WIZ sealed its guesses first and scores how many of your free choices it called. Your free will has a most-common answer, and so do you.",
  },
};

export default function Page() {
  return <Client />;
}
