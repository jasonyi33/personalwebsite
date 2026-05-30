import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allExperiences } from 'contentlayer/generated';
import DesktopShellClient from '@/app/DesktopShellClient';
import { SITE } from '@/lib/seo';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return allExperiences.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const experience = allExperiences.find((e) => e.slug === slug);
  if (!experience) {
    return { title: `Not found — ${SITE.name}` };
  }
  const title = `${experience.company} · ${experience.role} — ${SITE.name}`;
  const description = experience.summary ?? `${experience.role} at ${experience.company}.`;
  const url = `${SITE.url}/experience/${experience.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article', siteName: SITE.name },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: SITE.twitter,
    },
  };
}

export default async function ExperienceDeepLinkPage({ params }: RouteParams) {
  const { slug } = await params;
  const experience = allExperiences.find((e) => e.slug === slug);
  if (!experience) notFound();
  return (
    <DesktopShellClient
      initialDeeplink={{ appId: 'experience', slug: experience.slug }}
    />
  );
}
