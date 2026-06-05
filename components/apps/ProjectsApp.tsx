'use client';

/**
 * ProjectsApp — recruiter-shaped browser.
 *
 *  Default view: a wide featured card (the project with `featured: true` —
 *  VoiceReach) + a grid of the remaining projects. Click a card to drill
 *  into the detail view, which retains the prior keyboard-nav behavior.
 *
 *  Deep-link: ?project=<slug> drills directly into the detail view.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { sortedProjects } from '@/lib/content';
import ProjectCard from './projects/ProjectCard';
import ProjectDetail from './projects/ProjectDetail';

export default function ProjectsApp() {
  const projects = useMemo(() => sortedProjects(), []);
  const featured = useMemo(
    () => projects.find((p) => p.featured) ?? projects[0],
    [projects],
  );
  const others = useMemo(
    () => projects.filter((p) => p.slug !== featured?.slug),
    [projects, featured],
  );

  const [view, setView] = useState<'grid' | 'detail'>('grid');
  const [index, setIndex] = useState(0);

  // Honor deep-link.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('project');
    if (!slug) return;
    const i = projects.findIndex((p) => p.slug === slug);
    if (i >= 0) {
      setIndex(i);
      setView('detail');
    }
  }, [projects]);

  const openDetail = useCallback(
    (slug: string) => {
      const i = projects.findIndex((p) => p.slug === slug);
      if (i < 0) return;
      setIndex(i);
      setView('detail');
    },
    [projects],
  );

  const handleNext = () => setIndex((i) => (i + 1) % projects.length);
  const handleBack = () => setView('grid');

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (view !== 'detail') return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setIndex((i) => (i + 1) % projects.length);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setIndex((i) => (i - 1 + projects.length) % projects.length);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setView('grid');
      }
    },
    [view, projects.length],
  );

  if (projects.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <span
          className="text-[12px]"
          style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
        >
          no projects yet.
        </span>
      </div>
    );
  }

  if (view === 'detail') {
    const current = projects[index];
    const nextProject = projects[(index + 1) % projects.length] ?? null;
    return (
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="h-full w-full outline-none"
      >
        <ProjectDetail
          key={current.slug}
          project={current}
          nextProject={nextProject && nextProject.slug !== current.slug ? nextProject : null}
          onNext={handleNext}
          onBack={handleBack}
          showBack
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-6">
      <div className="mx-auto flex max-w-[1000px] flex-col gap-4">
        <header className="flex items-baseline justify-between">
          <h2
            className="text-[14px] tracking-wide"
            style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
          >
            projects · {projects.length}
          </h2>
          <span
            className="text-[10px] tracking-[0.18em]"
            style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
          >
            SHIPPED · IN PROGRESS · ARCHIVED
          </span>
        </header>

        {featured ? (
          <ProjectCard
            project={featured}
            variant="featured"
            onSelect={() => openDetail(featured.slug)}
          />
        ) : null}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((p) => (
            <ProjectCard
              key={p.slug}
              project={p}
              variant="grid"
              onSelect={() => openDetail(p.slug)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
