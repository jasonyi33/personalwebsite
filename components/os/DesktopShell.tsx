'use client';

/**
 * DesktopShell — root of the OS surface. Switches to a mobile layout below
 * 768px. On the desktop path it auto-opens About on the first visit and
 * honors deep-link routes.
 */

import { useEffect, useState } from 'react';
import { useOsStore } from '@/lib/os-store';
import { useDeeplinkBootstrap, type Deeplink } from '@/lib/deeplink';
import Wallpaper from './Wallpaper';
import DesktopIcons from './DesktopIcons';
import WindowManager from './WindowManager';
import Menubar from './Menubar';
import Dock from './Dock';
import MobileLayout from './MobileLayout';

const AUTOOPEN_KEY = 'desktop:autoopen-about';

interface DesktopShellProps {
  initialDeeplink?: Deeplink | null;
}

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

export default function DesktopShell({ initialDeeplink = null }: DesktopShellProps) {
  const hydrate = useOsStore((s) => s.hydrate);
  const hydrated = useOsStore((s) => s.hydrated);
  const openApp = useOsStore((s) => s.openApp);
  const isMobile = useIsMobile();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    if (initialDeeplink) return;
    if (isMobile) return;
    try {
      const already = window.localStorage.getItem(AUTOOPEN_KEY);
      if (already) return;
      window.localStorage.setItem(AUTOOPEN_KEY, '1');
      const hasAbout = useOsStore.getState().windows.some((w) => w.appId === 'about');
      if (!hasAbout) openApp('about');
    } catch {
      /* ignore */
    }
  }, [hydrated, openApp, initialDeeplink, isMobile]);

  useDeeplinkBootstrap(initialDeeplink);

  if (isMobile) {
    return <MobileLayout />;
  }

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
