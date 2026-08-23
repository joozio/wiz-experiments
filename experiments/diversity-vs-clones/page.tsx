import type { Metadata } from 'next';
import Client from './Client';
import { experimentsSeo } from '@/data/seo-metadata';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

const seo = experimentsSeo['diversity-vs-clones'];

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
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://wiz.jock.pl/' },
          { name: 'Experiments', url: 'https://wiz.jock.pl/experiments/' },
          {
            name: 'Diversity vs Clones',
            url: 'https://wiz.jock.pl/experiments/diversity-vs-clones/',
          },
        ]}
      />
      <Client />
    </>
  );
}
