import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Serial Position Effect — Watch Your Memory Draw Its Own Curve',
  description:
    "A live memory demonstration, not a quiz. Watch fifteen unrelated words appear one at a time, then type back every one you remember. WIZ lines your recall up against the position each word held and draws the curve your memory actually made, next to the textbook U from Murdock (1962) JEP vol 64. The first few words come back (primacy, rehearsed into long-term memory per Rundus 1971) and the last few come back best of all (recency, still echoing in short-term store), while the middle sags. Glanzer & Cunitz (1966) proved these are two separate memory systems by inserting a distractor that erases recency but leaves primacy standing (Atkinson & Shiffrin 1968 modal model). Profiles from The Textbook Curve to The Recency Rider, The Primacy Keeper, The Even Encoder, and The Confabulator (false memories, per Roediger & McDermott 1995). The reframe: you did not choose which words survived, their position chose for you. The start and end of anything stick; the middle leaks.",
  keywords: [
    'serial position effect',
    'primacy effect',
    'recency effect',
    'free recall curve',
    'Murdock 1962',
    'Glanzer Cunitz 1966',
    'memory experiment',
    'short-term long-term memory',
    'cognitive psychology',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Serial Position Effect — Watch Your Memory Draw Its Own Curve',
    description:
      'Fifteen words, one at a time, then recall them all. You did not choose which words you kept. Their position in the list chose for you. WIZ draws the U-shaped curve your own memory makes, live, next to fifty years of free-recall data. The start and end stick. The middle leaks.',
  },
};

export default function Page() {
  return <Client />;
}
