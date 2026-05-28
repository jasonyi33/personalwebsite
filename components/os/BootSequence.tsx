'use client';

/**
 * BootSequence — the first-visit intro panel (spec §4).
 *
 * Renders a centered translucent rounded panel (same chrome as Window.tsx)
 * over the existing starfield wallpaper. Inside the panel: NERV logo
 * fade-in → "INITIALIZING..." with blinking cursor → horizontal progress
 * bar filling 0→100% → final flash, then `onComplete` fires.
 *
 * - Total runtime ≈ 3.5s (0.6s logo fade + 2.5s progress + 0.4s flash).
 * - Honours `prefers-reduced-motion`: collapses to a 400ms cross-fade and
 *   still calls onComplete + writes the localStorage flag.
 * - Top-right `SKIP →` link finishes immediately.
 *
 * NB: This component does NOT itself write the localStorage flag — that
 * lives in `useBoot().finish()` which is what `onComplete` is wired to.
 * Keeping the side-effect in one place keeps the contract clean.
 */

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import NervLogo from './NervLogo';
import { useAudio } from './AudioProvider';

interface Props {
  onComplete: () => void;
}

const PROGRESS_MS = 2500;
const LOGO_FADE_MS = 600;
const FLASH_MS = 400;
const REDUCED_MS = 400;

export default function BootSequence({ onComplete }: Props) {
  const reduced = useReducedMotion();
  const { audio } = useAudio();
  const [progress, setProgress] = useState(0);
  const [flashing, setFlashing] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);
  const year = new Date().getFullYear();

  // Boot chime — fires once on mount. No-op while muted or before user unlocks audio.
  useEffect(() => {
    audio.playBoot();
  }, [audio]);

  // Blinking underscore cursor (250ms blink). Disabled under reduced motion.
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setCursorOn((v) => !v), 250);
    return () => window.clearInterval(id);
  }, [reduced]);

  // Drive the boot timeline.
  useEffect(() => {
    if (reduced) {
      const id = window.setTimeout(onComplete, REDUCED_MS);
      return () => window.clearTimeout(id);
    }

    // Wait for the logo fade to land, then begin filling the bar.
    const startId = window.setTimeout(() => setProgress(100), LOGO_FADE_MS);
    // After fill completes, flash white briefly, then finish.
    const flashId = window.setTimeout(() => setFlashing(true), LOGO_FADE_MS + PROGRESS_MS);
    const doneId = window.setTimeout(onComplete, LOGO_FADE_MS + PROGRESS_MS + FLASH_MS);

    return () => {
      window.clearTimeout(startId);
      window.clearTimeout(flashId);
      window.clearTimeout(doneId);
    };
  }, [reduced, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? REDUCED_MS / 1000 : 0.3 }}
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      role="dialog"
      aria-label="JASON-OS boot sequence"
    >
      <div
        className="relative flex flex-col overflow-hidden rounded-[8px] border"
        style={{
          width: 'min(480px, calc(100vw - 32px))',
          height: 320,
          background: 'rgba(14, 18, 28, 0.78)',
          backdropFilter: 'blur(14px) saturate(140%)',
          WebkitBackdropFilter: 'blur(14px) saturate(140%)',
          borderColor: 'rgba(255,255,255,0.10)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Header strip — mirrors Window.tsx title bar (decorative only). */}
        <div
          className="flex h-9 shrink-0 items-center justify-between px-2"
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <DecoPill label="«" />
              <DecoPill label="+" />
              <DecoPill label="»" />
            </div>
            <span
              className="font-[family-name:var(--font-mono)] text-[12px] tracking-widest"
              style={{ color: 'var(--nerv-bone)' }}
            >
              NERV_Terminal
            </span>
          </div>
          <span
            className="pr-1 font-[family-name:var(--font-mono)] text-[11px] tracking-widest"
            style={{ color: 'var(--nerv-bone-dim)' }}
          >
            MUTE
          </span>
        </div>

        {/* SKIP link — top right inside the body. */}
        <button
          type="button"
          onClick={onComplete}
          className="absolute right-3 top-[42px] z-10 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.25em] transition-colors hover:brightness-150"
          style={{ color: 'var(--nerv-cyan-dim)' }}
          aria-label="Skip boot sequence"
        >
          SKIP →
        </button>

        {/* Body */}
        <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduced ? 0 : LOGO_FADE_MS / 1000, ease: 'easeOut' }}
          >
            <NervLogo size={96} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: reduced ? 0 : 0.4,
              delay: reduced ? 0 : LOGO_FADE_MS / 1000,
            }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="font-[family-name:var(--font-mono)] text-[14px] tracking-widest"
              style={{ color: 'var(--nerv-cyan)' }}
            >
              INITIALIZING
              <span aria-hidden="true">...</span>
              <span
                aria-hidden="true"
                style={{ opacity: reduced ? 1 : cursorOn ? 1 : 0, marginLeft: 2 }}
              >
                _
              </span>
            </div>

            {/* Progress bar */}
            <div
              className="relative overflow-hidden"
              style={{
                width: 240,
                height: 4,
                background: 'var(--nerv-cyan-dim)',
                borderRadius: 1,
              }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{
                  duration: reduced ? 0 : PROGRESS_MS / 1000,
                  ease: 'linear',
                }}
                style={{
                  height: '100%',
                  background: 'var(--nerv-cyan)',
                  boxShadow: '0 0 8px rgba(255,255,255,0.55), 0 0 4px rgba(0,207,255,0.9)',
                }}
              />
              {/* Final white flash overlay. */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: flashing ? 1 : 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#ffffff',
                  pointerEvents: 'none',
                }}
              />
            </div>

            <div
              className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.25em]"
              style={{ color: 'var(--nerv-cyan-dim)' }}
            >
              © 2015–{year} NERV
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function DecoPill({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[12px] leading-none"
      style={{
        background: '#3A3F4B',
        color: '#cfd6e4',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      {label}
    </span>
  );
}
