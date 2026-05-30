'use client';

/**
 * useBoot — first-visit gate for the intro animation.
 *  - URL `?skip-boot=1` always skips.
 *  - localStorage `intro:seen=='1'` skips on repeat visits.
 */

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'intro:seen';

export function useBoot() {
  const [needsBoot, setNeedsBoot] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const skip = url.searchParams.get('skip-boot') === '1';
    const seen = localStorage.getItem(STORAGE_KEY) === '1';
    setNeedsBoot(!skip && !seen);
    setReady(true);
  }, []);

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setNeedsBoot(false);
  };

  return { needsBoot, ready, finish };
}
