/**
 * Root Open Graph card.
 *
 * 1200x630 navy panel with the NERV-OS wordmark in cyan, a red NERV dot
 * top-left, and a hairline cyan grid. Uses system fonts to stay edge-fast
 * — custom fonts are not loaded here (per spec).
 */

import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/seo';

export const runtime = 'edge';
export const alt = `${SITE.name} — personal site`;
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

const COLORS = {
  bg: '#060814',
  panel: '#0B0F1C',
  cyan: '#00CFFF',
  red: '#E5252A',
  bone: '#EDEDED',
  boneDim: '#8B93A6',
};

const GRID_STEP = 60;

export default function Image() {
  // Build a simple cyan grid with absolutely-positioned hairlines.
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
          background: 'rgba(0,207,255,0.06)',
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
          background: 'rgba(0,207,255,0.06)',
        }}
      />,
    );
  }

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
        }}
      >
        {lines}

        {/* Top-left NERV mark */}
        <div
          style={{
            position: 'absolute',
            top: 48,
            left: 48,
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
        </div>

        {/* Top-right status */}
        <div
          style={{
            position: 'absolute',
            top: 52,
            right: 56,
            display: 'flex',
            color: COLORS.cyan,
            fontSize: 18,
            letterSpacing: 4,
          }}
        >
          SYSTEM STATUS: NORMAL
        </div>

        {/* Center title */}
        <div
          style={{
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 168,
              color: COLORS.cyan,
              letterSpacing: 18,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            JASON-OS
          </div>
          <div
            style={{
              fontSize: 28,
              color: COLORS.bone,
              letterSpacing: 8,
            }}
          >
            JASON YI — projects, logs, signals
          </div>
        </div>

        {/* Bottom-left build tag */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: 48,
            color: COLORS.red,
            fontSize: 16,
            letterSpacing: 4,
            display: 'flex',
          }}
        >
          JASON-OS V3.0
        </div>

        {/* Bottom-right host */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            right: 56,
            color: COLORS.boneDim,
            fontSize: 16,
            letterSpacing: 4,
            display: 'flex',
          }}
        >
          {SITE.url.replace(/^https?:\/\//, '')}
        </div>
      </div>
    ),
    { ...size },
  );
}
