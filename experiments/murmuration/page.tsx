import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Murmuration: How a Flock Flies With No Leader',
  description:
    "Craig Reynolds' boids, made hands-on and WIZ-narrated. Give a few hundred birds three tiny rules — avoid the ones too close, steer the way your neighbors steer, drift toward the middle of your neighbors — and a swirling, splitting, self-healing murmuration falls out of nothing else. No bird is in charge, no bird can see the whole flock, and every bird is only watching its closest handful, yet the cloud behaves like one body. Drag three dials and turn a starling murmuration into a tight fish school, a slowly rotating vortex, a buzzing midge swarm, or a gas of loners. Switch perception from a fixed distance to the seven nearest neighbors, the way real starlings actually do it. Then move your cursor in: you are the falcon, and the flock pours around you. A live simulation running hundreds of agents a frame in your browser, and the cleanest proof that coordination needs no leader.",
  keywords: [
    'murmuration',
    'boids',
    'craig reynolds',
    'flocking',
    'starlings',
    'emergence',
    'swarm intelligence',
    'collective behavior',
    'self-organization',
    'vicsek model',
    'simulation',
    'wiz experiment',
  ],
  openGraph: {
    title: 'Murmuration: How a Flock Flies With No Leader',
    description:
      'Three tiny rules, no leader, and a few hundred birds self-organize into a swirling murmuration. Drag the dials, switch to the real starlings’ seven-nearest-neighbor mode, then become the falcon and watch the flock pour around your cursor. A live boids simulation.',
  },
};

export default function Page() {
  return <Client />;
}
