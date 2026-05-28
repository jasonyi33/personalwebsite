'use client';

/**
 * Inline SVG icon set for the NERV-OS apps.
 * One <AppIcon kind=... size=... /> covers desktop icons, the dock, and
 * the 12px in-title-bar glyph by varying the `size` prop.
 */

import type { AppIconKind } from '@/lib/apps';

interface Props {
  kind: AppIconKind;
  size?: number;
  className?: string;
  title?: string;
}

export default function AppIcon({ kind, size = 32, className, title }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 64 64',
    className,
    'aria-label': title,
    role: title ? ('img' as const) : ('presentation' as const),
  };

  switch (kind) {
    case 'terminal':
      // NERV half-leaf (red).
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="nerv-leaf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff4448" />
              <stop offset="100%" stopColor="#9c1418" />
            </linearGradient>
          </defs>
          <path
            d="M32 6 C 18 14, 12 28, 14 44 C 16 54, 24 58, 32 58 L 32 38 C 26 34, 24 26, 28 18 C 30 14, 31 10, 32 6 Z"
            fill="url(#nerv-leaf)"
            stroke="#3a0608"
            strokeWidth="1"
          />
          <path
            d="M32 12 C 36 18, 36 26, 32 30 L 32 12 Z"
            fill="#ffd1d2"
            opacity="0.35"
          />
        </svg>
      );

    case 'projects':
      // Pixel-art monitor with rainbow chip.
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="10" width="52" height="34" rx="2" fill="#cfd6e4" stroke="#0a0d18" strokeWidth="2" />
          <rect x="10" y="14" width="44" height="26" fill="#0b1226" />
          <rect x="12" y="16" width="6" height="6" fill="#ff5d5d" />
          <rect x="20" y="16" width="6" height="6" fill="#f7c948" />
          <rect x="28" y="16" width="6" height="6" fill="#4cffaf" />
          <rect x="36" y="16" width="6" height="6" fill="#00cfff" />
          <rect x="44" y="16" width="6" height="6" fill="#b56dff" />
          <rect x="12" y="24" width="38" height="2" fill="#00cfff" opacity="0.7" />
          <rect x="12" y="28" width="24" height="2" fill="#8b93a6" />
          <rect x="12" y="32" width="30" height="2" fill="#8b93a6" />
          <rect x="22" y="46" width="20" height="4" fill="#8b93a6" />
          <rect x="16" y="50" width="32" height="4" rx="1" fill="#cfd6e4" stroke="#0a0d18" strokeWidth="2" />
        </svg>
      );

    case 'blog':
      // Terminal cursor glyph.
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="10" width="52" height="44" rx="3" fill="#0b1226" stroke="#00cfff" strokeWidth="2" />
          <path d="M14 24 L 22 30 L 14 36" stroke="#00cfff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="26" y="34" width="14" height="3" fill="#00cfff" />
        </svg>
      );

    case 'about':
      // Iso-3D computer tower.
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <polygon points="14,18 32,10 50,18 50,52 32,60 14,52" fill="#cfd6e4" stroke="#0a0d18" strokeWidth="1.5" />
          <polygon points="14,18 32,26 50,18 32,10" fill="#e8edf4" stroke="#0a0d18" strokeWidth="1.5" />
          <polygon points="14,18 14,52 32,60 32,26" fill="#9aa3b8" stroke="#0a0d18" strokeWidth="1.5" />
          <rect x="18" y="30" width="10" height="3" fill="#00cfff" />
          <rect x="18" y="36" width="10" height="3" fill="#4cffaf" />
          <rect x="18" y="42" width="10" height="3" fill="#f7c948" />
        </svg>
      );

    case 'now':
      // Concentric pulse rings.
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="6" fill="#00cfff" />
          <circle cx="32" cy="32" r="14" fill="none" stroke="#00cfff" strokeWidth="1.5" opacity="0.7" />
          <circle cx="32" cy="32" r="22" fill="none" stroke="#00cfff" strokeWidth="1.5" opacity="0.4" />
          <circle cx="32" cy="32" r="28" fill="none" stroke="#00cfff" strokeWidth="1" opacity="0.2" />
        </svg>
      );

    case 'settings':
      // Gear glyph.
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <g fill="#cfd6e4" stroke="#0a0d18" strokeWidth="1.5">
            <path d="M32 6 l3 6 l6 -1 l1 6 l6 3 l-3 6 l3 6 l-6 3 l-1 6 l-6 -1 l-3 6 l-3 -6 l-6 1 l-1 -6 l-6 -3 l3 -6 l-3 -6 l6 -3 l1 -6 l6 1 z" />
            <circle cx="32" cy="32" r="7" fill="#0b1226" />
          </g>
          <circle cx="32" cy="32" r="3" fill="#00cfff" />
        </svg>
      );

    case 'readme':
      // Document glyph with cyan corner fold.
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <path d="M14 8 L 42 8 L 54 20 L 54 56 L 14 56 Z" fill="#ededed" stroke="#0a0d18" strokeWidth="1.5" />
          <path d="M42 8 L 42 20 L 54 20" fill="#cfd6e4" stroke="#0a0d18" strokeWidth="1.5" />
          <rect x="20" y="28" width="26" height="2" fill="#8b93a6" />
          <rect x="20" y="34" width="26" height="2" fill="#8b93a6" />
          <rect x="20" y="40" width="20" height="2" fill="#8b93a6" />
          <rect x="20" y="46" width="14" height="2" fill="#00cfff" />
        </svg>
      );

    default:
      return null;
  }
}
