/**
 * Minimal NERV-themed loading state for SSR navigation.
 *
 * A centered pulsing cyan dot + `LOADING…` text in mono. The pulse uses a
 * Tailwind `animate-pulse` keyframe that the global
 * `@media (prefers-reduced-motion: reduce)` block in `globals.css` already
 * neutralises (animation-duration: 0), so reduced-motion users see a
 * steady dot.
 */

export default function Loading() {
  return (
    <div
      className="flex min-h-[100dvh] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span
          className="inline-block h-2 w-2 animate-pulse rounded-full"
          style={{
            background: 'var(--nerv-cyan)',
            boxShadow: '0 0 8px rgba(0,207,255,0.7)',
          }}
          aria-hidden="true"
        />
        <span
          className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.25em]"
          style={{ color: 'var(--nerv-bone-dim)' }}
        >
          LOADING…
        </span>
      </div>
    </div>
  );
}
