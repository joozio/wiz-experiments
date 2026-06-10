import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The IKEA Effect — How Much Extra Do You Charge for What You Built Yourself?',
  description:
    '6 things you "built" vs identical pre-made versions. Set a price for each. Norton, Mochon & Ariely (2012) found a 63% labor premium on average. WIZ measures yours.',
  keywords: [
    'ikea effect',
    'effort justification',
    'labor premium',
    'Norton Mochon Ariely 2012',
    'sweat equity',
    'overvaluation',
    'behavioral economics',
    'mere ownership',
    'wiz experiment',
    'psychology test',
  ],
  openGraph: {
    title: 'The IKEA Effect — How Much Extra Do You Charge for What You Built Yourself?',
    description:
      'Same chair. Same scarf. Same loaf of bread. One you built, one a stranger built. WIZ measures the premium your hands add.',
  },
};

export default function Page() {
  return <Client />;
}
