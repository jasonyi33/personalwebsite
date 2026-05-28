'use client';

/**
 * NERV-OS audio context provider (Phase 4).
 *
 * Wraps the app shell. Responsibilities:
 *  - Hydrate the mute preference from localStorage on mount.
 *  - Attach a one-shot global listener for `pointerdown` / `keydown` to flip
 *    the audio service into the "unlocked" state. Browsers require a real
 *    user gesture before any audio element can play, so the ambient loop is
 *    gated on this unlock event.
 *  - Render a small persistent cyan-dim hint pinned to the top-right of the
 *    viewport while audio is locked and the user has not muted. The hint
 *    self-dismisses on first interaction.
 *  - Expose `useAudio()` returning the mute toggle and the singleton service.
 *
 * The provider holds zero audio logic of its own — it simply mediates between
 * the singleton in `lib/audio.ts` and React.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { audioService, type AudioService } from '@/lib/audio';

interface AudioContextValue {
  muted: boolean;
  unlocked: boolean;
  setMuted: (next: boolean) => void;
  audio: AudioService;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

function subscribe(fn: () => void): () => void {
  return audioService.subscribe(fn);
}

function getSnapshot(): { muted: boolean; unlocked: boolean } {
  return audioService.snapshot();
}

// Frozen at module scope so React's Object.is check passes across calls.
const SERVER_SNAPSHOT: { muted: boolean; unlocked: boolean } = Object.freeze({
  muted: false,
  unlocked: false,
});

function getServerSnapshot(): { muted: boolean; unlocked: boolean } {
  return SERVER_SNAPSHOT;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  // Hydrate mute pref + boot the singleton once on mount.
  useEffect(() => {
    audioService.hydrate();
  }, []);

  // Attach a one-shot unlock listener for the first real user gesture.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (audioService.getUnlocked()) return;

    const unlock = () => {
      audioService.markUnlocked();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: false });
    window.addEventListener('keydown', unlock, { once: false });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  // Re-render whenever the singleton emits.
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setMuted = useCallback((next: boolean) => {
    audioService.setMuted(next);
  }, []);

  const value = useMemo<AudioContextValue>(
    () => ({
      muted: snap.muted,
      unlocked: snap.unlocked,
      setMuted,
      audio: audioService,
    }),
    [snap.muted, snap.unlocked, setMuted],
  );

  const showHint = !snap.unlocked && !snap.muted;

  return (
    <AudioCtx.Provider value={value}>
      {children}
      {showHint && <UnlockHint />}
    </AudioCtx.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    throw new Error('useAudio() must be used inside <AudioProvider>.');
  }
  return ctx;
}

function UnlockHint() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed right-3 top-9 font-[family-name:var(--font-mono)] text-[11px] tracking-widest uppercase"
      style={{
        zIndex: 9999,
        color: 'var(--nerv-cyan-dim)',
        textShadow: '0 0 8px rgba(10,126,160,0.35)',
      }}
    >
      <span aria-hidden>🔊</span> click anywhere to enable audio
    </div>
  );
}
