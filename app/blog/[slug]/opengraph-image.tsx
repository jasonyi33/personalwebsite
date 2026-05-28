/**
 * Per-post Open Graph card for the LOGS app.
 */

import { ImageResponse } from 'next/og';
import { allPosts } from 'contentlayer/generated';
import { SITE } from '@/lib/seo';

export const alt = `Post — ${SITE.name}`;
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

const COLORS = {
  bg: '#060814',
  cyan: '#00CFFF',
  red: '#E5252A',
  bone: '#EDEDED',
  boneDim: '#8B93A6',
  amber: '#F7C948',
  gridLine: 'rgba(0,207,255,0.06)',
};

const GRID_STEP = 60;

export function generateStaticParams(): { slug: string }[] {
  return allPosts.filter((p) => !p.draft).map((p) => ({ slug: p.slug }));
}

function formatDate(d: string): string {
  try {
    const date = new Date(d);
    return date.toISOString().slice(0, 10);
  } catch {
    return d;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) {
    return new ImageResponse(<div style={{ display: 'flex' }}>not found</div>, size);
  }

  const lines: React.ReactNode[] = [];
  for (let x = GRID_STEP; x < size.width; x += GRID_STEP) {
    lines.push(
      <div
        key={`v${x}`}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: x,
          width: 1,
          background: COLORS.gridLine,
        }}
      />,
    );
  }
  for (let y = GRID_STEP; y < size.height; y += GRID_STEP) {
    lines.push(
      <div
        key={`h${y}`}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: y,
          height: 1,
          background: COLORS.gridLine,
        }}
      />,
    );
  }

  const readingMinutes = Math.max(
    1,
    Math.round((post.readingTime?.minutes as number | undefined) ?? 1),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: COLORS.bg,
          color: COLORS.bone,
          position: 'relative',
          fontFamily: 'monospace',
          padding: 64,
        }}
      >
        {lines}

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: COLORS.red,
            }}
          />
          <span
            style={{
              color: COLORS.red,
              fontSize: 22,
              letterSpacing: 6,
              fontWeight: 700,
            }}
          >
            NERV
          </span>
          <span
            style={{
              marginLeft: 24,
              color: COLORS.cyan,
              fontSize: 18,
              letterSpacing: 4,
            }}
          >
            LOGS / {formatDate(post.date)}
          </span>
        </div>

        {/* Terminal-style cat line */}
        <div
          style={{
            marginTop: 64,
            color: COLORS.amber,
            fontSize: 22,
            letterSpacing: 2,
            display: 'flex',
          }}
        >
          {`> cat ${post.year}/${post.slug}.mdx`}
        </div>

        {/* Title + excerpt */}
        <div
          style={{
            marginTop: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            maxWidth: 1020,
          }}
        >
          <div
            style={{
              fontSize: 84,
              color: COLORS.cyan,
              letterSpacing: 4,
              fontWeight: 800,
              lineHeight: 1.05,
              display: 'flex',
            }}
          >
            {post.title}
          </div>
          <div
            style={{
              fontSize: 26,
              color: COLORS.bone,
              letterSpacing: 2,
              lineHeight: 1.35,
              display: 'flex',
            }}
          >
            {post.excerpt}
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              color: COLORS.red,
              fontSize: 16,
              letterSpacing: 4,
              display: 'flex',
            }}
          >
            JASON-OS V3.0
          </div>
          <div
            style={{
              color: COLORS.boneDim,
              fontSize: 18,
              letterSpacing: 4,
              display: 'flex',
            }}
          >
            {formatDate(post.date)} · {readingMinutes} MIN READ
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
