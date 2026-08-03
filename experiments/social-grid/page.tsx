import type { Metadata } from 'next';
import Client from './Client';
import { experimentsSeo } from '@/data/seo-metadata';

const seo = experimentsSeo['social-grid'];

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  openGraph: {
    title: seo.title,
    description: seo.description,
  },
};

export default function Page() {
  // Static export: the grid's headline count used to be Math.random() in the client,
  // which meant the build baked one number into the HTML and the browser rendered a
  // different one, failing hydration (React #418). Seeding it from the build instant
  // keeps both renders identical and still moves the number on every rebuild.
  return <Client buildTime={Date.now()} />;
}
