import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'The Identifiable Victim Effect — Does One Named Person Outweigh a Million?',
  description:
    '8 paired appeals across 4 cause areas (hunger, disaster, medical, animal welfare). Half describe a statistical population; half describe one named individual whose face you can almost see. You move a willingness-to-help slider on each. WIZ computes your Identifiable Victim Gap: the average bump for the named person over the statistical population. Based on Schelling (1968), Jenni & Loewenstein (1997), Small Loewenstein & Slovic (2007), Kogut & Ritov (2005), Slovic (2007) "If I Look at the Mass I Will Never Act", Lee & Feeley (2016) meta of 41 studies. Profiles from The Statistician to The Pure Particularist.',
  keywords: [
    'identifiable victim effect',
    'psychic numbing',
    'singularity effect',
    'Paul Slovic',
    'George Loewenstein',
    'Deborah Small',
    'cognitive bias',
    'wiz experiment',
  ],
  openGraph: {
    title: 'The Identifiable Victim Effect — Why a Single Face Moves You More Than a Million',
    description:
      'Eight appeals. Four describe a statistical population. Four describe one named person whose story you can hold in your head. WIZ measures the gap between what you give to one and what you give to many.',
  },
};

export default function Page() {
  return <Client />;
}
