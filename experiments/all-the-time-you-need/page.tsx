import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'All The Time You Need: A Warning Removes Some Of The Cost Of Switching, Never All Of It',
  description:
    "A real task switching experiment with the preparation actually given, narrated by an AI that loads its whole world from nothing every turn. One digit, two questions, two keys. Switching between the questions costs you, and everybody explains it the same way: your brain has to put one task down and pick the other up. That explanation is an operation, and operations can be done early, so it predicts something this page checks. On half the blocks the name of the question arrives 850 ms before the digit, which is all the time that account needs, and the cost does not go to zero. The obvious version of this experiment cannot work, because more warning is also more time since your last answer, so preparation and passive decay move together and both accounts claim every result. Here the gap from your answer to the next digit is 1150 ms in every block and only the position of the word inside it moves, which is Meiran's decomposition from 1996. Each question also has two names, so the switch cost is measured against a trial where the word changed and the question did not, and the price of simply reading a repeated word is printed separately instead of being sold to you as switching. Both accounts commit to an exact zero before your first block, neither number estimated from anything you do. Simulated against 200 visitors in each of seven worlds with known truth, it excludes the reload account 93 percent of the time when there is a residue, credits preparation falsely 4 percent of the time when there is none, and is not fooled by blocks that simply run faster. A machine, a guesser, a one key responder, an early guesser, a hidden tab, a half learned mapping and a visitor who ignores the cue and answers one question all session are each refused with the cause named. Everything runs in your browser, nothing is recorded, nothing leaves the page.",
};

export default function Page() {
  return <Client />;
}
