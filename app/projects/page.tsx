import type { Metadata } from 'next';
import DesktopShellClient from '@/app/DesktopShellClient';
import { SITE } from '@/lib/seo';

export const metadata: Metadata = {
  title: `Projects — ${SITE.name}`,
  description: SITE.description,
  alternates: { canonical: `${SITE.url}/projects` },
  openGraph: {
    title: `Projects — ${SITE.name}`,
    description: SITE.description,
    url: `${SITE.url}/projects`,
    type: 'website',
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Projects — ${SITE.name}`,
    description: SITE.description,
    creator: SITE.twitter,
  },
};

export default function ProjectsDeepLinkPage() {
  return <DesktopShellClient initialDeeplink={{ appId: 'projects' }} />;
}
