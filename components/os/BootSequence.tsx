'use client';

/**
 * BootSequence — first-visit intro. Centered "jasonyi.live" text fades in,
 * a thin progress line draws underneath, then onComplete fires.
 *
 * Total: ~1.8s. prefers-reduced-motion → 250ms cross-fade.
 */

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const TEXT_FADE_MS = 500;
const LINE_DRAW_MS = 1100;
const HOLD_MS = 200;
const TOTAL = TEXT_FADE_MS + LINE_DRAW_MS + HOLD_MS;
const REDUCED_MS = 250;

export default function BootSequence({ onComplete }: Props) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const id = window.setTimeout(onComplete, reduced ? REDUCED_MS : TOTAL);
    return () => window.clearTimeout(id);
  }, [reduced, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? REDUCED_MS / 1000 : 0.25 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      role="dialog"
      aria-label="Loading"
    >
      <button
        type="button"
        onClick={onComplete}
        className="absolute right-4 top-4 text-[10px] tracking-[0.2em] uppercase transition-colors hover:text-[var(--text)]"
        style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
        aria-label="Skip intro"
      >
        skip
      </button>

      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : TEXT_FADE_MS / 1000, ease: 'easeOut' }}
        className="text-[28px] font-medium tracking-tight"
        style={{ color: 'var(--text)', fontFamily: 'var(--font-sans)' }}
      >
        jasonyi.live
      </motion.div>

      <div
        className="mt-6 h-px overflow-hidden"
        style={{ width: 200, background: 'var(--border)' }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{
            duration: reduced ? 0 : LINE_DRAW_MS / 1000,
            delay: reduced ? 0 : TEXT_FADE_MS / 1000,
            ease: 'easeInOut',
          }}
          style={{ height: '100%', background: 'var(--accent)' }}
        />
      </div>
    </motion.div>
  );
}
