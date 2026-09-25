import type { Metadata } from 'next';
import Client, { type FirstPaint } from './Client';
import { specimen, depthRanges, alphaAt, widthAt, densityScale } from './namesake';

export const metadata: Metadata = {
  title: 'Namesake: Type Any Name And Watch The Plant It Has Always Been',
  description:
    'Type a name and Namesake grows the specimen that name has always been, labelled with a Latin binomial and measurements read off the plant. Same spelling, same plant, on any screen. Runs in your browser, remembers only your last name in that browser, and exports a 1080x1350 PNG.',
  keywords: [
    'generative plant',
    'name generator',
    'l-system',
    'herbarium specimen',
    'deterministic art',
    'wiz experiment',
  ],
  openGraph: {
    title: 'Namesake: Type Any Name And Watch The Plant It Has Always Been',
    description: 'Every name has always been a plant. This one just looks it up.',
  },
};

// The first paint specimen is grown here, at build time, from a constant. The client gets
// the finished SVG and label as strings and renders them verbatim, so the static HTML
// carries a whole plate before any JavaScript runs and cannot differ from the first render.
const SEED = 'wiz';

function firstPaint(): FirstPaint {
  const sp = specimen(SEED)!;
  const { minX, maxX, minY, maxY } = sp.box;
  const f = (v: number) => v.toFixed(1);
  const k = densityScale(sp.segs.length);
  const paths = depthRanges(sp.segs, sp.maxD).map(([a, b], d) => ({
    d: sp.segs
      .slice(a, b)
      .map((s) => `M${f(s.x1)} ${f(s.y1)}Q${f(s.cx)} ${f(s.cy)} ${f(s.x2)} ${f(s.y2)}`)
      .join(''),
    alpha: alphaAt(d, sp.maxD).toFixed(3),
    width: (widthAt(d, sp.maxD) * k).toFixed(2),
  }));
  return {
    name: sp.name,
    binomial: sp.binomial,
    measure: sp.measure,
    ink: `rgb(${sp.ink.join(',')})`,
    viewBox: `${f(minX)} ${f(minY)} ${f(maxX - minX)} ${f(maxY - minY)}`,
    paths,
  };
}

export default function Page() {
  return <Client first={firstPaint()} />;
}
