'use client';

/**
 * useBoot — session-scoped intro gate. The IntroGrid plays once per browser
 * session (per tab). Subsequent navigations in the same session skip it.
 * `?skip-boot=1` bypasses for deep-link previews and tests.
 */

import { useEffect, useState } from 'react';

const SESSION_KEY = 'jy:boot-played';

export function useBoot() {
  const [needsBoot, setNeedsBoot] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const skip = url.searchParams.get('skip-boot') === '1';
    let played = false;
    try {
      played = window.sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      /* sessionStorage unavailable — treat as not played */
    }
    setNeedsBoot(!skip && !played);
    setReady(true);
  }, []);

  const finish = () => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
    setNeedsBoot(false);
  };

  return { needsBoot, ready, finish };
}
