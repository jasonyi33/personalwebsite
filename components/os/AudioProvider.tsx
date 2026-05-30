'use client';

/**
 * Audio context provider — keeps window-click cues with a mute toggle.
 * No boot chime, no ambient loop, no autoplay-unlock hint.
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
  setMuted: (next: boolean) => void;
  audio: AudioService;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

function subscribe(fn: () => void): () => void {
  return audioService.subscribe(fn);
}

function getSnapshot(): { muted: boolean } {
  return audioService.snapshot();
}

const SERVER_SNAPSHOT: { muted: boolean } = Object.freeze({ muted: false });

function getServerSnapshot(): { muted: boolean } {
  return SERVER_SNAPSHOT;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    audioService.hydrate();
  }, []);

  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setMuted = useCallback((next: boolean) => {
    audioService.setMuted(next);
  }, []);

  const value = useMemo<AudioContextValue>(
    () => ({
      muted: snap.muted,
      setMuted,
      audio: audioService,
    }),
    [snap.muted, setMuted],
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    throw new Error('useAudio() must be used inside <AudioProvider>.');
  }
  return ctx;
}
