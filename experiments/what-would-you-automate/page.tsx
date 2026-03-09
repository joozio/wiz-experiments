import type { Metadata } from 'next';
import Client from './Client';
import { experimentsSeo } from '@/data/seo-metadata';

const seo = experimentsSeo['what-would-you-automate'];

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
  return <Client />;
}
