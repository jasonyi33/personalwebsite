'use client';

/**
 * NervLogo — the red NERV half-fig-leaf silhouette plus a small
 * scratched-style "NERV" wordmark underneath. Used in the boot sequence
 * and anywhere a standalone NERV mark is needed (i.e. not the smaller
 * AppIcon `terminal` glyph which is shape-only).
 *
 * The wordmark uses Orbitron italic with a half-opacity red strike
 * line to approximate the scratched/hand-drawn feel of the reference.
 */

interface Props {
  size?: number;
  className?: string;
  title?: string;
}

export default function NervLogo({ size = 96, className, title = 'NERV' }: Props) {
  // Wordmark scales with the logo: ~25% of the silhouette height.
  const wordmarkSize = Math.max(11, Math.round(size * 0.26));

  return (
    <div
      className={className}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: Math.round(size * 0.08) }}
      role="img"
      aria-label={title}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="nerv-logo-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff4448" />
            <stop offset="100%" stopColor="#9c1418" />
          </linearGradient>
        </defs>
        <path
          d="M32 6 C 18 14, 12 28, 14 44 C 16 54, 24 58, 32 58 L 32 38 C 26 34, 24 26, 28 18 C 30 14, 31 10, 32 6 Z"
          fill="url(#nerv-logo-grad)"
          stroke="#3a0608"
          strokeWidth="1"
        />
        <path
          d="M32 12 C 36 18, 36 26, 32 30 L 32 12 Z"
          fill="#ffd1d2"
          opacity="0.35"
        />
      </svg>
      <span
        className="font-[family-name:var(--font-display)]"
        style={{
          fontSize: wordmarkSize,
          fontStyle: 'italic',
          fontWeight: 700,
          letterSpacing: '-0.05em',
          color: 'var(--nerv-red)',
          textDecoration: 'line-through',
          textDecorationColor: 'rgba(229,37,42,0.5)',
          textDecorationThickness: '1px',
          lineHeight: 1,
          textShadow: '0 0 8px rgba(229,37,42,0.25)',
        }}
      >
        NERV
      </span>
    </div>
  );
}
