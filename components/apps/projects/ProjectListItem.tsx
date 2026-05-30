'use client';

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
      className="block w-full cursor-pointer px-3 py-2.5 text-left transition-colors hover:bg-[var(--accent-2)]"
      style={{
        background: selected ? 'var(--accent-2)' : 'transparent',
        borderLeft: `2px solid ${selected ? 'var(--accent)' : 'transparent'}`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span
              className="text-[10px]"
              style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
            >
              {num}
            </span>
            <span
              className="truncate text-[13px] font-medium"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-sans)' }}
            >
              {project.title}
            </span>
          </div>
          <div
            className="mt-0.5 truncate text-[11px]"
            style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
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
