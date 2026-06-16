import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getAbout,
  featuredExperiences,
  featuredProjects,
} from '@/lib/content';
import Hero from '@/components/recruiter/Hero';
import ContactCard from '@/components/recruiter/ContactCard';
import TiltedProjectCard from '@/components/recruiter/TiltedProjectCard';
import ExperienceRow from '@/components/recruiter/ExperienceRow';

export const metadata: Metadata = {
  title: 'Jason Yi — recruiter view',
  description:
    'Berkeley EECS · AI Product Engineer. Selected projects, experience, and how to reach me.',
  robots: { index: false, follow: true },
};

export default function RecruiterPage() {
  const about = getAbout();
  const projects = featuredProjects();
  const experiences = featuredExperiences();

  return (
    <main
      className="min-h-screen"
      style={{
        background: 'var(--background)',
        color: 'var(--text)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <Hero about={about} />

      {projects.length > 0 ? (
        <section className="mx-auto w-full max-w-[760px] px-6 pb-12">
          <h2
            className="mb-6 text-[11px] tracking-[0.22em] uppercase"
            style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
          >
            Selected projects
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <TiltedProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      ) : null}

      {experiences.length > 0 ? (
        <section className="mx-auto w-full max-w-[760px] px-6 pb-12">
          <h2
            className="mb-2 text-[11px] tracking-[0.22em] uppercase"
            style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
          >
            Experience
          </h2>
          <ul>
            {experiences.map((e) => (
              <ExperienceRow key={e.slug} experience={e} />
            ))}
          </ul>
        </section>
      ) : null}

      <ContactCard about={about} />

      <footer
        className="mx-auto w-full max-w-[760px] px-6 pb-16 text-center text-[11px]"
        style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
      >
        <Link href="/" className="underline-offset-4 hover:underline">
          explore the long version →
        </Link>
      </footer>
    </main>
  );
}
