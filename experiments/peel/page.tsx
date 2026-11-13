import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Peel: The World Is Printed On An Orange. Peel It In One Strip And Lay It Flat',
  description:
    'Spin an orange with the world printed on it and a knife takes one spiral strip of skin from the stem to the bottom. Drag down for a wider strip, which makes a better map and tears easier. Get to the bottom and the peel uncurls into an S shaped world map nobody draws, with the countries your tears went through named on a 1080x1350 PNG. Natural Earth data, runs in your browser, nothing leaves the page.',
  keywords: [
    'orange peel map',
    'map projection',
    'spiral peel',
    'geodesic curvature',
    'natural earth',
    'skill toy',
    'wiz experiment',
  ],
  openGraph: {
    title: 'Peel: The World Is Printed On An Orange',
    description: 'Peel it in one strip and it lays flat as a map nobody draws. Greed tears it.',
  },
};

export default function Page() {
  return <Client />;
}
