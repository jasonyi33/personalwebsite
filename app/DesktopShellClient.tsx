'use client';

/**
 * Client wrapper for the desktop shell. Mounts the desktop immediately and
 * overlays IntroGrid on first visit so the landing feels alive — hovering
 * reveals the desktop through the grid, clicking dismisses everything.
 *
 * `?skip-boot=1` and a returning-visitor localStorage flag bypass the intro.
 */

import dynamic from 'next/dynamic';
import { useBoot } from '@/lib/boot';
import IntroGrid from '@/components/os/IntroGrid';
import type { Deeplink } from '@/lib/deeplink';

const DesktopShell = dynamic(() => import('@/components/os/DesktopShell'), {
  ssr: false,
});

interface DesktopShellClientProps {
  initialDeeplink?: Deeplink | null;
}

export default function DesktopShellClient({
  initialDeeplink = null,
}: DesktopShellClientProps) {
  const { needsBoot, ready, finish } = useBoot();

  // Don't render anything until we know whether the intro is needed —
  // avoids a flicker between server (no intro) and client (maybe intro).
  if (!ready) return null;

  return (
    <>
      <DesktopShell initialDeeplink={initialDeeplink} />
      {needsBoot ? <IntroGrid onComplete={finish} /> : null}
    </>
  );
}
