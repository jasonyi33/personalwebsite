/**
 * Deep-link page for a single blog post. Mounts DesktopShell with
 * LOGS.app focused on this slug.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allPosts } from 'contentlayer/generated';
import DesktopShellClient from '@/app/DesktopShellClient';
import { SITE } from '@/lib/seo';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return allPosts.filter((p) => !p.draft).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) {
    return { title: `NOT FOUND — ${SITE.name}` };
  }
  const title = `${post.title} — ${SITE.name}`;
  const description = post.excerpt;
  const url = `${SITE.url}/blog/${post.slug}`;
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
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: SITE.twitter,
    },
  };
}

export default async function BlogDeepLinkPage({ params }: RouteParams) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post || post.draft) notFound();
  return (
    <DesktopShellClient
      initialDeeplink={{ appId: 'blog', slug: post.slug }}
    />
  );
}
