'use client';

import type { Experience } from 'contentlayer/generated';

interface Props {
  experience: Experience;
  index: number;
  selected: boolean;
  onSelect: () => void;
}

function fmtRange(start: string, end?: string): string {
  const fmt = (s: string) => {
    const [y, m] = s.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mi = Math.max(0, Math.min(11, Number(m) - 1));
    return `${months[mi]} ${y}`;
  };
  return `${fmt(start)} — ${end ? fmt(end) : 'present'}`;
}

export default function ExperienceListItem({
  experience,
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
          {experience.company}
        </span>
      </div>
      <div
        className="mt-0.5 truncate text-[11px]"
        style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
      >
        {experience.role}
      </div>
      <div
        className="mt-0.5 text-[10px]"
        style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
      >
        {fmtRange(experience.start, experience.end)}
      </div>
    </button>
  );
}
