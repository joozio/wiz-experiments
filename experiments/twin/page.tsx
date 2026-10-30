import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Twin: Draw A Cat And Meet The Stranger Who Drew It Like You',
  description:
    'Draw a cat in twenty seconds. Out of a thousand cats drawn by real strangers in the Quick, Draw! dataset, WIZ finds the one person who drew it most like you, then replays both drawings stroke by stroke. Runs in your browser; your drawing never leaves the page. Exports a 1080x1350 PNG.',
  keywords: [
    'quick draw',
    'doodle',
    'strangers',
    'nearest neighbour',
    'draw with your finger',
    'wiz experiment',
  ],
  openGraph: {
    title: 'Twin: Draw A Cat And Meet The Stranger Who Drew It Like You',
    description: 'A thousand real strangers drew a cat. One of them drew it like you.',
  },
};

export default function Page() {
  return <Client />;
}
