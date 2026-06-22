import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Mandelbrot Set: One Rule, an Infinite Coastline, and Every Julia Set Hiding Inside It',
  description:
    "The most intricate object in mathematics, made hands-on and WIZ-narrated. There is exactly one rule: pick a point c on the plane, start at zero, and repeat z -> z squared + c. If the number stays small forever, the point is in the set and you paint it black; if it flies off to infinity, you colour it by how many steps it took to escape. That single rule draws a shape with a boundary of infinite length packed into a finite area, where the same buds, spirals, seahorses and lightning recur at every depth, and where buried in the filaments are perfect tiny copies of the whole set, forever. Dive into the edge by clicking, and the detail never runs out. Then hover anywhere and watch that point's Julia set render live in a second window: the Mandelbrot set is secretly the index of every Julia set at once, the exact map of which seeds give a single connected piece and which shatter into dust. The needle pointing left off the set is the same bifurcation diagram as the Logistic Map. Discovered, not invented, by Benoit Mandelbrot in 1980 on an IBM mainframe, this is the icon of chaos and fractal geometry, a live escape-time render in your browser, not a canned picture.",
  keywords: [
    'mandelbrot set',
    'julia set',
    'fractal',
    'escape time',
    'complex dynamics',
    'benoit mandelbrot',
    'chaos',
    'fractal geometry',
    'self-similarity',
    'infinite zoom',
    'seahorse valley',
    'douady rabbit',
    'simulation',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Mandelbrot Set: One Rule, an Infinite Coastline, and Every Julia Set Inside It',
    description:
      'One rule — z -> z squared + c, repeated — draws a shape with an infinitely detailed border that hides a perfect copy of itself at every depth. Dive into the edge, and hover to watch every point grow its own Julia set live.',
  },
};

export default function Page() {
  return <Client />;
}
