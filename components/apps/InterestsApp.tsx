'use client';

/**
 * Interests — bento grid of cards driven by content/interests.mdx frontmatter.
 * Card sizes ('sm' | 'md' | 'lg' | 'wide' | 'tall') map to col/row spans on a
 * 12-col grid. Body and items are plain text; no MDX body parsing needed.
 */

import { getInterests } from '@/lib/content';

const SIZE_CLASS: Record<string, string> = {
  sm: 'col-span-6 sm:col-span-4 row-span-1',
  md: 'col-span-6 sm:col-span-6 row-span-1',
  lg: 'col-span-12 sm:col-span-8 row-span-2',
  wide: 'col-span-12 sm:col-span-8 row-span-1',
  tall: 'col-span-6 sm:col-span-4 row-span-2',
};

export default function InterestsApp() {
  const { cards } = getInterests();

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="mx-auto max-w-[820px] px-6 py-6">
        <div className="grid auto-rows-[minmax(120px,auto)] grid-cols-12 gap-3">
          {cards.map((card) => (
            <article
              key={card.id}
              className={`${SIZE_CLASS[card.size ?? 'sm'] ?? SIZE_CLASS.sm} flex flex-col rounded-xl border p-4 transition-colors hover:bg-[var(--accent-2)]`}
              style={{
                borderColor: 'var(--border)',
                background: 'var(--surface-2)',
              }}
            >
              <h3
                className="mb-1.5 text-[11px] tracking-wide"
                style={{
                  color: card.accent ?? 'var(--text-dim)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {card.title}
              </h3>
              {card.body ? (
                <p
                  className="text-[13px] leading-[1.55]"
                  style={{ color: 'var(--text)' }}
                >
                  {card.body}
                </p>
              ) : null}
              {card.items.length > 0 ? (
                <ul className="mt-auto flex flex-col gap-1 pt-2 text-[12px]">
                  {card.items.map((it, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2"
                      style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
                    >
                      <span
                        aria-hidden
                        className="inline-block h-1 w-1 rounded-full"
                        style={{ background: 'var(--accent)' }}
                      />
                      {it}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
