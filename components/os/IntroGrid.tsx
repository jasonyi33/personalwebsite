'use client';

/**
 * IntroGrid — landing overlay over the (already-mounted) desktop.
 *
 * Each cell renders a slice of the page's mesh gradient (via
 * background-attachment: fixed) so the grid as a whole reads as a fractured
 * version of the modern wallpaper — same colors, same motion, just split
 * into tiles. Hovering a cell makes it transparent so the desktop crisply
 * peeks through; leaving the cell returns it to mesh. A click anywhere
 * fades every remaining cell out from the center and dismisses the overlay.
 *
 * The visitor's name + tagline sit centered above the grid; they fade out
 * with the overlay on dismiss.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const CELL_SIZE = 64;
const EXIT_STAGGER_MS = 5;
const EXIT_FADE_MS = 360;

// Same mesh recipe as body::before in globals.css, painted fixed so each cell
// reveals the part of the gradient under its viewport position.
const CELL_BG = `
  radial-gradient(at 18% 22%, var(--mesh-a) 0%, transparent 42%),
  radial-gradient(at 82% 18%, var(--mesh-b) 0%, transparent 45%),
  radial-gradient(at 50% 88%, var(--mesh-c) 0%, transparent 48%),
  var(--bg)
`;

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
    const wait = reduced ? 220 : EXIT_FADE_MS + Math.min(240, total) * EXIT_STAGGER_MS;
    window.setTimeout(onComplete, wait);
  }, [onComplete, reduced, total]);

  const handleEnter = useCallback(
    (i: number) => {
      if (exiting) return;
      setHovered((cur) => {
        if (cur.has(i)) return cur;
        const next = new Set(cur);
        next.add(i);
        return next;
      });
    },
    [exiting],
  );

  const handleLeave = useCallback(
    (i: number) => {
      if (exiting) return;
      setHovered((cur) => {
        if (!cur.has(i)) return cur;
        const next = new Set(cur);
        next.delete(i);
        return next;
      });
    },
    [exiting],
  );

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
      className="fixed inset-0 z-[9999]"
      style={{
        cursor: 'pointer',
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

          let exitDelay = 0;
          if (exiting && !reduced) {
            const col = i % dims.cols;
            const row = Math.floor(i / dims.cols);
            const cx = dims.cols / 2;
            const cy = dims.rows / 2;
            const dist = Math.hypot(col - cx, row - cy);
            exitDelay = Math.min(240, Math.round(dist * EXIT_STAGGER_MS));
          }

          const opacity = exiting ? 0 : isHovered ? 0 : 1;
          const transition = exiting
            ? `opacity ${EXIT_FADE_MS}ms ease-out ${exitDelay}ms`
            : 'opacity 160ms ease-out';

          return (
            <div
              key={i}
              onPointerEnter={() => handleEnter(i)}
              onPointerLeave={() => handleLeave(i)}
              style={{
                background: CELL_BG,
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover',
                // Outer 0.5px halo of base bg absorbs subpixel gaps so the
                // desktop doesn't leak through as a 1px grid pattern.
                boxShadow:
                  'inset 0 0 24px var(--intro-halo), 0 0 0 0.5px var(--bg)',
                opacity,
                transition,
              }}
            />
          );
        })}
      </div>

      {/* Centered identity — sits above the grid; clicks pass through to cells */}
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
          EECS @ UC Berkeley. Building agentic software and voice-first interfaces.
        </p>
        <span
          className="mt-10 text-[10px] tracking-[0.3em] uppercase"
          style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
        >
          hover · tap anywhere to enter
        </span>
      </div>
    </div>
  );
}
