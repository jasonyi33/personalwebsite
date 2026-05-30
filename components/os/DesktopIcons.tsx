'use client';

/**
 * Left-edge column of desktop icons. Double-click (or Enter on a focused
 * icon) opens the app. Single-click toggles a subtle selection rect, mirroring
 * a real desktop OS. Hidden below 768px (mobile uses MobileLayout).
 */

import { useState } from 'react';
import { useOsStore } from '@/lib/os-store';
import { APPS, type AppId } from '@/lib/apps';
import AppIcon from './AppIcon';

export default function DesktopIcons() {
  const openApp = useOsStore((s) => s.openApp);
  const [selected, setSelected] = useState<AppId | null>(null);

  return (
    <div className="fixed left-4 top-12 z-10 hidden flex-col gap-3 md:flex">
      {APPS.map((def) => {
        const isSelected = selected === def.id;
        return (
          <button
            key={def.id}
            type="button"
            onClick={() => setSelected(def.id)}
            onDoubleClick={() => openApp(def.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openApp(def.id);
              }
            }}
            className="group flex w-[68px] flex-col items-center gap-1.5 rounded-lg p-2 outline-none transition-colors"
            style={{
              background: isSelected ? 'var(--accent-2)' : 'transparent',
              border: `1px solid ${isSelected ? 'var(--border-2)' : 'transparent'}`,
            }}
            aria-label={`Open ${def.title}`}
          >
            <span
              className="grid h-10 w-10 place-items-center rounded-lg transition-colors group-hover:bg-[var(--surface)]"
              style={{ color: 'var(--text)' }}
            >
              <AppIcon kind={def.icon} size={22} title={def.title} />
            </span>
            <span
              className="text-center text-[10px] tracking-wide"
              style={{
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {def.dockLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
