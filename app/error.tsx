'use client';

/**
 * Global error boundary — themed as a NERV "KERNEL PANIC" readout.
 *
 * Same chrome as `not-found.tsx`. Receives the standard Next.js `error`
 * + `reset` props. We truncate the error message to 200 chars so a noisy
 * stack-trace doesn't bust the panel layout, and we expose both a
 * [RETRY] button (calls `reset()`) and a [RETURN TO DESKTOP] link.
 */

import Link from 'next/link';
import { useEffect } from 'react';
import NervLogo from '@/components/os/NervLogo';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // Surface to the console so we don't swallow runtime errors silently;
    // Vercel will also log this via the runtime logs pipeline.
    // eslint-disable-next-line no-console
    console.error('[NERV-OS] runtime error:', error);
  }, [error]);

  const message = (error?.message ?? 'Unknown failure.').slice(0, 200);

  return (
    <main
      className="flex min-h-[100dvh] items-center justify-center px-4 py-10"
      style={{ background: 'transparent' }}
    >
      <div
        className="flex w-full max-w-[560px] flex-col items-center gap-6 rounded-lg border p-8 text-center"
        style={{
          background: 'rgba(14, 18, 28, 0.78)',
          backdropFilter: 'blur(14px) saturate(140%)',
          WebkitBackdropFilter: 'blur(14px) saturate(140%)',
          borderColor: 'var(--nerv-panel-edge)',
          boxShadow:
            '0 16px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(229,37,42,0.10) inset',
        }}
      >
        <NervLogo size={64} title="NERV" />
        <h1
          className="font-[family-name:var(--font-mono)] text-[18px] tracking-[0.18em] sm:text-[20px]"
          style={{ color: 'var(--nerv-red)' }}
        >
          &gt; KERNEL PANIC
        </h1>
        <p
          className="break-words font-[family-name:var(--font-mono)] text-[12px] leading-relaxed tracking-wide sm:text-[13px]"
          style={{ color: 'var(--nerv-bone-dim)' }}
        >
          {message}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.18em] underline-offset-4 transition-opacity hover:opacity-80 focus-visible:underline sm:text-[13px]"
            style={{ color: 'var(--nerv-cyan)' }}
            aria-label="Retry the failed operation"
          >
            [RETRY]
          </button>
          <Link
            href="/"
            className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.18em] underline-offset-4 transition-opacity hover:opacity-80 focus-visible:underline sm:text-[13px]"
            style={{ color: 'var(--nerv-cyan)' }}
          >
            [RETURN TO DESKTOP]
          </Link>
        </div>
      </div>
    </main>
  );
}
