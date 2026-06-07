'use client';

/**
 * Window — draggable shell with macOS-style traffic-light controls.
 *
 * Layout:
 *   [ • • • ]              <title>
 *   ----------------------------------
 *   <body>
 *
 * Motion: scale 0.96 -> 1 + fade, 220ms ease-out-quart. prefers-reduced-motion
 * collapses to instant. Drag uses framer-motion spring.
 */

import { useEffect, type ReactNode } from 'react';
import { motion, useDragControls, useReducedMotion } from 'framer-motion';
import { useOsStore, type WindowState } from '@/lib/os-store';
import { APP_MAP } from '@/lib/apps';
import { useAudio } from '@/components/os/AudioProvider';

interface Props {
  windowState: WindowState;
  children: ReactNode;
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
  const resizeWindow = useOsStore((s) => s.resizeWindow);

  const { audio } = useAudio();

  useEffect(() => {
    audio.playClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    audio.playClose();
    closeWindow(id);
  };

  const handleMaximize = () => {
    if (typeof window === 'undefined') return;
    const maxW = window.innerWidth - 32;
    const maxH = window.innerHeight - 80;
    resizeWindow(id, maxW, maxH);
    moveWindow(id, 16, 40);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={{
        left: -x + (80 - w),
        top: -y + 32,
        right: typeof window !== 'undefined' ? window.innerWidth - x - 80 : 2000,
        bottom: typeof window !== 'undefined' ? window.innerHeight - y - 40 : 2000,
      }}
      initial={reduced ? false : { scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={reduced ? undefined : { scale: 0.97, opacity: 0 }}
      transition={{
        duration: reduced ? 0 : 0.22,
        ease: [0.165, 0.84, 0.44, 1],
      }}
      onDragEnd={(_, info) => {
        const vw = typeof window !== 'undefined' ? window.innerWidth : 2000;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 2000;
        const nextX = Math.min(vw - 80, Math.max(80 - w, x + info.offset.x));
        const nextY = Math.min(vh - 40, Math.max(32, y + info.offset.y));
        moveWindow(id, nextX, nextY);
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
        className="relative flex h-full w-full flex-col overflow-hidden rounded-[10px] border"
        style={{
          background: 'var(--surface)',
          backdropFilter: 'blur(24px) saturate(140%)',
          WebkitBackdropFilter: 'blur(24px) saturate(140%)',
          borderColor: focused ? 'var(--border-2)' : 'var(--border)',
          boxShadow: focused
            ? '0 24px 60px rgba(0,0,0,0.45), 0 0 0 0.5px rgba(255,255,255,0.06) inset'
            : '0 16px 40px rgba(0,0,0,0.32)',
          transition: 'border-color 120ms ease, box-shadow 120ms ease',
        }}
      >
        {/* Title bar — drag handle */}
        <div
          onPointerDown={(e) => dragControls.start(e)}
          onDoubleClick={handleMaximize}
          className="relative flex h-8 shrink-0 cursor-grab items-center px-3 active:cursor-grabbing"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          {/* Traffic lights */}
          <div className="flex items-center gap-[6px]">
            <TrafficLight color="var(--tl-red)" symbol="×" onClick={handleClose} label="Close" />
            <TrafficLight color="var(--tl-yellow)" symbol="−" onClick={() => minimizeWindow(id)} label="Minimize" />
            <TrafficLight color="var(--tl-green)" symbol="+" onClick={handleMaximize} label="Maximize" />
          </div>

          {/* Centered title */}
          <div className="pointer-events-none absolute inset-x-0 flex justify-center">
            <span
              className="text-[12px] font-medium tracking-tight"
              style={{
                color: focused ? 'var(--text)' : 'var(--text-dim)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {def.title}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </motion.div>
  );
}

function TrafficLight({
  color,
  symbol,
  onClick,
  label,
}: {
  color: string;
  symbol: string;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      aria-label={label}
      className="group flex h-[12px] w-[12px] items-center justify-center rounded-full transition-transform hover:scale-110"
      style={{
        background: color,
        boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.18)',
      }}
    >
      <span
        className="text-[9px] leading-none opacity-0 transition-opacity group-hover:opacity-90"
        style={{ color: 'rgba(0,0,0,0.65)' }}
        aria-hidden
      >
        {symbol}
      </span>
    </button>
  );
}
