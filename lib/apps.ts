/**
 * Apps registry. `hidden: true` keeps the app addressable by deeplink /
 * direct route (the /feed page still works) but removes it from the dock,
 * desktop-icons column, and mobile tab bar.
 */

export type AppId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'feed'
  | 'interests';

export type AppIconKind = AppId | 'resume';

export interface AppDefinition {
  id: AppId;
  /** Full title in window chrome. */
  title: string;
  /** Short label rendered under dock + desktop icons. */
  dockLabel: string;
  icon: AppIconKind;
  defaultSize: { w: number; h: number };
  /** If true, omit from dock + desktop icons + mobile tabs. */
  hidden?: boolean;
}

export const APPS: readonly AppDefinition[] = [
  {
    id: 'about',
    title: 'About',
    dockLabel: 'about',
    icon: 'about',
    defaultSize: { w: 880, h: 660 },
  },
  {
    id: 'experience',
    title: 'Experience',
    dockLabel: 'experience',
    icon: 'experience',
    defaultSize: { w: 1120, h: 740 },
  },
  {
    id: 'projects',
    title: 'Projects',
    dockLabel: 'projects',
    icon: 'projects',
    defaultSize: { w: 1120, h: 760 },
  },
  {
    id: 'feed',
    title: 'Feed',
    dockLabel: 'feed',
    icon: 'feed',
    defaultSize: { w: 920, h: 720 },
    hidden: true,
  },
  {
    id: 'interests',
    title: 'Interests',
    dockLabel: 'interests',
    icon: 'interests',
    defaultSize: { w: 1020, h: 720 },
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
