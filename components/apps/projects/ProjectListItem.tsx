'use client';

/**
 * ProjectListItem — a single row in the Projects sidebar.
 *
 * Row layout:
 *   [01 ▸]  Title (Orbitron 13)              ● status dot
 *           tagline (mono 11, dim, truncated)
 *
 * Selected rows show a 3px cyan left border and a faint cyan wash.
 */

import type { Project } from 'contentlayer/generated';
import StatusDot from './StatusDot';

interface Props {
  project: Project;
  index: number;
  selected: boolean;
  onSelect: () => void;
}

export default function ProjectListItem({
  project,
  index,
  selected,
  onSelect,
}: Props) {
  const num = String(index + 1).padStart(2, '0');
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected}
      className="block w-full cursor-pointer px-3 py-2.5 text-left transition-colors"
      style={{
        background: selected ? 'rgba(0,207,255,0.06)' : 'transparent',
        borderLeft: selected
          ? '3px solid var(--nerv-cyan)'
          : '3px solid transparent',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span
              className="font-[family-name:var(--font-mono)] text-[11px]"
              style={{ color: 'var(--nerv-cyan-dim)' }}
            >
              {num} ▸
            </span>
            <span
              className="truncate font-[family-name:var(--font-display)] text-[13px] tracking-wide"
              style={{ color: 'var(--nerv-bone)' }}
            >
              {project.title}
            </span>
          </div>
          <div
            className="mt-1 truncate font-[family-name:var(--font-mono)] text-[11px]"
            style={{ color: 'var(--nerv-bone-dim)' }}
          >
            {project.tagline}
          </div>
        </div>
        <div className="pt-1.5">
          <StatusDot status={project.status} />
        </div>
      </div>
    </button>
  );
}
