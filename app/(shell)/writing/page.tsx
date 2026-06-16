import type { Metadata } from 'next';
import Link from 'next/link';
import { sortedPosts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes by Jason Yi.',
};

function formatDate(iso: string | Date): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function WritingPage() {
  const posts = sortedPosts();

  return (
    <section className="mx-auto w-full max-w-[760px] px-6 pt-12 pb-24">
      <h1
        className="mb-6 text-[11px] tracking-[0.22em] uppercase"
        style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
      >
        Writing
      </h1>

      {posts.length === 0 ? (
        <p style={{ color: 'var(--text-dim)' }}>Nothing here yet.</p>
      ) : (
        <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/writing/${p.slug}`}
                className="grid grid-cols-[1fr_auto] items-baseline gap-6 py-5 transition-colors"
                style={{ color: 'var(--text)' }}
              >
                <div>
                  <h2
                    className="text-[18px] font-semibold tracking-tight"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {p.title}
                  </h2>
                  <p className="mt-1 text-[14px]" style={{ color: 'var(--text-dim)' }}>
                    {p.excerpt}
                  </p>
                </div>
                <span
                  className="text-[11px] whitespace-nowrap"
                  style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
                >
                  {formatDate(p.date)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
