'use client';

/**
 * BlogApp (LOGS) — two-pane terminal-styled blog reader (spec 5.2).
 *
 * Left:  file-tree of posts grouped by year (BlogFileTree).
 * Right: BlogReader rendering the selected post.
 *
 * Mobile (<640px): single-pane stack — tree on top until a post is chosen,
 *                  then reader with a back button.
 *
 * Deep-link: ?post=<slug> opens that post on mount (Phase 7 wires URL sync).
 */

import { useEffect, useMemo, useState } from 'react';
import { sortedPosts } from '@/lib/content';
import BlogFileTree from './blog/BlogFileTree';
import BlogReader from './blog/BlogReader';

function useIsNarrow(): boolean {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return narrow;
}

export default function BlogApp() {
  const posts = useMemo(() => sortedPosts(), []);
  const [slug, setSlug] = useState<string | null>(posts[0]?.slug ?? null);
  const [mobileShowReader, setMobileShowReader] = useState(false);
  const narrow = useIsNarrow();

  // Deep-link
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const s = params.get('post');
    if (!s) return;
    if (posts.some((p) => p.slug === s)) {
      setSlug(s);
      setMobileShowReader(true);
    }
  }, [posts]);

  if (posts.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <span
          className="font-[family-name:var(--font-mono)] text-[12px] tracking-widest"
          style={{ color: 'var(--nerv-bone-dim)' }}
        >
          &gt; NO LOGS INDEXED. AWAITING DATA.
        </span>
      </div>
    );
  }

  const post = posts.find((p) => p.slug === slug) ?? posts[0];

  const handleSelect = (s: string) => {
    setSlug(s);
    if (narrow) setMobileShowReader(true);
  };

  const showTree = !narrow || !mobileShowReader;
  const showReader = !narrow || mobileShowReader;

  return (
    <div className="flex h-full w-full">
      {showTree ? (
        <aside
          className="flex shrink-0 flex-col overflow-y-auto"
          style={{
            width: narrow ? '100%' : 240,
            borderRight: narrow ? 'none' : '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.15)',
          }}
        >
          <div
            className="px-3 py-2 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em]"
            style={{
              color: 'var(--nerv-cyan-dim)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            /logs
          </div>
          <BlogFileTree
            posts={posts}
            selectedSlug={post.slug}
            onSelect={handleSelect}
          />
        </aside>
      ) : null}

      {showReader ? (
        <div className="min-w-0 flex-1">
          {narrow ? (
            <div className="px-5 pt-3">
              <button
                type="button"
                onClick={() => setMobileShowReader(false)}
                className="font-[family-name:var(--font-mono)] text-[11px] tracking-widest"
                style={{ color: 'var(--nerv-cyan)' }}
              >
                ◂ BACK TO INDEX
              </button>
            </div>
          ) : null}
          <BlogReader key={post.slug} post={post} />
        </div>
      ) : null}
    </div>
  );
}
