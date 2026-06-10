/**
 * Per-project Open Graph card — modern minimal version.
 */

import { ImageResponse } from 'next/og';
import { allProjects } from 'contentlayer/generated';
import { SITE } from '@/lib/seo';
import { loadSpaceGroteskMedium } from '@/lib/og-fonts';

export const alt = `Project — ${SITE.name}`;
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

const COLORS = {
  bg: '#0a0a0b',
  text: '#ededed',
  dim: '#8b8b92',
  accent: '#7dd3fc',
};

export function generateStaticParams(): { slug: string }[] {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);
  if (!project) {
    return new ImageResponse(<div style={{ display: 'flex' }}>not found</div>, size);
  }

  const displayFont = await loadSpaceGroteskMedium();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: COLORS.bg,
          color: COLORS.text,
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: 64,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background: COLORS.accent,
            opacity: 0.12,
            filter: 'blur(120px)',
            display: 'flex',
          }}
        />

        <div
          style={{
            display: 'flex',
            gap: 16,
            color: COLORS.dim,
            fontSize: 22,
            letterSpacing: 1,
          }}
        >
          <span style={{ display: 'flex' }}>{SITE.url.replace(/^https?:\/\//, '')}</span>
          <span style={{ display: 'flex' }}>·</span>
          <span style={{ display: 'flex' }}>projects</span>
        </div>

        <div
          style={{
            marginTop: 72,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            maxWidth: 1020,
          }}
        >
          <div
            style={{
              fontSize: 96,
              color: COLORS.text,
              letterSpacing: -3.5,
              fontWeight: 500,
              lineHeight: 1.05,
              display: 'flex',
              fontFamily: 'Space Grotesk',
            }}
          >
            {project.title}
          </div>
          <div
            style={{
              fontSize: 30,
              color: COLORS.dim,
              lineHeight: 1.3,
              display: 'flex',
            }}
          >
            {project.tagline}
          </div>
          {project.outcomeChip ? (
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                marginTop: 8,
                padding: '8px 16px',
                borderRadius: 999,
                border: `1px solid ${COLORS.accent}`,
                color: COLORS.accent,
                fontSize: 22,
                letterSpacing: 0.5,
              }}
            >
              {project.outcomeChip}
            </div>
          ) : null}
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            color: COLORS.dim,
            fontSize: 22,
            letterSpacing: 1,
          }}
        >
          <span style={{ display: 'flex' }}>
            jason yi · {project.year}
          </span>
          <span style={{ display: 'flex', color: COLORS.accent }}>—</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Space Grotesk',
          data: displayFont,
          style: 'normal',
          weight: 500,
        },
      ],
    },
  );
}
