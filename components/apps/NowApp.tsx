'use client';

/**
 * NOW.feed — the Now window (spec 5.4).
 *
 * Mostly static MDX with two live widgets stacked above it. Fetches
 * /api/now on mount to grab the latest GitHub commit (ISR cached for an
 * hour upstream); when the githubUser is a bracket placeholder the route
 * returns `{ commit: null }` and the LAST COMMIT section is omitted.
 */

import { useEffect, useMemo, useState } from 'react';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { getNow } from '@/lib/content';
import type { LatestCommit } from '@/lib/github';

// TODO(phase-6b): swap for the real MDXComponents map once
// `@/components/mdx/MDXComponents` lands. Until then default tags are fine
// for the placeholder copy.
type MDXComponentMap = Record<string, React.ComponentType<unknown>>;
const MDXComponents: MDXComponentMap = {};

interface NowApiResponse {
  commit: LatestCommit | null;
}

function SectionHeader({ label }: { label: string }) {
  return (
    <h2
      className="mt-5 mb-2 text-[12px] tracking-[0.18em] uppercase"
      style={{
        color: 'var(--nerv-cyan)',
        fontFamily: 'var(--font-display), var(--font-mono), monospace',
      }}
    >
      &gt; {label}
    </h2>
  );
}

function DataRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 text-[13px] leading-[1.6]">
      <span style={{ color: 'var(--nerv-cyan-dim)' }}>{label}</span>
      <span style={{ color: 'var(--nerv-bone)' }}>{children}</span>
    </div>
  );
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diffSec = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

function truncate(input: string, max: number): string {
  return input.length > max ? `${input.slice(0, max)}…` : input;
}

function formatUpdated(value: string): string {
  // `value` arrives as an ISO timestamp from contentlayer's date field.
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toISOString().slice(0, 10);
  } catch {
    return value;
  }
}

export default function NowApp() {
  const now = getNow();
  const Body = useMDXComponent(now.body.code);

  const [commit, setCommit] = useState<LatestCommit | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/now')
      .then((r) => (r.ok ? r.json() : { commit: null }))
      .then((data: NowApiResponse) => {
        if (cancelled) return;
        setCommit(data.commit);
      })
      .catch(() => {
        if (cancelled) return;
        setCommit(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => {
    const out: Array<{ label: string; value: string }> = [];
    if (now.focus) out.push({ label: 'FOCUS:    ', value: now.focus });
    if (now.location) out.push({ label: 'LOCATION: ', value: now.location });
    if (now.reading) out.push({ label: 'READING:  ', value: now.reading });
    if (now.listening)
      out.push({ label: 'LISTENING:', value: now.listening });
    if (now.learning) out.push({ label: 'LEARNING: ', value: now.learning });
    return out;
  }, [now.focus, now.location, now.reading, now.listening, now.learning]);

  return (
    <div
      className="h-full w-full overflow-y-auto px-6 py-5"
      style={{ fontFamily: 'var(--font-mono), monospace' }}
    >
      <SectionHeader label="CURRENT STATUS" />
      <div className="space-y-1">
        {rows.map((r) => (
          <DataRow key={r.label} label={r.label}>
            {r.value}
          </DataRow>
        ))}
      </div>

      {loaded && commit ? (
        <>
          <SectionHeader label="LAST COMMIT" />
          <div className="space-y-1">
            <DataRow label="REPO:    ">{commit.repo}</DataRow>
            <DataRow label="SHA:     ">
              <a
                href={commit.url}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:underline"
                style={{ color: 'var(--nerv-cyan)' }}
              >
                {commit.sha.slice(0, 7)}
              </a>
            </DataRow>
            <DataRow label="MESSAGE: ">{truncate(commit.message, 80)}</DataRow>
            <DataRow label="WHEN:    ">{relativeTime(commit.date)}</DataRow>
          </div>
        </>
      ) : null}

      <SectionHeader label="NOTES" />
      <div
        className="text-[13px] leading-[1.7] space-y-3"
        style={{ color: 'var(--nerv-bone)' }}
      >
        <Body components={MDXComponents} />
      </div>

      <p
        className="mt-6 text-[11px]"
        style={{ color: 'var(--nerv-cyan-dim)' }}
      >
        LAST UPDATED: {formatUpdated(now.updated)}
      </p>
    </div>
  );
}
