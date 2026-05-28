'use client';

/**
 * BlogFileTree — sidebar that renders posts grouped by year as a
 * collapsible "filesystem" tree:
 *
 *   ▸ 2026/
 *     └─ post-title.mdx
 *     └─ another-post.mdx
 *   ▸ 2025/
 *     └─ older-post.mdx
 *
 * Years are expanded by default. Click a year to toggle. Click a post to
 * select it.
 */

import { useMemo, useState } from 'react';
import type { Post } from 'contentlayer/generated';

interface Props {
  posts: readonly Post[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
}

export default function BlogFileTree({ posts, selectedSlug, onSelect }: Props) {
  const byYear = useMemo(() => {
    const map = new Map<number, Post[]>();
    for (const p of posts) {
      const y = p.year;
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(p);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [posts]);

  // Default: every year expanded.
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const toggle = (year: number) =>
    setCollapsed((c) => ({ ...c, [year]: !c[year] }));

  return (
    <div className="flex flex-col py-1 font-[family-name:var(--font-mono)] text-[12px]">
      {byYear.map(([year, yearPosts]) => {
        const isCollapsed = !!collapsed[year];
        return (
          <div key={year} className="mb-1">
            <button
              type="button"
              onClick={() => toggle(year)}
              className="flex w-full items-center gap-1 px-3 py-1 text-left transition-colors hover:brightness-125"
              style={{ color: 'var(--nerv-cyan-dim)' }}
            >
              <span className="inline-block w-3 text-center">
                {isCollapsed ? '▸' : '▾'}
              </span>
              <span>{year}/</span>
            </button>
            {!isCollapsed ? (
              <ul className="ml-3">
                {yearPosts.map((p) => {
                  const selected = p.slug === selectedSlug;
                  return (
                    <li key={p.slug}>
                      <button
                        type="button"
                        onClick={() => onSelect(p.slug)}
                        className="block w-full truncate px-3 py-1 text-left transition-colors hover:brightness-125"
                        style={{
                          color: selected
                            ? 'var(--nerv-cyan)'
                            : 'var(--nerv-bone-dim)',
                        }}
                      >
                        └─ {p.slug}.mdx
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
