/**
 * Deep-link page for PROFILE.dat (about). Mounts DesktopShell with the
 * About window already opened.
 */

import type { Metadata } from 'next';
import DesktopShellClient from '@/app/DesktopShellClient';
import { SITE } from '@/lib/seo';

export const metadata: Metadata = {
  title: `About — ${SITE.name}`,
  description: SITE.description,
  alternates: { canonical: `${SITE.url}/about` },
  openGraph: {
    title: `About — ${SITE.name}`,
    description: SITE.description,
    url: `${SITE.url}/about`,
    type: 'profile',
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `About — ${SITE.name}`,
    description: SITE.description,
    creator: SITE.twitter,
  },
};

export default function AboutDeepLinkPage() {
  return <DesktopShellClient initialDeeplink={{ appId: 'about' }} />;
}
