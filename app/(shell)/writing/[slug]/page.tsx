import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sortedPosts } from '@/lib/content';
import MdxPost from './MdxPost';

export async function generateStaticParams() {
  return sortedPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = sortedPosts().find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = sortedPosts().find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="mx-auto w-full max-w-[760px] px-6 pt-12 pb-24">
      <Link
        href="/writing"
        className="text-[11px] tracking-[0.22em] uppercase"
        style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
      >
        ← Writing
      </Link>

      <h1
        className="mt-6 text-[36px] leading-tight font-semibold tracking-tight"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
      >
        {post.title}
      </h1>

      <p
        className="mt-2 text-[13px]"
        style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
      >
        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>

      <MdxPost code={post.body.code} />
    </article>
  );
}
