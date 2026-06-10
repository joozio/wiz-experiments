import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Outcome Bias — Do You Judge Decisions or Just Their Outcomes?',
  description:
    '8 decision scenarios paired hidden across four life domains (a bypass surgery, a concentrated stock bet, letting a 16-year-old drive in winter, a startup skipping its beta). Each pair runs the same decision twice with different outcomes. One 0-100 wisdom slider each. WIZ computes your outcome-bias gap against the Baron & Hershey (1988) founding-study modal band of 30-40 points. Based on Baron & Hershey (1988), Lipshitz (1989), Allison Mackie & Messick (1996), Marshall & Mowen (1993), Sezer Zhang Gino & Bazerman (2016).',
  keywords: [
    'outcome bias',
    'decision quality vs outcome',
    'Baron Hershey 1988',
    'process versus outcome',
    'resulting fallacy',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Outcome Bias — A Good Result Does Not Make A Good Decision',
    description:
      'Four pairs of identical decisions with opposite outcomes. Eight wisdom sliders. WIZ measures how much the result rewrites your verdict on the choice.',
  },
};

export default function Page() {
  return <Client />;
}
