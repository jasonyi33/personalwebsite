'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[jasonyi.ai] runtime error:', error);
  }, [error]);

  const message = (error?.message ?? 'Unknown failure.').slice(0, 200);

  return (
    <main
      className="flex min-h-[100dvh] items-center justify-center px-4 py-10"
      style={{ background: 'transparent' }}
    >
      <div
        className="flex w-full max-w-[480px] flex-col items-start gap-4 rounded-xl border p-8"
        style={{
          background: 'var(--surface-2)',
          backdropFilter: 'blur(24px) saturate(140%)',
          WebkitBackdropFilter: 'blur(24px) saturate(140%)',
          borderColor: 'var(--border)',
        }}
      >
        <span
          className="text-[11px] tracking-wide"
          style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
        >
          something broke
        </span>
        <p
          className="break-words text-[13.5px] leading-[1.6]"
          style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
        >
          {message}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-[13px]">
          <button
            type="button"
            onClick={() => reset()}
            className="underline-offset-4 hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            try again
          </button>
          <Link
            href="/"
            className="underline-offset-4 hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            back to desktop
          </Link>
        </div>
      </div>
    </main>
  );
}
