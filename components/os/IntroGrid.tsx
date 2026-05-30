'use client';

/**
 * IntroGrid — landing overlay inspired by txnio.com.
 *
 * The desktop is fully mounted underneath; this overlay paints a faint grid
 * of cells with only their borders visible. Hovering a cell fills it (the
 * "blocking block" shows itself). A click anywhere fades the entire grid
 * away and dismisses the overlay so the desktop becomes interactive.
 *
 * Cell density adapts to viewport (~64px per cell). prefers-reduced-motion
 * skips the stagger and just fades the whole overlay.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const CELL_SIZE = 64;
const EXIT_STAGGER_MS = 5;
const EXIT_FADE_MS = 320;

export default function IntroGrid({ onComplete }: Props) {
  const reduced = useReducedMotion();
  const [dims, setDims] = useState<{ cols: number; rows: number }>({ cols: 0, rows: 0 });
  const [hovered, setHovered] = useState<Set<number>>(new Set());
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
    const wait = reduced ? 220 : EXIT_FADE_MS + Math.min(total, 220) * EXIT_STAGGER_MS;
    window.setTimeout(onComplete, wait);
  }, [onComplete, reduced, total]);

  const handleEnter = useCallback((i: number) => {
    if (exiting) return;
    setHovered((cur) => {
      if (cur.has(i)) return cur;
      const next = new Set(cur);
      next.add(i);
      return next;
    });
  }, [exiting]);

  const handleLeave = useCallback((i: number) => {
    if (exiting) return;
    setHovered((cur) => {
      if (!cur.has(i)) return cur;
      const next = new Set(cur);
      next.delete(i);
      return next;
    });
  }, [exiting]);

  const handleClickAnywhere = useCallback(
    (e: React.MouseEvent) => {
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
      role="button"
      tabIndex={0}
      aria-label="Tap to enter"
      onClick={handleClickAnywhere}
      className="fixed inset-0 z-[300]"
      style={{
        cursor: 'pointer',
        background: 'transparent',
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
          const isHovered = hovered.has(i);

          // Cells exit one-by-one from the center for the dismiss animation;
          // delay scales with distance.
          let exitDelay = 0;
          if (exiting && !reduced) {
            const col = i % dims.cols;
            const row = Math.floor(i / dims.cols);
            const cx = dims.cols / 2;
            const cy = dims.rows / 2;
            const dist = Math.hypot(col - cx, row - cy);
            exitDelay = Math.min(220, Math.round(dist * EXIT_STAGGER_MS));
          }

          const opacity = exiting ? 0 : isHovered ? 0.85 : 0;
          const transition = exiting
            ? `opacity ${EXIT_FADE_MS}ms ease-out ${exitDelay}ms`
            : 'opacity 140ms ease-out';

          return (
            <span
              key={i}
              onPointerEnter={() => handleEnter(i)}
              onPointerLeave={() => handleLeave(i)}
              style={{
                position: 'relative',
                borderRight: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'var(--text)',
                  opacity,
                  transition,
                  pointerEvents: 'none',
                }}
              />
            </span>
          );
        })}
      </div>

      {/* Center prompt */}
      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2"
        style={{
          opacity: exiting ? 0 : 1,
          transition: `opacity ${EXIT_FADE_MS}ms ease-out`,
        }}
      >
        <span
          className="text-[28px] font-medium tracking-tight"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-sans)' }}
        >
          jasonyi.live
        </span>
        <span
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
        >
          tap anywhere to enter
        </span>
      </div>
    </div>
  );
}
