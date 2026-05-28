/**
 * Deep-link page for NOW.feed. Mounts DesktopShell with the Now window
 * already opened.
 */

import type { Metadata } from 'next';
import DesktopShellClient from '@/app/DesktopShellClient';
import { SITE } from '@/lib/seo';

export const metadata: Metadata = {
  title: `Now — ${SITE.name}`,
  description: `What [YOUR NAME] is focused on right now. Live feed from ${SITE.name}.`,
  alternates: { canonical: `${SITE.url}/now` },
  openGraph: {
    title: `Now — ${SITE.name}`,
    description: `What [YOUR NAME] is focused on right now.`,
    url: `${SITE.url}/now`,
    type: 'website',
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Now — ${SITE.name}`,
    description: `What [YOUR NAME] is focused on right now.`,
    creator: SITE.twitter,
  },
};

export default function NowDeepLinkPage() {
  return <DesktopShellClient initialDeeplink={{ appId: 'now' }} />;
}
