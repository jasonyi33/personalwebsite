'use client';

/**
 * NERV_Terminal — the signature app (spec 5.5).
 *
 * Renders only the BODY of the window (the OS shell supplies chrome). Two-
 * column layout on desktop: rotating wireframe sphere on the left, data
 * readout on the right, full-width terminal chat across the bottom. On
 * narrow viewports we stack vertically: sphere → readout → chat.
 */

import { useEffect, useState } from 'react';
import WireframeSphere from './terminal/WireframeSphere';
import SphereReadout from './terminal/SphereReadout';
import TerminalChat from './terminal/TerminalChat';

function useIsNarrow(): boolean {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return narrow;
}

export default function TerminalApp() {
  const narrow = useIsNarrow();

  if (narrow) {
    return (
      <div className="flex h-full w-full flex-col gap-3 p-4">
        <div className="h-[200px] w-full shrink-0">
          <WireframeSphere />
          <div
            className="mt-1 text-center text-[10px] tracking-[0.3em] uppercase"
            style={{ color: 'var(--nerv-cyan-dim)' }}
          >
            MAGI-01 // ACTIVE
          </div>
        </div>
        <div className="shrink-0">
          <SphereReadout />
        </div>
        <div className="min-h-0 flex-1">
          <TerminalChat />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 p-5">
      {/* Top row: sphere + readout */}
      <div className="flex min-h-0 flex-1 gap-5">
        {/* Left column ~45% */}
        <div
          className="relative flex shrink-0 grow-0 flex-col"
          style={{ flexBasis: '45%', minWidth: 280 }}
        >
          <div className="relative min-h-0 flex-1">
            <WireframeSphere />
          </div>
          <div
            className="pt-2 text-center text-[10px] tracking-[0.3em] uppercase"
            style={{ color: 'var(--nerv-cyan-dim)' }}
          >
            MAGI-01 // ACTIVE
          </div>
        </div>

        {/* Right column ~55% */}
        <div className="min-w-0 flex-1">
          <SphereReadout />
        </div>
      </div>

      {/* Bottom: chat, ~40% of body */}
      <div
        className="min-h-0 shrink-0"
        style={{ flexBasis: '40%' }}
      >
        <TerminalChat />
      </div>
    </div>
  );
}
