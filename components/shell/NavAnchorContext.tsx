'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export interface AnchorRect {
  x: number;  // center x in viewport coords
  y: number;  // center y in viewport coords
  w: number;
  h: number;
}

interface NavAnchorContextValue {
  /** Register an anchor element's rect, keyed by a stable id (e.g. route path or `card:<slug>`). */
  register: (key: string, rect: AnchorRect) => void;
  /** Read the last-registered rect for a key. */
  read: (key: string) => AnchorRect | undefined;
  /** Record which anchor key initiated the next navigation. The incoming page reads this on mount. */
  setOriginKey: (key: string | undefined) => void;
  originKey: string | undefined;
}

const NavAnchorCtx = createContext<NavAnchorContextValue | null>(null);

export function NavAnchorProvider({ children }: { children: ReactNode }) {
  const rects = useRef<Map<string, AnchorRect>>(new Map());
  const [originKey, setOriginKey] = useState<string | undefined>(undefined);

  const register = useCallback((key: string, rect: AnchorRect) => {
    rects.current.set(key, rect);
  }, []);

  const read = useCallback((key: string) => rects.current.get(key), []);

  const value = useMemo<NavAnchorContextValue>(
    () => ({ register, read, originKey, setOriginKey }),
    [register, read, originKey],
  );

  return <NavAnchorCtx.Provider value={value}>{children}</NavAnchorCtx.Provider>;
}

export function useNavAnchors(): NavAnchorContextValue {
  const ctx = useContext(NavAnchorCtx);
  if (!ctx) throw new Error('useNavAnchors() must be used inside <NavAnchorProvider>.');
  return ctx;
}
