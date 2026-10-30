import type { AnchorHTMLAttributes } from 'react';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; prefetch?: boolean };

export default function Link({ prefetch: _prefetch, ...rest }: Props) {
  return <a {...rest} />;
}
