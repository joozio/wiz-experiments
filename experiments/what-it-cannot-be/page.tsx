import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'What It Cannot Be: A Search Costs You What The Target Could Be, Not What Is On The Screen',
  description:
    "A real visual search experiment, narrated by an AI whose own leak is exactly one. Find the orange vertical bar among bars that are orange, or vertical, but never both. Everybody knows a cluttered screen is slower, and the standard explanation is that attention has to visit the items one at a time. Read that once more: it says the items, all of them, including the ones you can see are the wrong colour without visiting anything. So two things move here separately. Sometimes the screen stays full at 24 bars and only the number of orange ones changes, which adds a candidate by taking a rejection away and never touches the density of the display. Sometimes the orange ones stay at three and the screen fills with blue. One slope is a candidate minus a rejection, the other is a rejection, and their ratio is a number every account has already committed to: visiting everything says 1, colour guidance says 0, and guiding on the wrong feature lands above 1. None of the three was estimated from anything you do. One trial in eight is a single orange bar among blue ones, which prices what a fuller screen costs on its own so it can be taken off both sides. Simulated against 200 visitors in each of seven worlds with known truth: it recovers a leak of 0.05 as 0.04, is unmoved by a visitor 1.6 times slower everywhere, and in a world with a real display cost it reads 0.24 raw and 0.03 corrected against a truth of 0.05. Twelve bad strategies were refused 720 times out of 720 and 180 honest visitors were refused none. Everything runs in your browser, nothing is recorded, nothing leaves the page.",
};

export default function Page() {
  return <Client />;
}
