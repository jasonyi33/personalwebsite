'use client';

/**
 * IntroGrid — brief landing animation. Plays once per session (gated by
 * useBoot), then dissolves into the OS desktop. No interaction required;
 * recruiters who don't hover/click still see the desktop within ~1.2s.
 *
 * Each cell renders a slice of the page's mesh gradient (background-attachment:
 * fixed) so the grid reads as a fractured version of the wallpaper. After a
 * short hold, every cell fades from the center outward and the overlay
 * unmounts via onComplete.
 *
 * A click anywhere skips the remaining hold. prefers-reduced-motion uses a
 * single short fade with no stagger.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const CELL_SIZE = 64;
const HOLD_MS = 700;
const EXIT_STAGGER_MS = 4;
const EXIT_FADE_MS = 360;

const CELL_BG = `
  radial-gradient(at 18% 22%, var(--mesh-a) 0%, transparent 42%),
  radial-gradient(at 82% 18%, var(--mesh-b) 0%, transparent 45%),
  radial-gradient(at 50% 88%, var(--mesh-c) 0%, transparent 48%),
  var(--bg)
`;

export default function IntroGrid({ onComplete }: Props) {
  const reduced = useReducedMotion();
  const [dims, setDims] = useState<{ cols: number; rows: number }>({ cols: 0, rows: 0 });
  const [exiting, setExiting] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    const compute = () => {
      const cols = Math.max(8, Math.ceil(window.innerWidth / CELL_SIZE));
      const rows = Math.max(6, Math.ceil(window.innerHeight / CELL_SIZE));
      setDims({ cols, rows });
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  const total = dims.cols * dims.rows;

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setExiting(true);
    const wait = reduced ? 220 : EXIT_FADE_MS + Math.min(240, total) * EXIT_STAGGER_MS;
    window.setTimeout(onComplete, wait);
  }, [onComplete, reduced, total]);

  // Auto-finish after a short hold. Visitors don't need to interact.
  useEffect(() => {
    if (total === 0) return;
    const hold = reduced ? 200 : HOLD_MS;
    const id = window.setTimeout(() => finish(), hold);
    return () => window.clearTimeout(id);
  }, [total, reduced, finish]);

  // Allow click / key to skip the remaining hold.
  const handleSkip = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.preventDefault();
      finish();
    },
    [finish],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [finish]);

  const cells = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < total; i++) arr.push(i);
    return arr;
  }, [total]);

  if (total === 0) return null;

  return (
    <div
      role="presentation"
      onClick={handleSkip}
      className="fixed inset-0 z-[9999]"
      style={{
        cursor: 'default',
        opacity: reduced && exiting ? 0 : 1,
        transition: reduced ? `opacity ${EXIT_FADE_MS}ms ease-out` : undefined,
      }}
    >
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${dims.cols}, 1fr)`,
          gridTemplateRows: `repeat(${dims.rows}, 1fr)`,
        }}
      >
        {cells.map((i) => {
          let exitDelay = 0;
          if (exiting && !reduced) {
            const col = i % dims.cols;
            const row = Math.floor(i / dims.cols);
            const cx = dims.cols / 2;
            const cy = dims.rows / 2;
            const dist = Math.hypot(col - cx, row - cy);
            exitDelay = Math.min(240, Math.round(dist * EXIT_STAGGER_MS));
          }

          const opacity = exiting ? 0 : 1;
          const transition = exiting
            ? `opacity ${EXIT_FADE_MS}ms ease-out ${exitDelay}ms`
            : 'opacity 160ms ease-out';

          return (
            <div
              key={i}
              style={{
                background: CELL_BG,
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover',
                boxShadow:
                  'inset 0 0 24px var(--intro-halo), 0 0 0 0.5px var(--bg)',
                opacity,
                transition,
              }}
            />
          );
        })}
      </div>

      {/* Centered identity — fades out with the grid. */}
      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{
          opacity: exiting ? 0 : 1,
          transition: `opacity ${EXIT_FADE_MS}ms ease-out`,
        }}
      >
        <h1
          className="text-[clamp(48px,9vw,112px)] font-semibold tracking-[-0.04em] leading-none"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-sans)' }}
        >
          Jason Yi
        </h1>
        <p
          className="mt-4 max-w-[640px] text-[clamp(14px,1.6vw,20px)] leading-snug"
          style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-sans)' }}
        >
          AI Product Engineer · Berkeley EECS
        </p>
      </div>
    </div>
  );
}
