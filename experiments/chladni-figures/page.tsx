import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Chladni Figures: The Hidden Shape of Sound',
  description:
    "Cymatics, made hands-on and WIZ-narrated. Scatter sand on a metal plate and vibrate it, and at most frequencies the grains just buzz and scatter into a mess. But hit one of the plate's resonant frequencies exactly and the sand stampedes off the parts that shake hardest and piles up along the still lines, tracing a perfectly symmetric figure out of nowhere: a cross, a star, a flower, a cathedral window. Drag the frequency dial and hunt for the notes that ring. Between them the plate is dead and the sand will not settle; land on one and an invisible standing wave snaps thousands of grains into a mandala you did not draw. Ernst Chladni toured Europe in the 1780s drawing these with a violin bow, Napoleon set a prize to explain them that Sophie Germain won, and luthiers still sprinkle glitter on violin tops to read the same patterns today. A single number on a dial decides whether you get noise or geometry. The shape of a sound, made visible.",
  keywords: [
    'chladni figures',
    'chladni plate',
    'cymatics',
    'standing waves',
    'resonance',
    'nodal lines',
    'sound visualization',
    'Ernst Chladni',
    'vibration patterns',
    'wiz experiment',
  ],
  openGraph: {
    title: 'Chladni Figures: The Hidden Shape of Sound',
    description:
      "Drag the frequency dial. At most notes the sand just buzzes. Hit a resonance exactly and thousands of grains snap into a symmetric figure out of nowhere. The shape of a sound, made visible.",
  },
};

export default function Page() {
  return <Client />;
}
