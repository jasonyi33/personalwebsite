'use client';

/**
 * Bottom-center dock. 5 apps. Click toggles: open if not running, otherwise
 * focus (or minimize if already focused). Hidden below 768px — mobile gets
 * a different bottom tab bar inside MobileLayout.
 */

import { useOsStore } from '@/lib/os-store';
import { APPS, type AppId } from '@/lib/apps';
import AppIcon from './AppIcon';

export default function Dock() {
  const windows = useOsStore((s) => s.windows);
  const openApp = useOsStore((s) => s.openApp);
  const focusWindow = useOsStore((s) => s.focusWindow);
  const minimizeWindow = useOsStore((s) => s.minimizeWindow);

  function runningAppIds(): Set<AppId> {
    return new Set(windows.map((w) => w.appId));
  }

  function handleClick(appId: AppId) {
    const existing = windows.find((w) => w.appId === appId);
    if (!existing) {
      openApp(appId);
      return;
    }
    if (existing.minimized || !existing.focused) {
      focusWindow(existing.id);
    } else {
      minimizeWindow(existing.id);
    }
  }

  const running = runningAppIds();

  return (
    <div
      className="fixed bottom-3 left-1/2 z-[900] hidden -translate-x-1/2 items-end gap-1 rounded-2xl border px-2 py-1.5 md:flex"
      style={{
        background: 'var(--surface-2)',
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        borderColor: 'var(--border)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
      }}
      aria-label="Application dock"
    >
      {APPS.map((app) => {
        const isRunning = running.has(app.id);
        return (
          <button
            key={app.id}
            type="button"
            onClick={() => handleClick(app.id)}
            title={app.title}
            aria-label={app.title}
            className="group relative flex w-16 flex-col items-center gap-1 rounded-lg px-1 pb-2 pt-1.5 transition-all duration-150 hover:bg-[var(--accent-2)]"
            style={{ color: 'var(--text)' }}
          >
            <AppIcon kind={app.icon} size={22} />
            <span
              className="w-full truncate text-center text-[10px] leading-none tracking-wide"
              style={{
                color: isRunning ? 'var(--text)' : 'var(--text-dim)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {app.dockLabel}
            </span>
            <span
              className="absolute bottom-0.5 left-1/2 -translate-x-1/2 rounded-full transition-opacity"
              style={{
                width: 3,
                height: 3,
                background: 'var(--accent)',
                opacity: isRunning ? 1 : 0,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
