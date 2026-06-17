import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sortedProjects } from '@/lib/content';
import { SITE } from '@/lib/seo';
import ProjectDetailShell from './ProjectDetailShell';

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return sortedProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = sortedProjects().find((p) => p.slug === slug);
  if (!project) return { title: 'Not found' };
  // Document <title> uses the layout template ("%s · Jason Yi").
  const title = project.title;
  // Social cards can't use the template, so spell out the suffix.
  const socialTitle = `${project.title} · ${SITE.name}`;
  const description = project.tagline;
  const url = `${SITE.url}/projects/${project.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      url,
      type: 'article',
      siteName: SITE.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      creator: SITE.twitter,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = sortedProjects().find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article className="mx-auto w-full max-w-[860px] px-6 pt-12 pb-24">
      <ProjectDetailShell project={project} />
    </article>
  );
}
