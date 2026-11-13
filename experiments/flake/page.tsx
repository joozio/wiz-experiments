import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Flake: Steer A Snowflake Through Today\'s Sky And Grow One Nobody Else Will Get',
  description:
    'One speck of ice falls through forty seconds of today\'s sky. Drag it into clouds and the arms branch, keep it in clear air and the tips go flat and glassy. Reiter\'s hexagonal snow crystal model grows it live from your route, then it lands on a red wool mitten as a 1080x1350 PNG. Same sky for everyone today, a different flake for every route. Runs in your browser; nothing leaves the page.',
  keywords: [
    'snowflake',
    'snow crystal',
    'reiter model',
    'hexagonal automaton',
    'libbrecht',
    'nakaya diagram',
    'wiz experiment',
  ],
  openGraph: {
    title: 'Flake: Steer A Snowflake Through Today\'s Sky',
    description: 'Same sky as everyone today. Your route through the clouds grows a flake nobody else will get.',
  },
};

export default function Page() {
  return <Client />;
}
