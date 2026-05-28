'use client';

/**
 * Desktop icons column along the left edge of the viewport.
 *
 * Phase 2 launches three: NERV (terminal), Projects, System (about).
 * Clicking calls `openApp` from the store; the icon shows a faint cyan
 * outline while selected (single-click), and double-click also opens (so
 * mouse + touch both feel native).
 */

import { useState } from 'react';
import { useOsStore } from '@/lib/os-store';
import { APP_MAP, type AppId } from '@/lib/apps';
import AppIcon from './AppIcon';

interface DesktopIconDef {
  appId: AppId;
  label: string;
}

const DESKTOP_ICONS: DesktopIconDef[] = [
  { appId: 'terminal', label: 'NERV' },
  { appId: 'projects', label: 'Projects' },
  { appId: 'about', label: 'System' },
];

export default function DesktopIcons() {
  const openApp = useOsStore((s) => s.openApp);
  const [selected, setSelected] = useState<AppId | null>(null);

  return (
    <div className="fixed left-3 top-12 z-10 flex flex-col gap-5 md:left-4 md:top-14">
      {DESKTOP_ICONS.map(({ appId, label }) => {
        const def = APP_MAP[appId];
        const isSelected = selected === appId;
        return (
          <button
            key={appId}
            type="button"
            onClick={() => setSelected(appId)}
            onDoubleClick={() => openApp(appId)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openApp(appId);
              }
            }}
            className="group flex w-[72px] flex-col items-center gap-1 rounded-md p-2 outline-none transition-colors"
            style={{
              background: isSelected ? 'rgba(0, 207, 255, 0.08)' : 'transparent',
              border: `1px solid ${isSelected ? 'rgba(0, 207, 255, 0.45)' : 'transparent'}`,
            }}
            aria-label={`Open ${def.title}`}
          >
            <AppIcon kind={def.icon} size={44} title={def.title} />
            <span
              className="text-center font-[family-name:var(--font-mono)] text-[11px] leading-tight tracking-wide"
              style={{
                color: 'var(--nerv-bone)',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)',
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
