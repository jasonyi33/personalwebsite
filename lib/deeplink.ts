/**
 * Deep-link bootstrap for NERV-OS.
 *
 * Server-rendered deep-link routes (`/projects/[slug]`, `/blog/[slug]`,
 * `/about`, `/now`) render the same DesktopShell as the root route. They
 * pass an `initialDeeplink` descriptor through to the shell, which calls
 * `useDeeplinkBootstrap` to:
 *
 *   1. open the corresponding app via `useOsStore.openApp`, and
 *   2. rewrite the URL to `/?<param>=<slug>` via `history.replaceState`
 *      so the existing per-app search-param readers (ProjectsApp's
 *      `?project=` / BlogApp's `?post=`) fire on mount without those apps
 *      needing any modification.
 *
 * No SPA navigation occurs — the desktop is already mounted by the route
 * page; we only adjust the URL and trigger `openApp`.
 */

'use client';

import { useEffect } from 'react';
import type { AppId } from '@/lib/apps';
import { useOsStore } from '@/lib/os-store';

export interface Deeplink {
  appId: AppId;
  slug?: string;
}

/**
 * Map a deep-link app id to the query-param name the corresponding app
 * reads on mount. Singletons (about, now, terminal, settings, readme)
 * have no slug and need no param.
 */
const SLUG_PARAM: Partial<Record<AppId, string>> = {
  projects: 'project',
  blog: 'post',
};

/**
 * Compute the search string an app expects for a given deep-link.
 * Exported so tests / route pages can share the convention.
 */
export function deeplinkSearch(link: Deeplink): string {
  const param = SLUG_PARAM[link.appId];
  if (!param || !link.slug) return '';
  const sp = new URLSearchParams();
  sp.set(param, link.slug);
  return `?${sp.toString()}`;
}

/**
 * Client hook: on mount, open the requested app and rewrite the URL so
 * the per-app param readers (e.g. ProjectsApp's `?project=` effect) see
 * the slug. Safe to call with `link === null` — it becomes a no-op.
 */
export function useDeeplinkBootstrap(link: Deeplink | null | undefined): void {
  const hydrated = useOsStore((s) => s.hydrated);
  const openApp = useOsStore((s) => s.openApp);

  useEffect(() => {
    if (!link) return;
    if (!hydrated) return;
    if (typeof window === 'undefined') return;

    const search = deeplinkSearch(link);
    // Rewrite URL first so the app's mount-time effect reads the right
    // params. `openApp` will mount the app immediately after.
    try {
      window.history.replaceState(null, '', `/${search}`);
    } catch {
      // ignore — some embedded contexts disallow history mutation.
    }
    openApp(link.appId);
  }, [link, hydrated, openApp]);
}
