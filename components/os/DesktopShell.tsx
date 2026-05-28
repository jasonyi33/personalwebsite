'use client';

/**
 * DesktopShell — the root of the OS surface. Mounts the wallpaper,
 * desktop icons, window manager, menubar, and dock; runs hydration of
 * persisted state, and auto-opens NERV_Terminal on the very first mount.
 */

import { useEffect } from 'react';
import { useOsStore } from '@/lib/os-store';
import { useDeeplinkBootstrap, type Deeplink } from '@/lib/deeplink';
import Wallpaper from './Wallpaper';
import DesktopIcons from './DesktopIcons';
import WindowManager from './WindowManager';
import Menubar from './Menubar';
import Dock from './Dock';

const AUTOOPEN_KEY = 'nerv-os:autoopen-terminal';

interface DesktopShellProps {
  initialDeeplink?: Deeplink | null;
}

export default function DesktopShell({ initialDeeplink = null }: DesktopShellProps) {
  const hydrate = useOsStore((s) => s.hydrate);
  const hydrated = useOsStore((s) => s.hydrated);
  const openApp = useOsStore((s) => s.openApp);

  // First, rehydrate persisted layout (no-op on SSR).
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Then, once hydrated, auto-open the terminal on first ever visit.
  // Skip the auto-open when arriving via a deep-link route — the visitor
  // came here to see a specific app, not the terminal.
  useEffect(() => {
    if (!hydrated) return;
    if (initialDeeplink) return;
    try {
      const already = window.localStorage.getItem(AUTOOPEN_KEY);
      if (already) return;
      window.localStorage.setItem(AUTOOPEN_KEY, '1');
      // If something was already persisted, don't double-open.
      const hasTerminal = useOsStore
        .getState()
        .windows.some((w) => w.appId === 'terminal');
      if (!hasTerminal) {
        openApp('terminal');
      }
    } catch {
      // ignore storage errors
    }
  }, [hydrated, openApp, initialDeeplink]);

  // Bootstrap the deep-link (no-op if not provided).
  useDeeplinkBootstrap(initialDeeplink);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Wallpaper />
      <Menubar />
      <DesktopIcons />
      <WindowManager />
      <Dock />
    </div>
  );
}
