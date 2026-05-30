'use client';

/**
 * FeedApp — merged Now + Logs surface.
 *
 * Top: a small "now" card derived from content/now.mdx (only renders rows
 * that have content) + a live last-commit row pulled from /api/now.
 *
 * Below: reverse-chronological list of log titles. Click a title to expand
 * the post body inline; click again to collapse. URL hash sync (#slug)
 * supports deep-linking from elsewhere on the site.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import type { Post } from 'contentlayer/generated';
import { getNow, sortedPosts } from '@/lib/content';
import { MDXComponents } from '@/components/mdx/MDXComponents';
import type { NowApiResponse } from '@/app/api/now/route';

function fmtDate(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function FeedApp() {
  const now = getNow();
  const posts = useMemo(() => sortedPosts(), []);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [commit, setCommit] = useState<NowApiResponse['commit'] | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace('#', '');
    if (hash && posts.some((p) => p.slug === hash)) {
      setOpenSlug(hash);
    }
  }, [posts]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/now', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as NowApiResponse;
        if (!cancelled) setCommit(data.commit);
      } catch {
        /* offline / blocked — ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = useCallback(
    (slug: string) => {
      setOpenSlug((cur) => (cur === slug ? null : slug));
      if (typeof window !== 'undefined') {
        const next = openSlug === slug ? '' : `#${slug}`;
        try {
          window.history.replaceState(null, '', window.location.pathname + window.location.search + next);
        } catch {
          /* ignore */
        }
      }
    },
    [openSlug],
  );

  const nowRows: { label: string; value: React.ReactNode }[] = [];
  if (now.focus) nowRows.push({ label: 'focus', value: now.focus });
  if (now.location) nowRows.push({ label: 'location', value: now.location });
  if (now.reading) nowRows.push({ label: 'reading', value: now.reading });
  if (now.listening) nowRows.push({ label: 'listening', value: now.listening });
  if (now.learning) nowRows.push({ label: 'learning', value: now.learning });
  if (commit) {
    nowRows.push({
      label: 'last commit',
      value: (
        <a
          href={commit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline"
          style={{ color: 'var(--accent)' }}
        >
          {commit.message.length > 64 ? commit.message.slice(0, 64) + '…' : commit.message}{' '}
          <span style={{ color: 'var(--text-faint)' }}>· {relativeTime(commit.date)}</span>
        </a>
      ),
    });
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="mx-auto max-w-[640px] px-7 pt-6 pb-12">
        {/* Now card */}
        <section
          className="rounded-xl border p-5"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--surface-2)',
          }}
        >
          <div
            className="mb-3 flex items-center justify-between text-[11px]"
            style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
          >
            <span>now</span>
            <span>updated {fmtDate(now.updated as unknown as string)}</span>
          </div>
          {nowRows.length === 0 ? (
            <p
              className="text-[13px]"
              style={{ color: 'var(--text-dim)' }}
            >
              Stay tuned.
            </p>
          ) : (
            <ul className="space-y-1.5 text-[13px]">
              {nowRows.map((row) => (
                <li key={row.label} className="flex gap-3">
                  <span
                    className="w-[88px] shrink-0"
                    style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
                  >
                    {row.label}
                  </span>
                  <span style={{ color: 'var(--text)' }}>{row.value}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Logs */}
        <section className="mt-8">
          <p
            className="mb-2 px-1 text-[11px]"
            style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
          >
            logs
          </p>
          {posts.length === 0 ? (
            <p
              className="px-1 text-[12px]"
              style={{ color: 'var(--text-dim)' }}
            >
              Nothing here yet.
            </p>
          ) : (
            <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {posts.map((post) => (
                <LogRow
                  key={post.slug}
                  post={post}
                  open={openSlug === post.slug}
                  onToggle={() => toggle(post.slug)}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

interface LogRowProps {
  post: Post;
  open: boolean;
  onToggle: () => void;
}

function LogRow({ post, open, onToggle }: LogRowProps) {
  const Body = useMDXComponent(post.body.code);
  return (
    <li className="border-b" style={{ borderColor: 'var(--border)' }} id={post.slug}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-baseline justify-between gap-4 py-3 text-left transition-colors hover:text-[var(--text)]"
        aria-expanded={open}
      >
        <span className="flex items-baseline gap-3">
          <span
            className="text-[11px]"
            style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
          >
            {fmtDate(post.date)}
          </span>
          <span
            className="text-[13px]"
            style={{ color: 'var(--text)' }}
          >
            {post.title}
          </span>
        </span>
        <span
          className="text-[11px]"
          style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
        >
          {open ? '−' : '+'}
        </span>
      </button>
      {open ? (
        <div
          className="pb-5 pl-[88px] text-[13.5px] leading-[1.75]"
          style={{ color: 'var(--text-dim)' }}
        >
          <Body components={MDXComponents} />
        </div>
      ) : null}
    </li>
  );
}
