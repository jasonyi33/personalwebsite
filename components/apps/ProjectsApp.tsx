'use client';

/**
 * ProjectsApp — two-pane Projects browser (spec 5.1).
 *
 * Left:  sortable sidebar of projects (StatusDot + tagline).
 * Right: detail pane with cover image and MDX body.
 *
 * Keyboard:  ArrowUp/Down change selection, Enter is a no-op (selection ==
 *            opening), Escape collapses to detail-only on mobile.
 *
 * Mobile (<640px): sidebar hides; tap a project to open detail, "back"
 *                  button returns to the list.
 *
 * Deep-link: ?project=<slug> opens that project on mount (Phase 7 will wire
 *            real URL sync).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sortedProjects } from '@/lib/content';
import ProjectListItem from './projects/ProjectListItem';
import ProjectDetail from './projects/ProjectDetail';

function useIsNarrow(): boolean {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return narrow;
}

export default function ProjectsApp() {
  const projects = useMemo(() => sortedProjects(), []);
  const [index, setIndex] = useState(0);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);
  const narrow = useIsNarrow();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initial deep-link via ?project=slug
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('project');
    if (!slug) return;
    const i = projects.findIndex((p) => p.slug === slug);
    if (i >= 0) {
      setIndex(i);
      setMobileShowDetail(true);
    }
  }, [projects]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (projects.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIndex((i) => Math.min(projects.length - 1, i + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (narrow) setMobileShowDetail(true);
      } else if (e.key === 'Escape') {
        if (narrow && mobileShowDetail) {
          e.preventDefault();
          setMobileShowDetail(false);
        }
      }
    },
    [projects.length, narrow, mobileShowDetail],
  );

  // Focus the container so keyboard nav works without a click first.
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  if (projects.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <span
          className="font-[family-name:var(--font-mono)] text-[12px] tracking-widest"
          style={{ color: 'var(--nerv-bone-dim)' }}
        >
          &gt; NO PROJECTS INDEXED. AWAITING DATA.
        </span>
      </div>
    );
  }

  const current = projects[index];
  const nextProject = projects[(index + 1) % projects.length] ?? null;
  const handleSelect = (i: number) => {
    setIndex(i);
    if (narrow) setMobileShowDetail(true);
  };
  const handleNext = () => setIndex((i) => (i + 1) % projects.length);
  const handleBack = () => setMobileShowDetail(false);

  const showSidebar = !narrow || !mobileShowDetail;
  const showDetail = !narrow || mobileShowDetail;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex h-full w-full outline-none"
    >
      {showSidebar ? (
        <aside
          className="flex shrink-0 flex-col overflow-y-auto"
          style={{
            width: narrow ? '100%' : 280,
            borderRight: narrow
              ? 'none'
              : '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.15)',
          }}
        >
          <div
            className="px-3 py-2 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em]"
            style={{
              color: 'var(--nerv-cyan-dim)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            PROJECT INDEX
          </div>
          <div className="flex flex-col py-1">
            {projects.map((p, i) => (
              <ProjectListItem
                key={p.slug}
                project={p}
                index={i}
                selected={i === index}
                onSelect={() => handleSelect(i)}
              />
            ))}
          </div>
        </aside>
      ) : null}

      {showDetail ? (
        <div className="min-w-0 flex-1">
          <ProjectDetail
            key={current.slug}
            project={current}
            nextProject={nextProject && nextProject.slug !== current.slug ? nextProject : null}
            onNext={handleNext}
            onBack={handleBack}
            showBack={narrow}
          />
        </div>
      ) : null}
    </div>
  );
}
