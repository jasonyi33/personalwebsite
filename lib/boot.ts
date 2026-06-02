'use client';

/**
 * useBoot — intro gate. The overlay shows on every page load so visitors
 * always meet the grid first. `?skip-boot=1` is the one bypass — used by
 * deep-link previews and tests.
 */

import { useEffect, useState } from 'react';

export function useBoot() {
  const [needsBoot, setNeedsBoot] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const skip = url.searchParams.get('skip-boot') === '1';
    setNeedsBoot(!skip);
    setReady(true);
  }, []);

  const finish = () => {
    setNeedsBoot(false);
  };

  return { needsBoot, ready, finish };
}
