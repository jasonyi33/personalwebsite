'use client';

/**
 * ProjectCard — grid tile for ProjectsApp.
 *
 * `variant="featured"` renders wide + taller with extra meta; `variant="grid"`
 * is the standard 1-of-N tile used in the row below the featured project.
 */

import type { Project } from 'contentlayer/generated';
import StatusDot from './StatusDot';

interface Props {
  project: Project;
  variant?: 'featured' | 'grid';
  onSelect: () => void;
}

export default function ProjectCard({ project, variant = 'grid', onSelect }: Props) {
  const featured = variant === 'featured';
  const techMeta = (project.tags ?? []).slice(0, 4).join(' · ');

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative flex w-full flex-col items-start gap-3 overflow-hidden rounded-xl border px-5 py-5 text-left transition-all hover:-translate-y-0.5"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--surface-2)',
        minHeight: featured ? 220 : 180,
      }}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <span
          className="text-[10px] tracking-[0.18em]"
          style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
        >
          {featured ? 'FEATURED' : (project.tags?.[0] ?? '').toUpperCase()}
        </span>
        <span className="flex items-center gap-1.5">
          {project.outcomeChip ? (
            <span
              className="rounded-full border px-2 py-0.5 text-[10px]"
              style={{
                borderColor: 'var(--border-2)',
                color: 'var(--text)',
                background: 'transparent',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {project.outcomeChip}
            </span>
          ) : null}
          <StatusDot status={project.status} />
        </span>
      </div>

      <h3
        className="font-semibold tracking-tight"
        style={{
          color: 'var(--text)',
          fontSize: featured ? 28 : 20,
          lineHeight: 1.1,
        }}
      >
        {project.title}
      </h3>

      <p
        className="text-[13px] leading-[1.55]"
        style={{
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {project.tagline}
      </p>

      {techMeta ? (
        <p
          className="mt-auto text-[10px] tracking-wide"
          style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
        >
          {techMeta}
        </p>
      ) : null}

      <span
        aria-hidden
        className="absolute right-4 bottom-4 text-[11px] opacity-0 transition-opacity group-hover:opacity-100"
        style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
      >
        open →
      </span>
    </button>
  );
}
