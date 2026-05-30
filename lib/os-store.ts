/**
 * NERV-OS window manager state (Phase 2).
 *
 * Holds the live list of windows the desktop knows about, plus a few
 * shell-wide ephemeral flags. Windows are persisted to localStorage so that
 * a reload restores the user's layout. Persistence is hydration-safe: the
 * store boots with an empty layout on the server, and `hydrate()` is
 * invoked from `DesktopShell` on the client after mount.
 */

import { create } from 'zustand';
import type { AppId } from '@/lib/apps';
import { getApp } from '@/lib/apps';

export type WindowId = string;

export interface WindowState {
  id: WindowId;
  appId: AppId;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  focused: boolean;
}

interface PersistShape {
  windows: WindowState[];
  zCounter: number;
}

const STORAGE_KEY = 'desktop:windows';
const Z_REBASE_AT = 9999;

interface OsState {
  windows: WindowState[];
  zCounter: number;
  muted: boolean;
  hydrated: boolean;

  hydrate: () => void;
  openApp: (appId: AppId) => WindowId;
  closeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  moveWindow: (id: WindowId, x: number, y: number) => void;
  resizeWindow: (id: WindowId, w: number, h: number) => void;
  minimizeWindow: (id: WindowId) => void;
  toggleMute: () => void;
}

function makeId(): WindowId {
  return `w_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function defaultPositionFor(index: number, w: number, h: number): { x: number; y: number } {
  if (typeof window === 'undefined') {
    return { x: 120 + index * 32, y: 80 + index * 32 };
  }
  const cx = Math.max(120, Math.floor((window.innerWidth - w) / 2));
  const cy = Math.max(80, Math.floor((window.innerHeight - h) / 2));
  const offset = index * 28;
  return { x: cx + offset, y: cy + offset };
}

function persist(state: Pick<OsState, 'windows' | 'zCounter'>): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: PersistShape = {
      windows: state.windows,
      zCounter: state.zCounter,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage may be unavailable (private mode / quota); ignore.
  }
}

function loadPersisted(): PersistShape | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistShape;
    if (!Array.isArray(parsed.windows)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function rebaseZ(windows: WindowState[]): { windows: WindowState[]; zCounter: number } {
  const sorted = [...windows].sort((a, b) => a.z - b.z);
  const rebased = sorted.map((w, i) => ({ ...w, z: i + 1 }));
  // re-sort back to original order by id stability
  const byId = new Map(rebased.map((w) => [w.id, w]));
  return {
    windows: windows.map((w) => byId.get(w.id) ?? w),
    zCounter: rebased.length,
  };
}

export const useOsStore = create<OsState>((set, get) => ({
  windows: [],
  zCounter: 0,
  muted: false,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    const data = loadPersisted();
    if (data) {
      set({
        windows: data.windows,
        zCounter: data.zCounter,
        hydrated: true,
      });
    } else {
      set({ hydrated: true });
    }
  },

  openApp: (appId) => {
    const def = getApp(appId);
    const existing = get().windows.find((w) => w.appId === appId);
    if (existing) {
      get().focusWindow(existing.id);
      if (existing.minimized) {
        set((s) => ({
          windows: s.windows.map((w) =>
            w.id === existing.id ? { ...w, minimized: false } : w,
          ),
        }));
        persist({ windows: get().windows, zCounter: get().zCounter });
      }
      return existing.id;
    }

    const id = makeId();
    const index = get().windows.length;
    const { x, y } = defaultPositionFor(index, def.defaultSize.w, def.defaultSize.h);
    let nextZ = get().zCounter + 1;
    let rebasedWindows = get().windows;
    if (nextZ >= Z_REBASE_AT) {
      const r = rebaseZ(get().windows);
      rebasedWindows = r.windows;
      nextZ = r.zCounter + 1;
    }
    const next: WindowState = {
      id,
      appId,
      x,
      y,
      w: def.defaultSize.w,
      h: def.defaultSize.h,
      z: nextZ,
      minimized: false,
      focused: true,
    };
    const windows = rebasedWindows
      .map((w) => ({ ...w, focused: false }))
      .concat(next);
    set({ windows, zCounter: nextZ });
    persist({ windows, zCounter: nextZ });
    return id;
  },

  closeWindow: (id) => {
    const windows = get().windows.filter((w) => w.id !== id);
    set({ windows });
    persist({ windows, zCounter: get().zCounter });
  },

  focusWindow: (id) => {
    const cur = get().windows.find((w) => w.id === id);
    if (!cur) return;
    let nextZ = get().zCounter + 1;
    let baseWindows = get().windows;
    if (nextZ >= Z_REBASE_AT) {
      const r = rebaseZ(get().windows);
      baseWindows = r.windows;
      nextZ = r.zCounter + 1;
    }
    const windows = baseWindows.map((w) =>
      w.id === id
        ? { ...w, focused: true, z: nextZ, minimized: false }
        : { ...w, focused: false },
    );
    set({ windows, zCounter: nextZ });
    persist({ windows, zCounter: nextZ });
  },

  moveWindow: (id, x, y) => {
    const windows = get().windows.map((w) => (w.id === id ? { ...w, x, y } : w));
    set({ windows });
    persist({ windows, zCounter: get().zCounter });
  },

  resizeWindow: (id, w, h) => {
    const windows = get().windows.map((win) =>
      win.id === id ? { ...win, w, h } : win,
    );
    set({ windows });
    persist({ windows, zCounter: get().zCounter });
  },

  minimizeWindow: (id) => {
    const windows = get().windows.map((w) =>
      w.id === id ? { ...w, minimized: true, focused: false } : w,
    );
    set({ windows });
    persist({ windows, zCounter: get().zCounter });
  },

  toggleMute: () => set((s) => ({ muted: !s.muted })),
}));
