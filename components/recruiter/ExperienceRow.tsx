'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { Experience } from 'contentlayer/generated';
import { useNavAnchors } from '@/components/shell/NavAnchorContext';

interface Props {
  experience: Experience;
}

function formatTerm(start: string, end?: string): string {
  const fmt = (s: string) => {
    const [y, m] = s.split('-');
    if (!m) return y;
    const monthIdx = Math.max(0, Math.min(11, parseInt(m, 10) - 1));
    const month = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ][monthIdx];
    return `${month} ${y}`;
  };
  return `${fmt(start)} → ${end ? fmt(end) : 'present'}`;
}

export default function ExperienceRow({ experience }: Props) {
  const { register, setOriginKey } = useNavAnchors();
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const key = `card:${experience.slug}`;

  useEffect(() => {
    const sync = () => {
      const el = linkRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      register(key, {
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
        w: r.width,
        h: r.height,
      });
    };
    sync();
    window.addEventListener('resize', sync);
    window.addEventListener('scroll', sync, { passive: true });
    return () => {
      window.removeEventListener('resize', sync);
      window.removeEventListener('scroll', sync);
    };
  }, [register, key]);

  return (
    <li
      className="border-t"
      style={{ borderColor: 'var(--border)' }}
    >
      <Link
        ref={(el: HTMLAnchorElement | null) => { linkRef.current = el; }}
        href={`/experience/${experience.slug}`}
        onClick={() => setOriginKey(key)}
        className="grid gap-2 py-5 sm:grid-cols-[180px_1fr] sm:gap-6 hover:opacity-80 transition-opacity"
      >
      <div className="flex flex-col gap-1">
        <h3
          className="text-[18px] leading-tight font-semibold tracking-tight"
          style={{
            fontFamily: 'var(--font-display)',
            background:
              'linear-gradient(180deg, var(--text) 0%, color-mix(in oklab, var(--text) 75%, var(--accent)) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}
        >
          {experience.company}
        </h3>
        <span
          className="text-[10px] tracking-wide"
          style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
        >
          {formatTerm(experience.start, experience.end)}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <p
          className="text-[13px]"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}
        >
          {experience.role}
        </p>
        {experience.summary ? (
          <p
            className="text-[13.5px] leading-[1.6]"
            style={{ color: 'var(--text-dim)' }}
          >
            {experience.summary}
          </p>
        ) : null}
      </div>
      </Link>
    </li>
  );
}
