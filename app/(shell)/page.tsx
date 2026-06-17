import Link from 'next/link';
import {
  getAbout,
  featuredProjects,
  featuredExperiences,
} from '@/lib/content';
import Hero from '@/components/recruiter/Hero';
import ContactCard from '@/components/recruiter/ContactCard';
import TiltedProjectCard from '@/components/recruiter/TiltedProjectCard';
import ExperienceRow from '@/components/recruiter/ExperienceRow';

export default function HomePage() {
  const about = getAbout();
  const projects = featuredProjects();
  const experiences = featuredExperiences();

  return (
    <>
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
          <div className="mt-5 text-right">
            <Link
              href="/projects"
              className="text-[11px] tracking-[0.22em] uppercase underline-offset-4 hover:underline"
              style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
            >
              See more projects →
            </Link>
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
          <div className="mt-5 text-right">
            <Link
              href="/experience"
              className="text-[11px] tracking-[0.22em] uppercase underline-offset-4 hover:underline"
              style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
            >
              See more experience →
            </Link>
          </div>
        </section>
      ) : null}

      <ContactCard about={about} />
    </>
  );
}
