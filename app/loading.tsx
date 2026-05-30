export default function Loading() {
  return (
    <div
      className="flex min-h-[100dvh] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <span
        className="text-[11px] tracking-wide"
        style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
      >
        loading…
      </span>
    </div>
  );
}
