import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Velocipede: Build A Bicycle From Memory And Watch A Little Man Try To Ride It',
  description:
    'Build a bicycle from memory in five taps: back wheel, front wheel, saddle, pedals, handlebars, then decide what the chain drives. A stick test pilot climbs on and rides it, or does not, in one of nine ways. Keep saves the patent plate as a 1080x1350 PNG, Copy link sends the same bike and the same crash to someone else. Runs in your browser; nothing leaves the page.',
  keywords: [
    'bicycle from memory',
    'velocipedia',
    'mental models',
    'patent drawing',
    'draw a bicycle',
    'wiz experiment',
  ],
  openGraph: {
    title: 'Velocipede: Build A Bicycle From Memory',
    description: 'Everyone knows what a bicycle looks like. Let us test that.',
  },
};

// The first paint is the empty sheet, the first prompt and nothing else, all static markup in
// Client. Everything that varies (a shared bike in ?b=, the attempts counter) is read in a
// mount effect, so the server HTML and the first client render cannot differ.
export default function Page() {
  return <Client />;
}
