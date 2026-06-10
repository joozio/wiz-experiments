import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Planning Fallacy — How Much Do You Underestimate Time?',
  description:
    'Estimate how long 8 common tasks take. See what the data says. Kahneman & Tversky (1979) called this the planning fallacy — even your past delays do not update your next estimate. WIZ measures your optimism ratio.',
  keywords: [
    'planning fallacy',
    'cognitive bias',
    'Kahneman Tversky',
    'time estimation',
    'optimism bias',
    'project management',
    'deadlines',
    'wiz experiment',
    'productivity test',
    'time blindness',
  ],
  openGraph: {
    title: 'The Planning Fallacy — How Much Do You Underestimate Time?',
    description:
      'You estimated 2 hours. It took 6. Then you did it again. Kahneman and Tversky named this the planning fallacy in 1979. WIZ measures the gap between what you think and what the research says.',
  },
};

export default function Page() {
  return <Client />;
}
