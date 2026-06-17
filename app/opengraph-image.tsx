/**
 * Root Open Graph card — modern, minimal. 1200x630.
 */

import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/seo';
import { loadSpaceGroteskMedium } from '@/lib/og-fonts';

export const runtime = 'edge';
export const alt = 'Jason Yi · AI Product Engineer';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

const COLORS = {
  bg: '#0a0a0b',
  text: '#ededed',
  dim: '#8b8b92',
  accent: '#7dd3fc',
};

export default async function Image() {
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
        }}
      >
        {/* Soft accent blob */}
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

        {/* Top label */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 64,
            color: COLORS.dim,
            fontSize: 22,
            letterSpacing: 1,
            display: 'flex',
          }}
        >
          {SITE.url.replace(/^https?:\/\//, '')}
        </div>

        {/* Center */}
        <div
          style={{
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0 64px',
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 140,
              color: COLORS.text,
              letterSpacing: -5,
              fontWeight: 500,
              lineHeight: 1,
              fontFamily: 'Space Grotesk',
            }}
          >
            Jason Yi
          </div>
          <div
            style={{
              fontSize: 36,
              color: COLORS.text,
              letterSpacing: 0,
              maxWidth: 950,
              fontWeight: 500,
            }}
          >
            Building agents for real businesses.
          </div>
          <div
            style={{
              fontSize: 26,
              color: COLORS.dim,
              letterSpacing: 0,
              maxWidth: 950,
              marginTop: 8,
            }}
          >
            Founder @ VoiceReach (backed by OpenAI) · Prev TikTok, Adobe, Google · Berkeley EECS
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            position: 'absolute',
            bottom: 56,
            left: 64,
            right: 64,
            display: 'flex',
            justifyContent: 'space-between',
            color: COLORS.dim,
            fontSize: 22,
            letterSpacing: 1,
          }}
        >
          <span style={{ display: 'flex' }}>about · experience · projects · interests</span>
          <span style={{ display: 'flex', color: COLORS.accent }}>|</span>
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
