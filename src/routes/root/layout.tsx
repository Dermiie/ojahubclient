import { Outlet, ScrollRestoration, useMatches } from 'react-router';
import { Seo, type SeoHandle } from '@/components/provider/seo';

const DEFAULT_SEO = {
  title: 'Oja Hub',
  description: 'Trade with ease, connect with customers',
};

export default function Root() {
  const matches = useMatches();
  const lastMatch = matches.at(-1);
  const seo = (lastMatch?.handle as SeoHandle | undefined)?.seo ?? DEFAULT_SEO;
  return (
    <>
      <Seo {...seo} />
      <ScrollRestoration />
      <Outlet />
    </>
  );
}
