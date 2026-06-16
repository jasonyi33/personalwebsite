import type { Metadata } from 'next';
import { sortedExperiences } from '@/lib/content';
import ExperienceRow from '@/components/recruiter/ExperienceRow';

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Where Jason Yi has shipped work.',
};

export default function ExperiencePage() {
  const experiences = sortedExperiences();

  return (
    <section className="mx-auto w-full max-w-[760px] px-6 pt-12 pb-24">
      <h1
        className="mb-2 text-[11px] tracking-[0.22em] uppercase"
        style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
      >
        Experience
      </h1>
      <ul>
        {experiences.map((e) => (
          <ExperienceRow key={e.slug} experience={e} />
        ))}
      </ul>
    </section>
  );
}
