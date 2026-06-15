import { ImageResponse } from 'next/og';
import { getAbout } from '@/lib/content';
import { loadSpaceGroteskMedium } from '@/lib/og-fonts';

export const runtime = 'edge';
export const alt = 'Jason Yi — recruiter view';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

const COLORS = {
  bg: '#0a0a0b',
  text: '#ededed',
  dim: '#8b8b92',
  faint: '#5a5a60',
  accent: '#7dd3fc',
};

export default async function Image() {
  const displayFont = await loadSpaceGroteskMedium();
  const about = getAbout();
  const chips = (about.chips ?? []).slice(0, 4);

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
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background: COLORS.accent,
            opacity: 0.14,
            filter: 'blur(140px)',
            display: 'flex',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 56,
            left: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: COLORS.dim,
            fontSize: 20,
            letterSpacing: 2,
          }}
        >
          <span
            style={{
              display: 'flex',
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: '#22c55e',
              boxShadow: '0 0 12px #22c55e',
            }}
          />
          RECRUITER VIEW
        </div>

        <div
          style={{
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0 64px',
            gap: 18,
          }}
        >
          <div
            style={{
              fontSize: 128,
              color: COLORS.text,
              letterSpacing: -4,
              fontWeight: 500,
              lineHeight: 1,
              fontFamily: 'Space Grotesk',
            }}
          >
            {about.name}
          </div>
          <div
            style={{
              fontSize: 34,
              color: COLORS.text,
              fontWeight: 500,
              maxWidth: 1000,
            }}
          >
            {about.eyebrow ?? 'AI Product Engineer · Berkeley EECS'}
          </div>
          <div
            style={{
              fontSize: 24,
              color: COLORS.dim,
              maxWidth: 1000,
              lineHeight: 1.35,
            }}
          >
            {about.headline ?? 'I ship AI products end-to-end.'}
          </div>

          {chips.length > 0 ? (
            <div
              style={{
                marginTop: 18,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              {chips.map((c) => (
                <span
                  key={c}
                  style={{
                    display: 'flex',
                    color: COLORS.text,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    padding: '8px 14px',
                    borderRadius: 9999,
                    fontSize: 18,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 52,
            left: 64,
            right: 64,
            display: 'flex',
            justifyContent: 'space-between',
            color: COLORS.faint,
            fontSize: 20,
            letterSpacing: 1,
          }}
        >
          <span style={{ display: 'flex' }}>
            {about.gradTerm ? `graduating ${about.gradTerm}` : ''}
            {about.openTo ? `  ·  open to ${about.openTo}` : ''}
          </span>
          <span style={{ display: 'flex', color: COLORS.accent }}>
            jasonyi.live/recruiter
          </span>
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
