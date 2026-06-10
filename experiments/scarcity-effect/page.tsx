import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "The Scarcity Effect — Does 'Almost Gone' Change the Thing?",
  description:
    "8 desirability scenarios in 4 hidden pairs across a cookie from a jar of ten vs a jar of two (Worchel, Lee & Adewole 1975 JPSP vol 32, where identical cookies were rated more desirable, more attractive, and worth more when scarce, and demand-caused scarcity beat accident-caused scarcity), an online product shown as freely in stock vs 'only 3 left, 14 viewing' (Aggarwal, Jun & Huh 2011 Journal of Advertising vol 40, where limited-quantity scarcity beat limited-time scarcity because it implies competition), an open-edition print vs a numbered edition of fifty (Lynn 1991 Psychology & Marketing vol 8 commodity-theory meta, where scarcity raises value most when it signals quality), and a book freely on shelves vs one just banned (Brehm 1966 reactance and the forbidden-fruit effect). Each pair is the same thing twice, the only difference being abundant vs scarce supply. WIZ measures your Scarcity Gap: average predicted desirability for the scarce scenarios minus the abundant ones. Profiles from The Stoic (gap <5) to The Panic Buyer (>50), anchored to Worchel, Lee & Adewole (1975) and the Lynn (1991) quantitative review.",
  keywords: [
    'scarcity effect',
    'commodity theory',
    'Worchel Lee Adewole 1975',
    'cookie jar experiment',
    'Brehm reactance',
    'forbidden fruit effect',
    'limited edition psychology',
    'scarcity marketing',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: "The Scarcity Effect — Does 'Almost Gone' Change the Thing?",
    description:
      'Four things, each shown twice. Once abundant and freely available. Once scarce: almost gone, limited, or forbidden. Same thing, same you, only the supply differs. WIZ measures the gap that fifty years of commodity-theory data say scarcity opens. The cookie did not change between the jar of ten and the jar of two. You did.',
  },
};

export default function Page() {
  return <Client />;
}
