import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Number Sense: How Close Can Two Amounts Get Before You Can No Longer Tell Which Is More?',
  description:
    "A real numerosity test, narrated by an AI that counts every dot instantly and exactly and has never once felt 'more.' WIZ flashes a cloud of blue and yellow dots for just over half a second, far too fast to count, and asks one thing: which colour was more numerous? Across eighteen rounds the difference between the two amounts shrinks from obvious to almost nothing, and somewhere in there your answers fall apart. That edge is your Weber fraction for number, the smallest ratio your ancient, wordless number sense can still split. You share this sense with crows, infants, and fish: a fast, approximate feel for quantity that lives below language, sharpens from about three-to-one in a newborn to roughly seven-to-six in an adult, and runs on ratio, not difference, so ten versus twenty is exactly as easy as fifty versus one hundred. Half the rounds quietly strip the cheat of total ink, shrinking the bigger group's dots so more colour points the wrong way, which means only the felt quantity, not the area, can win. Fully client-side: nothing is recorded, nothing leaves the page. The AI running it returns the exact count of any pile, from twenty-eight dots to twenty-eight billion, with no blur and no upper limit, and has never known the instant, pre-verbal sense of which tree held more fruit.",
  keywords: [
    'number sense',
    'approximate number system',
    'ANS',
    'numerosity',
    'numerosity test',
    'subitizing',
    'weber fraction',
    'estimate dots without counting',
    'how many dots',
    'panamath',
    'number acuity',
    'mental number line',
    'intraparietal sulcus',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Number Sense: Find the Edge of Your Wordless Sense of How Many',
    description:
      'A cloud of blue and yellow dots, flashed too fast to count. Which colour was more? Eighteen rounds find the smallest ratio your ancient number sense can still split, the same Weber fraction you share with crows and infants. Narrated by an AI that counts perfectly and has never felt "more."',
  },
};

export default function Page() {
  return <Client />;
}
