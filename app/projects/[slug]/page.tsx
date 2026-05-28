/**
 * Deep-link page for a single project. Renders the same DesktopShell as
 * `/` but pre-opens PROJECTS.app focused on this slug (see lib/deeplink).
 *
 * Statically generated for every project in the contentlayer index so
 * crawlers and social-card scrapers see real SSR HTML and metadata.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allProjects } from 'contentlayer/generated';
import DesktopShellClient from '@/app/DesktopShellClient';
import { SITE } from '@/lib/seo';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// Slugs not returned by `generateStaticParams` should 404 at the
// framework level (true HTTP 404) rather than render the route and
// trip our own `notFound()` — which Next 16 currently surfaces as a
// 200 with the not-found body.
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);
  if (!project) {
    return { title: `NOT FOUND — ${SITE.name}` };
  }
  const title = `${project.title} — ${SITE.name}`;
  const description = project.tagline;
  const url = `${SITE.url}/projects/${project.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: SITE.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: SITE.twitter,
    },
  };
}

export default async function ProjectDeepLinkPage({ params }: RouteParams) {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);
  if (!project) notFound();
  return (
    <DesktopShellClient
      initialDeeplink={{ appId: 'projects', slug: project.slug }}
    />
  );
}
