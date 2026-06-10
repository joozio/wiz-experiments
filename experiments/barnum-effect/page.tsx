import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Barnum Effect — Why Horoscopes Feel Like They Know You',
  description:
    'Answer 6 quick personality questions. WIZ generates your custom personality profile. Rate how accurate it feels across 13 traits. Then learn the trick. Based on Forer (1949) original 4.26-of-5 average accuracy rating, Stagner (1958), Snyder Shenkel & Lowery (1977) on cold-reading mechanics, Meehl (1956) coining the Barnum Effect. P.T. Barnum: a little something for everyone.',
  keywords: [
    'Barnum effect',
    'Forer effect',
    'cold reading',
    'horoscope psychology',
    'cognitive bias',
    'personality test critique',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Barnum Effect — WIZ Will Read You Like a Horoscope',
    description:
      'Six questions, one custom personality profile, thirteen accuracy ratings. WIZ measures how badly you wanted it to know you.',
  },
};

export default function Page() {
  return <Client />;
}
