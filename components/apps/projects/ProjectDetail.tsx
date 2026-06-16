'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import type { Project } from 'contentlayer/generated';
import { MDXComponents } from '@/components/mdx/MDXComponents';
import ProjectVideo from './ProjectVideo';

interface Props {
  project: Project;
  nextProject: Project | null;
  onNext: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

function prettyHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

const PLACEHOLDER_DATA_URL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="180" fill="#18181b"/>
      <text x="160" y="96" text-anchor="middle" font-family="ui-monospace,monospace"
        font-size="10" fill="#71717a">no cover</text>
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
  const coverSrc = useMemo(() => project.cover ?? PLACEHOLDER_DATA_URL, [project.cover]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-[680px] px-7 pt-6 pb-12">
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
            {project.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <span
              className="text-[11px]"
              style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
            >
              {project.year}
            </span>
            {project.statusLabel ? (
              <>
                <span style={{ color: 'var(--text-faint)' }}>·</span>
                <span
                  className="rounded-full px-2 py-[2px] text-[10px] tracking-wide"
                  style={{
                    color: 'var(--text)',
                    background: 'var(--accent-2)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {project.statusLabel}
                </span>
              </>
            ) : null}
            {project.live ? (
              <>
                <span style={{ color: 'var(--text-faint)' }}>·</span>
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] underline-offset-4 hover:underline"
                  style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                >
                  {prettyHost(project.live)} ↗
                </a>
              </>
            ) : null}
          </div>
          {project.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
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
        </header>

        {project.video ? (
          <ProjectVideo
            src={project.video}
            poster={project.videoPoster ?? project.cover}
            startSeconds={project.videoStart ?? 0}
            title={project.title}
          />
        ) : (
          <div
            className="relative mb-6 w-full overflow-hidden rounded-lg"
            style={{
              aspectRatio: '16 / 9',
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid var(--border)',
            }}
          >
            <Image
              src={coverSrc}
              alt={`${project.title} cover`}
              fill
              sizes="(max-width: 680px) 100vw, 680px"
              className="object-cover"
              unoptimized={coverSrc.startsWith('data:')}
            />
          </div>
        )}

        <article
          className="text-[13.5px] leading-[1.75]"
          style={{ color: 'var(--text-dim)' }}
        >
          <MDXContent components={MDXComponents} />
        </article>

        {(project.live || project.repo) && (
          <div className="mt-7 flex flex-wrap gap-5 text-[12.5px]">
            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                Live ↗
              </a>
            ) : null}
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                GitHub ↗
              </a>
            ) : null}
          </div>
        )}

        {nextProject ? (
          <div
            className="mt-10 border-t pt-5"
            style={{ borderColor: 'var(--border)' }}
          >
            <button
              type="button"
              onClick={onNext}
              className="text-[12.5px] underline-offset-4 hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              next → {nextProject.title}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
