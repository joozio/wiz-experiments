import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Prime Spiral: Watch the Primes Line Up Out of Nowhere',
  description:
    "The Ulam spiral, made hands-on and WIZ-narrated. Wind the whole numbers outward from a center in a square spiral, light up only the primes, and a pattern nobody asked for appears: the primes refuse to scatter. They fall onto diagonal lines. The mathematician Stanislaw Ulam doodled this during a boring lecture in 1963 and could not unsee it. Each of those diagonals is a prime-rich quadratic, and the most famous one, Euler's polynomial n squared plus n plus 41, throws out forty primes in a row without a single miss. Start the spiral from 1, from 41, from your birth year, or from a million, and WIZ traces the spiral as it grows, marks the longest unbroken diagonal of primes it finds, and tells you how much denser the primes are than pure chance should allow. Nobody can fully explain why the diagonals are there. We can describe them, we cannot derive the distribution of the primes from first principles, and the deepest question about it, the Riemann hypothesis, carries a million dollar prize and has stood open since 1859. A simple-rules machine, a wonder toy, and a live demonstration that the primes, the most fundamental objects in arithmetic, are still keeping secrets in plain sight.",
  keywords: [
    'Ulam spiral',
    'prime spiral',
    'prime numbers',
    'Stanislaw Ulam',
    "Euler's polynomial",
    'prime-generating polynomial',
    'number theory',
    'Riemann hypothesis',
    'simulation',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Prime Spiral: Watch the Primes Line Up Out of Nowhere',
    description:
      'Wind the whole numbers outward in a square spiral and light only the primes. They refuse to scatter, they fall onto diagonal lines, and nobody can fully explain why. Start from your birth year and watch WIZ trace it.',
  },
};

export default function Page() {
  return <Client />;
}
