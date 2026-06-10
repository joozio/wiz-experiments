import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Moral Licensing Effect — Does Doing Good Quietly Permit Doing Bad?',
  description:
    '8 paired scenarios across 4 life domains (hiring, environment, indulgence, honesty). Half ask about a morally mixed behavior cold. Half ask about the same behavior after a prior moral act has been logged on your record. You move a likelihood slider on each. WIZ computes your Moral Licensing Gap: the average bump for the licensed version over the unlicensed version. Based on Monin & Miller (2001) JPSP founding hiring study, Sachdeva Iliev & Medin (2009) Psychological Science moral self-regulation model, Mazar & Zhong (2010) Psychological Science green-then-cheat experiment, Khan & Dhar (2006) JMR virtuous-then-indulgent intent, Effron Cameron & Monin (2009) JESP Obama study, Blanken van de Ven & Zeelenberg (2015) PSPB 91-study meta-analysis, Simbrunner & Schlegelmilch (2017) Management Review Quarterly 89-study meta. Profiles from The Steady (gap <5) to The Compartmentalized (>30).',
  keywords: [
    'moral licensing',
    'moral credentials',
    'Benoit Monin',
    'Dale Miller',
    'Sachdeva Iliev Medin',
    'Mazar Zhong',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Moral Licensing Effect — Does a Good Deed Quietly Let You Off the Hook?',
    description:
      'Eight scenarios. Four ask about a morally mixed behavior cold. Four ask about the same behavior after a prior moral act has been logged on your record. WIZ measures the bump.',
  },
};

export default function Page() {
  return <Client />;
}
