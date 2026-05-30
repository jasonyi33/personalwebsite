import type { Metadata } from 'next';
import DesktopShellClient from '@/app/DesktopShellClient';
import { SITE } from '@/lib/seo';

export const metadata: Metadata = {
  title: `Experience — ${SITE.name}`,
  description: SITE.description,
  alternates: { canonical: `${SITE.url}/experience` },
  openGraph: {
    title: `Experience — ${SITE.name}`,
    description: SITE.description,
    url: `${SITE.url}/experience`,
    type: 'profile',
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Experience — ${SITE.name}`,
    description: SITE.description,
    creator: SITE.twitter,
  },
};

export default function ExperienceDeepLinkPage() {
  return <DesktopShellClient initialDeeplink={{ appId: 'experience' }} />;
}
