/**
 * NERV-OS apps registry (spec section 3.4).
 * The actual app implementations land in Phase 6; here we only describe the
 * shell-level metadata: id, display title, icon kind, and default window size.
 */

export type AppId =
  | 'terminal'
  | 'projects'
  | 'blog'
  | 'about'
  | 'now'
  | 'settings'
  | 'readme';

export type AppIconKind =
  | 'terminal'
  | 'projects'
  | 'blog'
  | 'about'
  | 'now'
  | 'settings'
  | 'readme';

export interface AppDefinition {
  id: AppId;
  /** Full title used in window chrome. */
  title: string;
  /** Short label rendered under dock + desktop icons. */
  dockLabel: string;
  icon: AppIconKind;
  defaultSize: { w: number; h: number };
}

export const APPS: readonly AppDefinition[] = [
  {
    id: 'terminal',
    title: 'NERV_Terminal',
    dockLabel: 'Terminal',
    icon: 'terminal',
    defaultSize: { w: 900, h: 600 },
  },
  {
    id: 'projects',
    title: 'Projects',
    dockLabel: 'Projects',
    icon: 'projects',
    defaultSize: { w: 960, h: 640 },
  },
  {
    id: 'blog',
    title: 'Logs',
    dockLabel: 'Logs',
    icon: 'blog',
    defaultSize: { w: 880, h: 620 },
  },
  {
    id: 'about',
    title: 'About',
    dockLabel: 'About',
    icon: 'about',
    defaultSize: { w: 720, h: 560 },
  },
  {
    id: 'now',
    title: 'Now',
    dockLabel: 'Now',
    icon: 'now',
    defaultSize: { w: 640, h: 560 },
  },
  {
    id: 'settings',
    title: 'Prefs',
    dockLabel: 'Prefs',
    icon: 'settings',
    defaultSize: { w: 560, h: 460 },
  },
  {
    id: 'readme',
    title: 'README.first',
    dockLabel: 'Readme',
    icon: 'readme',
    defaultSize: { w: 600, h: 500 },
  },
] as const;

export const APP_MAP: Readonly<Record<AppId, AppDefinition>> = APPS.reduce(
  (acc, app) => {
    acc[app.id] = app;
    return acc;
  },
  {} as Record<AppId, AppDefinition>,
);

export function getApp(id: AppId): AppDefinition {
  return APP_MAP[id];
}
