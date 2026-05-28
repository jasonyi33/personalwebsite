'use client';

/**
 * A single draggable window. State lives in `useOsStore`; this component
 * is the visual shell + drag handle. The body slot is rendered by
 * WindowManager — for Phase 2 the contents are app placeholders.
 *
 * Title bar layout matches the reference exactly:
 *   [ « + » ]   <appIcon> <title>          [MUTE] [optional status]
 *   ── 1px cyan hairline ──
 *   ● NERV   SYSTEM STATUS: NORMAL   T-MINUS HH:MM:SS
 *   ── 1px cyan hairline ──
 *   <body>
 *   bottom-left: NERV-OS V3.0 (red micro-text)
 */

import { useEffect, useReducer, type ReactNode } from 'react';
import { motion, useDragControls, useReducedMotion } from 'framer-motion';
import { useOsStore, type WindowState } from '@/lib/os-store';
import { APP_MAP } from '@/lib/apps';
import { useAudio } from '@/components/os/AudioProvider';
import AppIcon from './AppIcon';

interface Props {
  windowState: WindowState;
  children: ReactNode;
}

// Fixed launch-countdown target. Spec calls for `2030-01-01T00:00:00Z`.
const T_MINUS_TARGET = new Date('2030-01-01T00:00:00Z').getTime();

function formatHMS(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const hh = Math.floor(totalSec / 3600) % 100; // clamp to 2 digits for layout
  const mm = Math.floor((totalSec % 3600) / 60);
  const ss = totalSec % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
}

export default function Window({ windowState, children }: Props) {
  const { id, appId, x, y, w, h, z, focused } = windowState;
  const def = APP_MAP[appId];
  const reduced = useReducedMotion();
  const dragControls = useDragControls();

  const closeWindow = useOsStore((s) => s.closeWindow);
  const focusWindow = useOsStore((s) => s.focusWindow);
  const moveWindow = useOsStore((s) => s.moveWindow);
  const minimizeWindow = useOsStore((s) => s.minimizeWindow);

  const { muted, setMuted, audio } = useAudio();
  const toggleMute = () => setMuted(!muted);

  // Open SFX on mount; intentionally fires once per window instance so the
  // first paint of a freshly opened window clicks even if the audio service
  // was unlocked seconds earlier.
  useEffect(() => {
    audio.playClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    audio.playClose();
    closeWindow(id);
  };

  // Tick once a second to drive the T-MINUS readout.
  const [, tick] = useReducer((n: number) => n + 1, 0);
  useEffect(() => {
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);
  const tMinusLive = formatHMS(T_MINUS_TARGET - Date.now());

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={{
        left: -x + 0,
        top: -y + 28,
        right: typeof window !== 'undefined' ? window.innerWidth - x - 80 : 2000,
        bottom: typeof window !== 'undefined' ? window.innerHeight - y - 80 : 2000,
      }}
      initial={reduced ? false : { scale: 0.985, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.18, ease: 'easeOut' }}
      onDragEnd={(_, info) => {
        moveWindow(id, x + info.offset.x, y + info.offset.y);
      }}
      onPointerDownCapture={() => {
        if (!focused) focusWindow(id);
      }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        zIndex: z,
      }}
      className="select-none"
    >
      <div
        className="relative flex h-full w-full flex-col overflow-hidden rounded-[8px] border"
        style={{
          background: 'rgba(14, 18, 28, 0.78)',
          backdropFilter: 'blur(14px) saturate(140%)',
          WebkitBackdropFilter: 'blur(14px) saturate(140%)',
          borderColor: focused ? 'rgba(0, 207, 255, 0.28)' : 'rgba(255,255,255,0.10)',
          boxShadow: focused
            ? '0 16px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,207,255,0.10) inset'
            : '0 12px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Title bar — drag handle */}
        <div
          onPointerDown={(e) => dragControls.start(e)}
          className="flex h-9 shrink-0 cursor-grab items-center justify-between px-2 active:cursor-grabbing"
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
          }}
        >
          {/* Left: pill buttons + icon + title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <PillButton label="«" onClick={handleClose} ariaLabel="Close window" />
              <PillButton label="+" onClick={() => {}} ariaLabel="New (placeholder)" />
              <PillButton label="»" onClick={() => minimizeWindow(id)} ariaLabel="Minimize window" />
            </div>
            <div className="flex items-center gap-2">
              <AppIcon kind={def.icon} size={14} />
              <span
                className="font-[family-name:var(--font-mono)] text-[12px] tracking-widest"
                style={{ color: 'var(--nerv-bone)' }}
              >
                {def.title}
              </span>
            </div>
          </div>

          {/* Right: per-window mute + (terminal-only) security level */}
          <div className="flex items-center gap-4 pr-1 font-[family-name:var(--font-mono)] text-[11px] tracking-widest">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              style={{ color: muted ? 'var(--nerv-red)' : 'var(--nerv-bone-dim)' }}
              aria-pressed={muted}
            >
              {muted ? 'UNMUTE' : 'MUTE'}
            </button>
            {appId === 'terminal' && (
              <span style={{ color: 'var(--nerv-green)' }}>
                SECURITY LEVEL: <span className="font-semibold">MAX</span>
              </span>
            )}
          </div>
        </div>

        {/* Cyan hairline above sub-strip */}
        <div className="h-px w-full" style={{ background: 'rgba(0, 207, 255, 0.45)' }} />

        {/* Sub-strip: ● NERV  SYSTEM STATUS: NORMAL  T-MINUS HH:MM:SS */}
        <div
          className="flex h-6 shrink-0 items-center gap-6 px-3 font-[family-name:var(--font-mono)] text-[11px] tracking-widest"
          style={{ background: 'rgba(0, 207, 255, 0.05)' }}
        >
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-[7px] w-[7px] rounded-full"
              style={{ background: 'var(--nerv-red)', boxShadow: '0 0 6px rgba(229,37,42,0.8)' }}
            />
            <span style={{ color: 'var(--nerv-bone)' }}>JASON</span>
          </span>
          <span style={{ color: 'var(--nerv-bone)' }}>
            SYSTEM STATUS: <span style={{ color: 'var(--nerv-green)' }}>NORMAL</span>
          </span>
          <span style={{ color: 'var(--nerv-cyan)' }}>T-MINUS {tMinusLive}</span>
        </div>

        {/* Cyan hairline below sub-strip */}
        <div className="h-px w-full" style={{ background: 'rgba(0, 207, 255, 0.45)' }} />

        {/* Body */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          {children}
          <span
            className="pointer-events-none absolute bottom-2 left-3 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.25em]"
            style={{ color: 'var(--nerv-red)' }}
          >
            JASON-OS V3.0
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function PillButton({
  label,
  onClick,
  ariaLabel,
}: {
  label: string;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      aria-label={ariaLabel}
      className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[12px] leading-none transition-colors hover:brightness-125"
      style={{
        background: '#3A3F4B',
        color: '#cfd6e4',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      {label}
    </button>
  );
}
