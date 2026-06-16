'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { useNavAnchors, type AnchorRect } from './NavAnchorContext';

const DURATION_OUT = 0.18;
const DURATION_IN = 0.22;
const SCALE_MIN = 0.86;

function originStyle(rect: AnchorRect | undefined): React.CSSProperties {
  if (!rect) return { transformOrigin: '50% 50%' };
  if (typeof window === 'undefined') return { transformOrigin: '50% 50%' };
  const ox = (rect.x / window.innerWidth) * 100;
  const oy = (rect.y / window.innerHeight) * 100;
  return { transformOrigin: `${ox}% ${oy}%` };
}

export default function TransitionShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { read, originKey, setOriginKey } = useNavAnchors();
  const reduce = useReducedMotion();

  // Snapshot the origin at mount so we can clear it from context immediately.
  const enterOriginRef = useRef<AnchorRect | undefined>(undefined);
  if (enterOriginRef.current === undefined) {
    enterOriginRef.current = originKey ? read(originKey) : undefined;
  }

  useEffect(() => {
    enterOriginRef.current = originKey ? read(originKey) : undefined;
    setOriginKey(undefined);
    // We intentionally only depend on pathname.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const enterStyle = useMemo(
    // eslint-disable-next-line react-hooks/refs
    () => originStyle(enterOriginRef.current),
    // pathname change re-computes enter origin above
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname],
  );

  if (reduce) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.main
        key={pathname}
        className="flex-1"
        style={{
          willChange: 'transform, opacity, border-radius, box-shadow',
          ...enterStyle,
        }}
        initial={{
          opacity: 0,
          scale: SCALE_MIN,
          borderRadius: 'var(--window-radius)',
          boxShadow: 'var(--window-shadow)',
        }}
        animate={{
          opacity: 1,
          scale: 1,
          borderRadius: '0px',
          boxShadow: '0 0 0 rgba(0,0,0,0)',
          transition: {
            duration: DURATION_IN,
            ease: [0.22, 1, 0.36, 1],
            borderRadius: { duration: DURATION_IN * 0.9 },
            boxShadow: { duration: DURATION_IN * 0.9 },
          },
        }}
        exit={{
          opacity: 0,
          scale: SCALE_MIN,
          borderRadius: 'var(--window-radius)',
          boxShadow: 'var(--window-shadow)',
          transition: {
            duration: DURATION_OUT,
            ease: [0.4, 0, 1, 1],
          },
        }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
