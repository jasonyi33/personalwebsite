/**
 * Per-project Open Graph card. Same chrome as the root card with the
 * project title, tagline, and a year + status pill bottom-right.
 */

import { ImageResponse } from 'next/og';
import { allProjects } from 'contentlayer/generated';
import { SITE } from '@/lib/seo';

export const alt = `Project — ${SITE.name}`;
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

const COLORS = {
  bg: '#060814',
  cyan: '#00CFFF',
  red: '#E5252A',
  bone: '#EDEDED',
  boneDim: '#8B93A6',
  green: '#4CFFAF',
  amber: '#F7C948',
  gridLine: 'rgba(0,207,255,0.06)',
};

const GRID_STEP = 60;

const STATUS_COLOR: Record<string, string> = {
  live: COLORS.green,
  wip: COLORS.amber,
  archived: COLORS.red,
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

  const statusColor = STATUS_COLOR[project.status] ?? COLORS.bone;

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

        {/* Top-left NERV mark */}
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
            PROJECTS / {project.slug.toUpperCase()}
          </span>
        </div>

        {/* Title block */}
        <div
          style={{
            marginTop: 80,
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
            maxWidth: 1020,
          }}
        >
          <div
            style={{
              fontSize: 96,
              color: COLORS.cyan,
              letterSpacing: 6,
              fontWeight: 800,
              lineHeight: 1.05,
              display: 'flex',
            }}
          >
            {project.title}
          </div>
          <div
            style={{
              fontSize: 30,
              color: COLORS.bone,
              letterSpacing: 2,
              lineHeight: 1.3,
              display: 'flex',
            }}
          >
            {project.tagline}
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
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                color: COLORS.boneDim,
                fontSize: 18,
                letterSpacing: 4,
                display: 'flex',
              }}
            >
              {project.year}
            </div>
            <div
              style={{
                padding: '8px 14px',
                borderRadius: 9999,
                border: `1px solid ${statusColor}`,
                color: statusColor,
                fontSize: 16,
                letterSpacing: 4,
                textTransform: 'uppercase',
                display: 'flex',
              }}
            >
              {project.status}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
