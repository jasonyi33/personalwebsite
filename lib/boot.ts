'use client';

/**
 * useBoot — small hook that decides whether the boot sequence should
 * play on this load.
 *
 * Rules (matches spec §4):
 *   - URL param `?skip-boot=1` bypasses boot entirely.
 *   - localStorage flag `nerv-os:booted=='1'` bypasses on repeat visits.
 *   - Otherwise the caller renders <BootSequence /> and invokes `finish()`
 *     on completion, which writes the flag and flips state.
 *
 * `ready` is false during the very first render so the caller can return
 * `null` and avoid an SSR/CSR hydration flicker (we can't read
 * localStorage on the server).
 */

import { useEffect, useState } from 'react';

export function useBoot() {
  const [needsBoot, setNeedsBoot] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const skip = url.searchParams.get('skip-boot') === '1';
    const booted = localStorage.getItem('nerv-os:booted') === '1';
    setNeedsBoot(!skip && !booted);
    setReady(true);
  }, []);

  const finish = () => {
    try {
      localStorage.setItem('nerv-os:booted', '1');
    } catch {
      // localStorage may be unavailable (private mode, etc.) — fine, we
      // just won't persist the "booted" state across reloads.
    }
    setNeedsBoot(false);
  };

  return { needsBoot, ready, finish };
}
