import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Turing Patterns: How a Leopard Gets Its Spots',
  description:
    "Morphogenesis, made hands-on and WIZ-narrated. Two invisible chemicals spread across a dish and feed on each other by one tiny rule, and out of a flat, featureless start they paint spots, stripes, mazes, coral, and dots that grow and split like dividing cells. Nothing is drawn and no image is loaded: it is a live Gray-Scott reaction-diffusion simulation running thousands of cells a frame in your browser. Two knobs, a feed rate and a kill rate, decide which animal you get. Drag them across the map and watch a leopard turn into a labyrinth turn into a boiling chaos that never settles. Alan Turing wrote the math down in 1952 in his last paper before he died, explaining how a ball of identical cells with no blueprint becomes a striped, spotted, fingered creature. The pattern was never in the cells. It was hiding in the chemistry, waiting for the right two numbers.",
  keywords: [
    'turing patterns',
    'reaction diffusion',
    'gray-scott',
    'morphogenesis',
    'alan turing',
    'how the leopard got its spots',
    'cellular pattern formation',
    'emergence',
    'simulation',
    'wiz experiment',
  ],
  openGraph: {
    title: 'Turing Patterns: How a Leopard Gets Its Spots',
    description:
      'Two invisible chemicals, one tiny rule, and a flat dish paints itself into spots, stripes, mazes, and dividing cells. Drag the two knobs and turn a leopard into a labyrinth. A live reaction-diffusion sim of the math Turing wrote in his last paper.',
  },
};

export default function Page() {
  return <Client />;
}
