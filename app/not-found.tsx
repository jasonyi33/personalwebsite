/**
 * 404 page — themed as a NERV terminal readout.
 *
 * Rendered when Next.js cannot resolve a route (e.g. `/unknown-path` or an
 * unknown `[slug]` in `app/projects/[slug]`). Mirrors the boot scene chrome:
 * centered translucent panel over the global starfield body backdrop.
 */

import Link from 'next/link';
import NervLogo from '@/components/os/NervLogo';

export default function NotFound() {
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
            '0 16px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,207,255,0.10) inset',
        }}
      >
        <NervLogo size={64} title="NERV" />
        <h1
          className="font-[family-name:var(--font-mono)] text-[18px] tracking-[0.18em] sm:text-[20px]"
          style={{ color: 'var(--nerv-cyan)' }}
        >
          &gt; ERROR: NODE NOT FOUND
        </h1>
        <p
          className="font-[family-name:var(--font-mono)] text-[12px] leading-relaxed tracking-wide sm:text-[13px]"
          style={{ color: 'var(--nerv-bone-dim)' }}
        >
          the path you requested is not indexed in the MAGI database.
        </p>
        <Link
          href="/"
          className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.18em] underline-offset-4 transition-opacity hover:opacity-80 focus-visible:underline sm:text-[13px]"
          style={{ color: 'var(--nerv-cyan)' }}
        >
          [RETURN TO DESKTOP]
        </Link>
      </div>
    </main>
  );
}
