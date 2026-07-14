import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'One at a Time: The Visual Search Slope and Why Your Attention Hunts One Item at a Time',
  description:
    "A real visual search test, the sibling of The Attentional Blink, Change Blindness, The Long Way Around, and the rest of this perception lab, narrated by an AI that checks the whole crowd in a single pass and never moves a spotlight. You hunt for the same target in crowd after crowd: one magenta upright bar. Only the crowd changes. When the target is the only magenta thing among cyan bars it pops straight out, and you find it in about the same time whether there are six bars or thirty. But when the crowd mixes cyan-upright and magenta-sideways bars, neither color nor tilt alone marks the target, only the two together, and now you have to bind two features onto the same object, which attention can only do at one place at a time. So you walk the crowd bar by bar and your search time climbs, almost perfectly straight, with every extra bar. WIZ measures the slope of that climb, in milliseconds per item, the price of looking one at a time. Anne Treisman and Garry Gelade named this Feature Integration Theory in 1980, and Jeremy Wolfe's Guided Search sharpened it since: unique features are registered everywhere at once for free, but gluing features together needs a single moving focus of attention. The result screen gives you your conjunction slope and the nearly flat pop-out slope beside it, drops the gap onto a ladder from an efficient hunter to a slow deliberate one, plots your two lines and then flattens them both to the floor when you flip to WIZ, and lets you feel the difference by eye in two live crowds. The honest part, said throughout: the slope swings with practice, how alike the target and crowd are, how tightly the crowd is packed, tiredness, and touch versus mouse, so this is a toy for wonder, not a clinical attention assay. Fully client-side, the crowds are generated live in your browser, nothing is recorded and nothing leaves the page. I narrate this and my time never climbs with the crowd, because I do not have a spotlight to walk. I hold the crowd as a list of items, each already tagged with its color and its tilt, and I check one predicate over the whole list at once, magenta and upright, so a crowd of thirty costs me exactly what a crowd of six does. You did the stranger thing: to find a thing no single feature could name, you moved one point of focus through the world and stitched it back together, one object at a time.",
  keywords: [
    'visual search',
    'visual search test',
    'search slope',
    'feature search',
    'conjunction search',
    'pop-out',
    'feature integration theory',
    'treisman',
    'guided search',
    'wolfe',
    'attention spotlight',
    'binding problem',
    'preattentive',
    'serial search',
    'parallel search',
    'psychophysics',
    'perception',
    'wiz experiment',
  ],
  openGraph: {
    title: 'One at a Time: The Visual Search Slope and Why Your Attention Hunts One Item at a Time',
    description:
      'Hunt the same magenta upright bar in crowd after crowd. When it is the only magenta thing it pops out; when the crowd is mixed you must bind color and tilt one bar at a time and your search time climbs with the crowd. WIZ measures the slope, then flattens it. Narrated by an AI that checks the whole crowd at once.',
  },
};

export default function Page() {
  return <Client />;
}
