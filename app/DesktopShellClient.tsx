'use client';

/**
 * Client wrapper that does the SSR-disabled dynamic import of the
 * desktop shell. Next.js requires `dynamic({ ssr: false })` to be
 * called from a Client Component, so this file exists solely to host
 * that boundary.
 *
 * Also responsible for the Phase 3 boot gate: first-visit users see
 * <BootSequence /> until they finish (or skip) it; repeat visitors and
 * `?skip-boot=1` bypass directly to the desktop.
 *
 * Phase 7: accepts an optional `initialDeeplink` that the deep-link
 * route pages (`/projects/[slug]`, `/blog/[slug]`, `/about`, `/now`) use
 * to tell the shell which app to open on mount.
 */

import dynamic from 'next/dynamic';
import { useBoot } from '@/lib/boot';
import BootSequence from '@/components/os/BootSequence';
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

  // Avoid a hydration flicker: useBoot reads localStorage in an effect,
  // so the very first render returns null until we know the answer.
  if (!ready) return null;

  if (needsBoot) {
    return <BootSequence onComplete={finish} />;
  }

  return <DesktopShell initialDeeplink={initialDeeplink} />;
}
