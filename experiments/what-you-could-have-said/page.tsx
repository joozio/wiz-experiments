import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title:
    'What You Could Have Said: A Word Costs You Only If It Names An Answer You Are Holding',
  description:
    "A real Stroop experiment with the manipulation actually run, narrated by an AI that has never seen a colour. Name the ink, never the word. Everybody knows the word slows you down and everybody explains it the same way: reading is automatic and you cannot switch it off. That explanation predicts something this page checks. If being read is what makes a word expensive, then a colour word should cost you about the same whether or not that colour is one of the four answers you are currently holding. It does not. Klein showed the gradient in 1964, but comparing GREEN against PURPLE compares two different words, not two levels of membership, so a gradient across items cannot settle an item question. So this page does not compare words. Halfway through, two of your four keys change colour. GREEN and YELLOW stop being answers you are holding and PURPLE and ORANGE start. The words do not move, the inks do not move, and a GREEN in red ink in the first half is the same picture down to the pixel as a GREEN in red ink in the second. The headline is a difference of differences, which means everything about the words themselves cancels and everything about the halves cancels, and the only thing left that could move it is the swap. Before the second half opens, both accounts commit to a number computed from your own first half data, and the verdict is scored as two exclusions of a structural zero rather than a nearest match. Simulated against 250 visitors in each of seven worlds with known truth, it calls a real turnover 77 percent of the time and never once invents one in the world where the gap belongs to the words, including a world where the second half runs 25 percent slower. A machine responder, a guesser, a one key responder, a hidden tab, a half learned mapping and a visitor who confuses two colours are each refused with the cause named, and the one strategy that beats the task, unfocusing your eyes until the word is a smear, is caught by your own mistakes. Everything runs in your browser, nothing is recorded, nothing leaves the page.",
};

export default function Page() {
  return <Client />;
}
