/**
 * Deep-link bootstrap. Routes like /projects/[slug], /experience/[slug],
 * /about, /feed, /interests render the same DesktopShell with this hook
 * fired on mount to open the right app + query-sync the slug.
 */

'use client';

import { useEffect } from 'react';
import type { AppId } from '@/lib/apps';
import { useOsStore } from '@/lib/os-store';

export interface Deeplink {
  appId: AppId;
  slug?: string;
}

const SLUG_PARAM: Partial<Record<AppId, string>> = {
  projects: 'project',
  experience: 'experience',
};

export function deeplinkSearch(link: Deeplink): string {
  const param = SLUG_PARAM[link.appId];
  if (!param || !link.slug) return '';
  const sp = new URLSearchParams();
  sp.set(param, link.slug);
  return `?${sp.toString()}`;
}

export function useDeeplinkBootstrap(link: Deeplink | null | undefined): void {
  const hydrated = useOsStore((s) => s.hydrated);
  const openApp = useOsStore((s) => s.openApp);

  useEffect(() => {
    if (!link) return;
    if (!hydrated) return;
    if (typeof window === 'undefined') return;

    const search = deeplinkSearch(link);
    try {
      window.history.replaceState(null, '', `/${search}`);
    } catch {
      /* ignore */
    }
    openApp(link.appId);
  }, [link, hydrated, openApp]);
}
