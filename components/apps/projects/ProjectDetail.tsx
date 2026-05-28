'use client';

/**
 * ProjectDetail — right pane of the Projects app.
 *
 * Renders the selected project's header (title, year, tags), cover image
 * (16:9, blur placeholder, SVG fallback when no cover), MDX body with the
 * cascading H1–H5 typography from MDXComponents, and a bottom row with
 * Live / Repo external links plus a "Next project ▸" cycler.
 */

import Image from 'next/image';
import { useMemo } from 'react';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import type { Project } from 'contentlayer/generated';
import { MDXComponents } from '@/components/mdx/MDXComponents';

interface Props {
  project: Project;
  nextProject: Project | null;
  onNext: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

// Tiny inline placeholder for projects without a cover image. Cyan stroke on
// a deep-navy field with a hex outline — keeps the visual language without
// needing a real PNG.
const PLACEHOLDER_DATA_URL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#0B1226"/>
          <stop offset="100%" stop-color="#060814"/>
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill="url(#g)"/>
      <polygon points="160,50 200,75 200,125 160,150 120,125 120,75"
        fill="none" stroke="#00CFFF" stroke-opacity="0.4" stroke-width="1"/>
      <polygon points="160,70 185,85 185,115 160,130 135,115 135,85"
        fill="none" stroke="#00CFFF" stroke-opacity="0.18" stroke-width="1"/>
      <text x="160" y="170" text-anchor="middle"
        font-family="monospace" font-size="9" fill="#0A7EA0">NO IMAGE</text>
    </svg>`,
  );

export default function ProjectDetail({
  project,
  nextProject,
  onNext,
  onBack,
  showBack,
}: Props) {
  const MDXContent = useMDXComponent(project.body.code);
  const coverSrc = useMemo(
    () => project.cover ?? PLACEHOLDER_DATA_URL,
    [project.cover],
  );

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-[760px] px-6 pt-5 pb-12">
        {showBack && onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="mb-3 font-[family-name:var(--font-mono)] text-[11px] tracking-widest"
            style={{ color: 'var(--nerv-cyan)' }}
          >
            ◂ BACK TO LIST
          </button>
        ) : null}

        {/* Header */}
        <header className="mb-4">
          <h1
            className="font-[family-name:var(--font-display)] text-[22px] tracking-wide"
            style={{ color: 'var(--nerv-bone)' }}
          >
            {project.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className="font-[family-name:var(--font-mono)] text-[11px] tracking-widest"
              style={{ color: 'var(--nerv-bone-dim)' }}
            >
              {project.year}
            </span>
            {project.statusLabel ? (
              <>
                <span style={{ color: 'var(--nerv-bone-dim)' }}>·</span>
                <span
                  className="rounded-sm border px-1.5 py-[1px] font-[family-name:var(--font-mono)] text-[10px] tracking-widest uppercase"
                  style={{
                    color: 'var(--nerv-amber)',
                    borderColor: 'rgba(247,201,72,0.35)',
                  }}
                >
                  {project.statusLabel}
                </span>
              </>
            ) : null}
            {project.tags.length > 0 ? (
              <>
                <span style={{ color: 'var(--nerv-bone-dim)' }}>·</span>
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-sm border px-1.5 py-[1px] font-[family-name:var(--font-mono)] text-[10px] tracking-widest"
                    style={{
                      color: 'var(--nerv-cyan-dim)',
                      borderColor: 'rgba(0,207,255,0.25)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </>
            ) : null}
          </div>
        </header>

        {/* Cover — 16:9 */}
        <div
          className="relative mb-6 w-full overflow-hidden rounded"
          style={{
            aspectRatio: '16 / 9',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Image
            src={coverSrc}
            alt={`${project.title} cover`}
            fill
            sizes="(max-width: 760px) 100vw, 760px"
            className="object-cover"
            unoptimized={coverSrc.startsWith('data:')}
          />
        </div>

        {/* MDX body */}
        <article className="font-[family-name:var(--font-mono)] text-[13px]">
          <MDXContent components={MDXComponents} />
        </article>

        {/* Links */}
        {(project.live || project.repo) && (
          <div className="mt-8 flex flex-wrap gap-4 font-[family-name:var(--font-mono)] text-[12px]">
            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
                style={{ color: 'var(--nerv-cyan)' }}
              >
                Live ↗
              </a>
            ) : null}
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
                style={{ color: 'var(--nerv-cyan)' }}
              >
                GitHub ↗
              </a>
            ) : null}
          </div>
        )}

        {/* Next project */}
        {nextProject ? (
          <div
            className="mt-10 border-t pt-5"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <button
              type="button"
              onClick={onNext}
              className="font-[family-name:var(--font-mono)] text-[12px] underline-offset-2 hover:underline"
              style={{ color: 'var(--nerv-cyan)' }}
            >
              Next project ▸ {nextProject.title}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
