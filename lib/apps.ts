/**
 * Apps registry — 5 surfaces shown in the dock & on the desktop.
 */

export type AppId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'feed'
  | 'interests';

export type AppIconKind = AppId;

export interface AppDefinition {
  id: AppId;
  /** Full title in window chrome. */
  title: string;
  /** Short label rendered under dock + desktop icons. */
  dockLabel: string;
  icon: AppIconKind;
  defaultSize: { w: number; h: number };
}

export const APPS: readonly AppDefinition[] = [
  {
    id: 'about',
    title: 'About',
    dockLabel: 'about',
    icon: 'about',
    defaultSize: { w: 720, h: 560 },
  },
  {
    id: 'experience',
    title: 'Experience',
    dockLabel: 'experience',
    icon: 'experience',
    defaultSize: { w: 960, h: 620 },
  },
  {
    id: 'projects',
    title: 'Projects',
    dockLabel: 'projects',
    icon: 'projects',
    defaultSize: { w: 960, h: 640 },
  },
  {
    id: 'feed',
    title: 'Feed',
    dockLabel: 'feed',
    icon: 'feed',
    defaultSize: { w: 760, h: 600 },
  },
  {
    id: 'interests',
    title: 'Interests',
    dockLabel: 'interests',
    icon: 'interests',
    defaultSize: { w: 820, h: 600 },
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
