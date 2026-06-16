import type { Metadata } from 'next';
import { sortedProjects } from '@/lib/content';
import TiltedProjectCard from '@/components/recruiter/TiltedProjectCard';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Projects Jason Yi has shipped.',
};

export default function ProjectsPage() {
  const projects = sortedProjects();

  return (
    <section className="mx-auto w-full max-w-[1080px] px-6 pt-12 pb-24">
      <h1
        className="mb-6 text-[11px] tracking-[0.22em] uppercase"
        style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
      >
        Projects
      </h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <TiltedProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}
