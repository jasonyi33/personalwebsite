import type { Metadata } from 'next';

const PDF_URL = '/resume.pdf';

export const metadata: Metadata = {
  title: 'Résumé · Jason Yi',
  description: 'Résumé of Jason Yi, UC Berkeley EECS.',
  robots: { index: true, follow: true },
};

export default function ResumePage() {
  return (
    <div
      className="mx-auto flex w-full max-w-[1080px] flex-col px-4 pt-4 pb-8 sm:px-6"
      style={{ height: 'calc(100dvh - 72px)' }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h1
          className="text-[11px] tracking-[0.22em] uppercase"
          style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
        >
          Résumé
        </h1>
        <a
          href={PDF_URL}
          download
          className="text-[11px] tracking-[0.04em] underline-offset-4 hover:underline"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
        >
          download ↓
        </a>
      </div>

      <object
        data={PDF_URL}
        type="application/pdf"
        className="w-full flex-1 rounded-lg"
        style={{ border: '1px solid var(--border)', minHeight: 0 }}
        aria-label="Jason Yi résumé"
      >
        <div
          className="flex h-full w-full items-center justify-center p-8 text-center text-[13px]"
          style={{ color: 'var(--text-dim)' }}
        >
          Your browser can't display this PDF inline.{' '}
          <a
            href={PDF_URL}
            className="ml-1 underline-offset-4 hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            Open it directly ↗
          </a>
        </div>
      </object>
    </div>
  );
}
