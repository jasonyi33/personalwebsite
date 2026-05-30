import Link from 'next/link';

export default function NotFound() {
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
          404
        </span>
        <h1
          className="text-[22px] font-semibold tracking-tight"
          style={{ color: 'var(--text)' }}
        >
          Not found.
        </h1>
        <p
          className="text-[13.5px] leading-[1.6]"
          style={{ color: 'var(--text-dim)' }}
        >
          The page you requested doesn&apos;t exist. Head back to the desktop.
        </p>
        <Link
          href="/"
          className="mt-2 text-[13px] underline-offset-4 hover:underline"
          style={{ color: 'var(--accent)' }}
        >
          ← back to desktop
        </Link>
      </div>
    </main>
  );
}
