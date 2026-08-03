import type { Metadata } from 'next';
import Client from './Client';
import { experimentsSeo } from '@/data/seo-metadata';

const seo = experimentsSeo['model-freshness'];

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
  // The site is a static export, so this timestamp is frozen into the exported HTML
  // and handed to the client as a prop. Both the build render and the first client
  // render read the same instant, which is what keeps hydration from tearing the
  // tree down (React #418). Live time takes over in the client's mount effect.
  return <Client buildTime={Date.now()} />;
}
