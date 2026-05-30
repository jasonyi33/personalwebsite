import type { Metadata } from 'next';
import DesktopShellClient from '@/app/DesktopShellClient';
import { SITE } from '@/lib/seo';

export const metadata: Metadata = {
  title: `Interests — ${SITE.name}`,
  description: SITE.description,
  alternates: { canonical: `${SITE.url}/interests` },
  openGraph: {
    title: `Interests — ${SITE.name}`,
    description: SITE.description,
    url: `${SITE.url}/interests`,
    type: 'website',
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Interests — ${SITE.name}`,
    description: SITE.description,
    creator: SITE.twitter,
  },
};

export default function InterestsDeepLinkPage() {
  return <DesktopShellClient initialDeeplink={{ appId: 'interests' }} />;
}
