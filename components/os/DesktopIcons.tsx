'use client';

/**
 * Left-edge column of desktop icons. Single click opens the app. Hidden
 * below 768px (mobile uses MobileLayout).
 *
 * A literal Resume.pdf icon is rendered at the top of the column — it's
 * not an OS "app", just a deep-link to the /resume route.
 */

import { useOsStore } from '@/lib/os-store';
import { APPS } from '@/lib/apps';
import AppIcon from './AppIcon';

export default function DesktopIcons() {
  const openApp = useOsStore((s) => s.openApp);

  return (
    <div className="fixed left-4 top-12 z-10 hidden flex-col gap-3 md:flex">
      <a
        href="/resume"
        className="group flex w-[68px] flex-col items-center gap-1.5 rounded-lg p-2 outline-none transition-colors hover:bg-[var(--accent-2)]"
        aria-label="Open résumé"
      >
        <span
          className="grid h-10 w-10 place-items-center rounded-lg"
          style={{ color: 'var(--text)' }}
        >
          <AppIcon kind="resume" size={22} title="Resume" />
        </span>
        <span
          className="text-center text-[10px] tracking-wide"
          style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
        >
          resume
        </span>
      </a>

      {APPS.filter((a) => !a.hidden).map((def) => (
        <button
          key={def.id}
          type="button"
          onClick={() => openApp(def.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openApp(def.id);
            }
          }}
          className="group flex w-[68px] flex-col items-center gap-1.5 rounded-lg p-2 outline-none transition-colors hover:bg-[var(--accent-2)]"
          aria-label={`Open ${def.title}`}
        >
          <span
            className="grid h-10 w-10 place-items-center rounded-lg"
            style={{ color: 'var(--text)' }}
          >
            <AppIcon kind={def.icon} size={22} title={def.title} />
          </span>
          <span
            className="text-center text-[10px] tracking-wide"
            style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
          >
            {def.dockLabel}
          </span>
        </button>
      ))}
    </div>
  );
}
