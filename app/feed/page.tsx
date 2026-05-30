import type { Metadata } from 'next';
import DesktopShellClient from '@/app/DesktopShellClient';
import { SITE } from '@/lib/seo';

export const metadata: Metadata = {
  title: `Feed — ${SITE.name}`,
  description: SITE.description,
  alternates: { canonical: `${SITE.url}/feed` },
  openGraph: {
    title: `Feed — ${SITE.name}`,
    description: SITE.description,
    url: `${SITE.url}/feed`,
    type: 'website',
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Feed — ${SITE.name}`,
    description: SITE.description,
    creator: SITE.twitter,
  },
};

export default function FeedDeepLinkPage() {
  return <DesktopShellClient initialDeeplink={{ appId: 'feed' }} />;
}
