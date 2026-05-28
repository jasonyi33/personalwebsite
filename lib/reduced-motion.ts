'use client';

/**
 * `useReducedMotionPref` — like framer-motion's `useReducedMotion`, but
 * also honours a `localStorage` flag (`nerv-os:reduced-motion`) set by
 * the Settings app. Returns `true` if EITHER the system preference is
 * `reduce` OR the user has toggled the override on.
 *
 * Phase 8 doesn't retrofit existing components to use this hook — it's
 * exposed for future work and to validate the reduced-motion contract.
 */

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'nerv-os:reduced-motion';

export function useReducedMotionPref(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const sys = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stored = localStorage.getItem(STORAGE_KEY) === '1';
    setReduced(sys || stored);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const sysNow = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setReduced(sysNow || e.newValue === '1');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return reduced;
}
