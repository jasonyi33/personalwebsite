'use client';

import Link from 'next/link';
import { useEffect, useRef, type PointerEvent } from 'react';
import type { Project } from 'contentlayer/generated';
import { useNavAnchors } from '@/components/shell/NavAnchorContext';

interface Props {
  project: Project;
}

const MAX_TILT = 10;
const CHIP_LIFT_PX = 30;

export default function TiltedProjectCard({ project }: Props) {
  const { register, setOriginKey } = useNavAnchors();
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const anchorKey = `card:${project.slug}`;

  useEffect(() => {
    const sync = () => {
      const el = linkRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      register(anchorKey, {
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
  }, [register, anchorKey]);

  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const el = cardRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotY = (x - 0.5) * 2 * MAX_TILT;
    const rotX = (0.5 - y) * 2 * MAX_TILT;
    inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  };

  const onPointerLeave = () => {
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  return (
    <Link
      ref={(el: HTMLAnchorElement | null) => { linkRef.current = el; }}
      href={`/projects/${project.slug}`}
      onClick={() => setOriginKey(anchorKey)}
      className="block"
    >
    <div
      ref={cardRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="group relative"
      style={{ perspective: '900px' }}
    >
      <div
        ref={innerRef}
        className="relative flex h-full flex-col gap-3 rounded-2xl border p-5 transition-transform duration-200 motion-reduce:transform-none"
        style={{
          background: 'var(--surface-2)',
          borderColor: 'var(--border)',
          transformStyle: 'preserve-3d',
          minHeight: 220,
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ transform: 'translateZ(8px)' }}
        >
          <span
            className="text-[10px] tracking-[0.2em] uppercase"
            style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
          >
            {project.year}
          </span>
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background:
                project.status === 'live'
                  ? '#22c55e'
                  : project.status === 'wip'
                  ? '#f59e0b'
                  : 'var(--text-faint)',
            }}
            aria-hidden
          />
        </div>

        <h3
          className="text-[20px] leading-tight font-semibold tracking-tight"
          style={{ color: 'var(--text)', transform: 'translateZ(12px)' }}
        >
          {project.title}
        </h3>

        {project.outcomeChip ? (
          <span
            className="self-start rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide"
            style={{
              color: 'var(--text)',
              borderColor: 'color-mix(in oklab, var(--accent) 45%, var(--border-2))',
              background:
                'color-mix(in oklab, var(--accent) 14%, var(--surface-2))',
              fontFamily: 'var(--font-mono)',
              transform: `translateZ(${CHIP_LIFT_PX}px)`,
              boxShadow:
                '0 6px 18px color-mix(in oklab, var(--accent) 25%, transparent)',
            }}
          >
            {project.outcomeChip}
          </span>
        ) : null}

        <p
          className="text-[13px] leading-[1.55]"
          style={{ color: 'var(--text-dim)', transform: 'translateZ(6px)' }}
        >
          {project.tagline}
        </p>

        {project.tags && project.tags.length > 0 ? (
          <p
            className="mt-auto text-[10px] tracking-wide"
            style={{
              color: 'var(--text-faint)',
              fontFamily: 'var(--font-mono)',
              transform: 'translateZ(4px)',
            }}
          >
            {project.tags.slice(0, 3).join(' · ')}
          </p>
        ) : null}

        {project.video ? (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <span
            role="link"
            tabIndex={0}
            aria-label={`Watch ${project.title} demo`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(
                project.videoStart && project.videoStart > 0
                  ? `${project.video}${project.video!.includes('?') ? '&' : '?'}t=${project.videoStart}s`
                  : project.video!,
                '_blank',
                'noopener,noreferrer',
              );
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click();
            }}
            className="text-[11px] underline-offset-4 hover:underline cursor-pointer"
            style={{
              color: 'var(--accent)',
              fontFamily: 'var(--font-mono)',
              transform: 'translateZ(10px)',
            }}
          >
            demo →
          </span>
        ) : null}
      </div>
    </div>
    </Link>
  );
}
