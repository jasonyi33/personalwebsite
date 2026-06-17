import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sortedExperiences } from '@/lib/content';
import ExperienceDetail from '@/components/apps/experience/ExperienceDetail';

export async function generateStaticParams() {
  return sortedExperiences().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const exp = sortedExperiences().find((e) => e.slug === slug);
  if (!exp) return {};
  return {
    title: `${exp.company} | ${exp.role}`,
    description: exp.summary,
  };
}

export default async function ExperienceDetailPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const exp = sortedExperiences().find((e) => e.slug === slug);
  if (!exp) notFound();

  return (
    <article className="mx-auto w-full max-w-[760px] px-6 pt-12 pb-24">
      <ExperienceDetail experience={exp} />
    </article>
  );
}
