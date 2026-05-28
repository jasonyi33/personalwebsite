'use client';

/**
 * Bottom-center dock. Lists all 7 apps from the registry. Click toggles
 * the app (open if not running, otherwise focus / un-minimize). A small
 * cyan dot under each icon indicates a running app.
 *
 * Mobile fallback: collapses to a hamburger pill that opens a sheet
 * listing the apps as a vertical menu.
 */

import { useEffect, useState } from 'react';
import { useOsStore } from '@/lib/os-store';
import { APPS, type AppId } from '@/lib/apps';
import AppIcon from './AppIcon';

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return mobile;
}

export default function Dock() {
  const windows = useOsStore((s) => s.windows);
  const openApp = useOsStore((s) => s.openApp);
  const focusWindow = useOsStore((s) => s.focusWindow);
  const minimizeWindow = useOsStore((s) => s.minimizeWindow);
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

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

  if (isMobile) {
    return (
      <>
        <button
          type="button"
          onClick={() => setSheetOpen((v) => !v)}
          className="fixed bottom-3 left-1/2 z-[900] flex h-10 w-12 -translate-x-1/2 items-center justify-center rounded-full border font-[family-name:var(--font-mono)] text-[14px]"
          style={{
            background: 'rgba(14,18,28,0.78)',
            backdropFilter: 'blur(14px) saturate(140%)',
            WebkitBackdropFilter: 'blur(14px) saturate(140%)',
            borderColor: 'var(--nerv-panel-edge)',
            color: 'var(--nerv-cyan)',
          }}
          aria-label="Open app launcher"
        >
          ☰
        </button>
        {sheetOpen && (
          <div
            className="fixed inset-x-3 bottom-16 z-[900] flex flex-col gap-2 rounded-lg border p-3"
            style={{
              background: 'rgba(14,18,28,0.92)',
              backdropFilter: 'blur(14px) saturate(140%)',
              WebkitBackdropFilter: 'blur(14px) saturate(140%)',
              borderColor: 'var(--nerv-panel-edge)',
            }}
          >
            {APPS.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => {
                  handleClick(app.id);
                  setSheetOpen(false);
                }}
                className="flex items-center gap-3 rounded-md p-2 text-left"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <AppIcon kind={app.icon} size={24} />
                <span
                  className="font-[family-name:var(--font-mono)] text-[12px] tracking-widest"
                  style={{ color: 'var(--nerv-bone)' }}
                >
                  {app.title}
                </span>
              </button>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className="fixed bottom-3 left-1/2 z-[900] flex -translate-x-1/2 items-end gap-1 rounded-2xl border px-3 py-2"
      style={{
        background: 'rgba(14,18,28,0.78)',
        backdropFilter: 'blur(14px) saturate(140%)',
        WebkitBackdropFilter: 'blur(14px) saturate(140%)',
        borderColor: 'var(--nerv-panel-edge)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.55)',
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
            className="group relative flex w-16 flex-col items-center gap-1 rounded-md px-1 pb-2 pt-1 transition-transform duration-150 hover:-translate-y-0.5"
          >
            <AppIcon kind={app.icon} size={28} />
            <span
              className="font-[family-name:var(--font-mono)] text-[10px] leading-none tracking-widest uppercase truncate w-full text-center"
              style={{
                color: isRunning ? 'var(--nerv-bone)' : 'var(--nerv-bone-dim)',
              }}
            >
              {app.dockLabel}
            </span>
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full transition-opacity"
              style={{
                width: 4,
                height: 4,
                background: 'var(--nerv-cyan)',
                opacity: isRunning ? 1 : 0,
                boxShadow: isRunning ? '0 0 6px rgba(0,207,255,0.8)' : 'none',
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
