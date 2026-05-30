'use client';

import { useMDXComponent } from 'next-contentlayer2/hooks';
import type { Experience } from 'contentlayer/generated';

interface Props {
  experience: Experience;
  onBack?: () => void;
  showBack?: boolean;
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

export default function ExperienceDetail({ experience, onBack, showBack }: Props) {
  const Body = useMDXComponent(experience.body.code);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-[640px] px-7 py-7">
        {showBack && onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="mb-4 text-[11px] tracking-wide"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
          >
            ← back
          </button>
        ) : null}

        <header className="mb-5">
          <h1
            className="text-[22px] font-semibold tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            {experience.company}
          </h1>
          <p
            className="mt-1 text-[13px]"
            style={{ color: 'var(--text-dim)' }}
          >
            {experience.role}
          </p>
          <p
            className="mt-2 text-[11px] tracking-wide"
            style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
          >
            {fmtRange(experience.start, experience.end)}
            {experience.location ? ` · ${experience.location}` : ''}
          </p>
        </header>

        {experience.bullets.length > 0 && (
          <ul className="mb-6 space-y-2 text-[13.5px] leading-[1.6]">
            {experience.bullets.map((b, i) => (
              <li
                key={i}
                className="flex gap-3"
                style={{ color: 'var(--text)' }}
              >
                <span
                  className="select-none pt-[6px]"
                  aria-hidden
                  style={{ color: 'var(--accent)' }}
                >
                  ●
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        <article
          className="text-[13.5px] leading-[1.75]"
          style={{ color: 'var(--text-dim)' }}
        >
          <Body />
        </article>

        {experience.tags.length > 0 && (
          <div className="mt-7 flex flex-wrap gap-1.5">
            {experience.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border px-2 py-[2px] text-[10px] tracking-wide"
                style={{
                  color: 'var(--text-dim)',
                  borderColor: 'var(--border)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
