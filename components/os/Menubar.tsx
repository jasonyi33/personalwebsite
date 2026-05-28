'use client';

/**
 * Top menubar (28px). Translucent strip pinned to the top of the viewport.
 *  - Left: tiny "0.00" style cyan-dim readout (a placeholder version glyph
 *    that will get its actual semantic in later phases).
 *  - Right: MUTE text-button toggling shell-level mute state.
 */

import { useEffect, useState } from 'react';
import { useAudio } from '@/components/os/AudioProvider';

export default function Menubar() {
  const { muted, setMuted } = useAudio();
  const toggleMute = () => setMuted(!muted);

  // Lightweight ticking readout — `0.00` style number rolling slowly.
  // Looks like a frame counter / load metric without committing to one yet.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % 100000), 1000);
    return () => window.clearInterval(id);
  }, []);

  const readout = (tick / 100).toFixed(2);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[1000] flex h-7 items-center justify-between border-b px-3 font-[family-name:var(--font-mono)] text-[11px] tracking-widest"
      style={{
        background: 'rgba(6, 8, 20, 0.6)',
        backdropFilter: 'blur(14px) saturate(140%)',
        WebkitBackdropFilter: 'blur(14px) saturate(140%)',
        borderColor: 'var(--nerv-panel-edge)',
      }}
    >
      <div className="flex items-center gap-3">
        <span style={{ color: 'var(--nerv-cyan-dim)' }}>{readout}</span>
        <span style={{ color: 'var(--nerv-bone-dim)' }}>JASON-OS</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleMute}
          className="uppercase transition-colors"
          style={{
            color: muted ? 'var(--nerv-red)' : 'var(--nerv-bone-dim)',
          }}
          aria-pressed={muted}
        >
          {muted ? 'UNMUTE' : 'MUTE'}
        </button>
      </div>
    </div>
  );
}
