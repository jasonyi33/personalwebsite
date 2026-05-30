/**
 * Audio service — slimmed down to window-open/close click cues only.
 *
 * Lazy, client-only Howl instances. Persistent mute under `theme-audio:muted`.
 * Pub/sub `subscribe` for React contexts using `useSyncExternalStore`.
 */

import { Howl } from 'howler';

const STORAGE_KEY = 'theme-audio:muted';

type Listener = (snapshot: AudioSnapshot) => void;

export interface AudioSnapshot {
  muted: boolean;
}

class AudioServiceImpl {
  private click: Howl | null = null;
  private close: Howl | null = null;

  private muted = false;
  private hydrated = false;
  private listeners = new Set<Listener>();
  private cachedSnapshot: AudioSnapshot = { muted: false };

  hydrate(): void {
    if (this.hydrated || typeof window === 'undefined') return;
    this.hydrated = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === '1') this.muted = true;
    } catch {
      /* ignore */
    }
    this.emit();
  }

  playClick(): void {
    if (!this.canPlay()) return;
    this.getClick().play();
  }

  playClose(): void {
    if (!this.canPlay()) return;
    this.getClose().play();
  }

  setMuted(next: boolean): void {
    if (this.muted === next) return;
    this.muted = next;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
    }
    this.emit();
  }

  getMuted(): boolean {
    return this.muted;
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  snapshot(): AudioSnapshot {
    return this.cachedSnapshot;
  }

  private canPlay(): boolean {
    if (typeof window === 'undefined') return false;
    return !this.muted;
  }

  private emit(): void {
    if (this.cachedSnapshot.muted !== this.muted) {
      this.cachedSnapshot = { muted: this.muted };
    }
    const snap = this.cachedSnapshot;
    this.listeners.forEach((fn) => fn(snap));
  }

  private getClick(): Howl {
    if (!this.click) {
      this.click = new Howl({ src: ['/sfx/click.mp3'], volume: 0.45, preload: true });
    }
    return this.click;
  }

  private getClose(): Howl {
    if (!this.close) {
      this.close = new Howl({ src: ['/sfx/close.mp3'], volume: 0.5, preload: true });
    }
    return this.close;
  }
}

export type AudioService = AudioServiceImpl;

export const audioService: AudioService = new AudioServiceImpl();
