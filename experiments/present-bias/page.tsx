import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Present Bias Test — Do Your Future and Present Selves Agree?',
  description:
    '10 choices, 5 hidden pairs. Each pair offers the same trade — wait longer, get more — once with "today" on the table, once with both options pushed into the future. A consistent person picks the same way both times. Most people flip. Thaler (1981), Laibson (1997). WIZ measures your present bias.',
  keywords: [
    'present bias',
    'hyperbolic discounting',
    'time inconsistency',
    'Thaler 1981',
    'Laibson 1997',
    'quasi-hyperbolic discounting',
    'Mischel marshmallow',
    'behavioral economics',
    'wiz experiment',
    'psychology test',
  ],
  openGraph: {
    title: 'The Present Bias Test — Do Your Future and Present Selves Agree?',
    description:
      'Same trade, same wait, same bonus. Once "today" is on the table, once it is not. Take 10 choices and find out how much your now-self overrules your later-self.',
  },
};

export default function Page() {
  return <Client />;
}
