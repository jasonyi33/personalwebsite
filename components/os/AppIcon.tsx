'use client';

/**
 * Inline SVG icon set for the 5 apps. Monochrome outlines tinted with
 * currentColor so they pick up theme tokens automatically.
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
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-label': title,
    role: title ? ('img' as const) : ('presentation' as const),
  };

  switch (kind) {
    case 'about':
      // Person silhouette.
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4.5 20c0-4 3.4-6 7.5-6s7.5 2 7.5 6" />
        </svg>
      );

    case 'experience':
      // Briefcase.
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          <path d="M3 13h18" />
        </svg>
      );

    case 'projects':
      // Stacked layers.
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3l9 5-9 5-9-5 9-5z" />
          <path d="M3 13l9 5 9-5" />
          <path d="M3 17l9 5 9-5" opacity="0.55" />
        </svg>
      );

    case 'feed':
      // Pulse line / heartbeat.
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12h4l2-5 4 10 2-5h6" />
        </svg>
      );

    case 'interests':
      // 4-tile bento grid.
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="8" height="8" rx="1.5" />
          <rect x="13" y="3" width="8" height="5" rx="1.5" />
          <rect x="13" y="10" width="8" height="11" rx="1.5" />
          <rect x="3" y="13" width="8" height="8" rx="1.5" />
        </svg>
      );

    default:
      return null;
  }
}
