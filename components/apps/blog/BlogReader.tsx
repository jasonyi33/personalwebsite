'use client';

/**
 * BlogReader — the right-pane terminal-styled reader for a single Post.
 *
 *   > cat <year>/<slug>.mdx
 *   ────────────────────────────────────────
 *   Title (Orbitron 22)
 *   <date> · <readingTime> · <tags>
 *
 *   <MDX body, 680px max, line-height 1.7>
 */

import { useMemo } from 'react';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import type { Post } from 'contentlayer/generated';
import { MDXComponents } from '@/components/mdx/MDXComponents';

interface Props {
  post: Post;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function BlogReader({ post }: Props) {
  const MDXContent = useMDXComponent(post.body.code);
  const readingText = useMemo(() => {
    const rt = post.readingTime as { text?: string } | undefined;
    return rt?.text ?? '';
  }, [post.readingTime]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      {/* Terminal status line */}
      <div className="px-5 pt-3">
        <div
          className="font-[family-name:var(--font-mono)] text-[11px] tracking-widest"
          style={{ color: 'var(--nerv-cyan)' }}
        >
          &gt; cat {post.year}/{post.slug}.mdx
        </div>
        <div
          className="mt-2 h-px w-full"
          style={{ background: 'rgba(0,207,255,0.45)' }}
        />
      </div>

      {/* Body */}
      <div className="mx-auto w-full max-w-[680px] px-5 pt-5 pb-12">
        <h1
          className="font-[family-name:var(--font-display)] text-[22px] tracking-wide"
          style={{ color: 'var(--nerv-bone)' }}
        >
          {post.title}
        </h1>
        <div
          className="mt-2 flex flex-wrap items-center gap-2 font-[family-name:var(--font-mono)] text-[11px]"
          style={{ color: 'var(--nerv-bone-dim)' }}
        >
          <span>{formatDate(post.date)}</span>
          {readingText ? (
            <>
              <span>•</span>
              <span>{readingText.trim()}</span>
            </>
          ) : null}
          {post.tags.length > 0 ? (
            <>
              <span>•</span>
              <span>{post.tags.map((t) => `#${t}`).join(' ')}</span>
            </>
          ) : null}
        </div>

        <article
          className="mt-6 font-[family-name:var(--font-mono)] text-[14px]"
          style={{ lineHeight: 1.7 }}
        >
          <MDXContent components={MDXComponents} />
        </article>
      </div>
    </div>
  );
}
