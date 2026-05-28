/**
 * NERV-OS audio service (Phase 4).
 *
 * A tiny singleton that wraps Howler with:
 *  - Lazy, client-only instantiation (SSR-safe — every method short-circuits
 *    when `window` is undefined).
 *  - Persistent mute state under `nerv-os:muted` (default OFF i.e. audible).
 *  - "Unlocked" gate honoured by the ambient loop: ambient does not play
 *    until the first user interaction has occurred (browser autoplay policy).
 *  - Pub/sub `subscribe(fn)` so React contexts can re-render when mute /
 *    unlock state flips.
 *
 * All audio assets are synthesised locally by `scripts/gen-sfx.sh` — there are
 * no third-party downloads and therefore no attribution requirements.
 */

import { Howl } from 'howler';

const STORAGE_KEY = 'nerv-os:muted';

type Listener = (snapshot: AudioSnapshot) => void;

export interface AudioSnapshot {
  muted: boolean;
  unlocked: boolean;
}

class AudioServiceImpl {
  private boot: Howl | null = null;
  private click: Howl | null = null;
  private close: Howl | null = null;
  private ambient: Howl | null = null;

  private muted = false;
  private unlocked = false;
  private hydrated = false;
  private listeners = new Set<Listener>();
  // Cached snapshot — same reference until muted/unlocked actually changes.
  // useSyncExternalStore compares with Object.is, so a fresh object literal
  // every call would trigger an infinite render loop.
  private cachedSnapshot: AudioSnapshot = { muted: false, unlocked: false };

  /** Idempotent client-side bootstrap. Called from the React provider. */
  hydrate(): void {
    if (this.hydrated || typeof window === 'undefined') return;
    this.hydrated = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === '1') this.muted = true;
    } catch {
      // private mode / quota — ignore.
    }
    this.emit();
  }

  // ---------- public API ----------

  playBoot(): void {
    if (!this.canPlay()) return;
    this.getBoot().play();
  }

  playClick(): void {
    if (!this.canPlay()) return;
    this.getClick().play();
  }

  playClose(): void {
    if (!this.canPlay()) return;
    this.getClose().play();
  }

  /** Begin (or resume) the looping ambient pad if appropriate. */
  startAmbient(): void {
    if (typeof window === 'undefined') return;
    if (this.muted || !this.unlocked) return;
    const a = this.getAmbient();
    if (!a.playing()) a.play();
  }

  stopAmbient(): void {
    if (typeof window === 'undefined') return;
    if (this.ambient && this.ambient.playing()) this.ambient.stop();
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
    if (next) {
      this.stopAmbient();
    } else if (this.unlocked) {
      this.startAmbient();
    }
    this.emit();
  }

  getMuted(): boolean {
    return this.muted;
  }

  getUnlocked(): boolean {
    return this.unlocked;
  }

  /**
   * Called once after the first user interaction. Flips the unlocked flag
   * and, unless muted, kicks the ambient loop. Safe to call multiple times.
   */
  markUnlocked(): void {
    if (this.unlocked) return;
    this.unlocked = true;
    if (!this.muted) this.startAmbient();
    this.emit();
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

  // ---------- internals ----------

  private canPlay(): boolean {
    if (typeof window === 'undefined') return false;
    return !this.muted;
  }

  private emit(): void {
    // Refresh the cached snapshot only when state has actually shifted.
    if (
      this.cachedSnapshot.muted !== this.muted ||
      this.cachedSnapshot.unlocked !== this.unlocked
    ) {
      this.cachedSnapshot = { muted: this.muted, unlocked: this.unlocked };
    }
    const snap = this.cachedSnapshot;
    this.listeners.forEach((fn) => fn(snap));
  }

  private getBoot(): Howl {
    if (!this.boot) {
      this.boot = new Howl({ src: ['/sfx/boot.mp3'], volume: 0.7, preload: true });
    }
    return this.boot;
  }

  private getClick(): Howl {
    if (!this.click) {
      this.click = new Howl({ src: ['/sfx/click.mp3'], volume: 0.55, preload: true });
    }
    return this.click;
  }

  private getClose(): Howl {
    if (!this.close) {
      this.close = new Howl({ src: ['/sfx/close.mp3'], volume: 0.6, preload: true });
    }
    return this.close;
  }

  private getAmbient(): Howl {
    if (!this.ambient) {
      this.ambient = new Howl({
        src: ['/sfx/ambient.mp3'],
        volume: 0.15,
        loop: true,
        preload: true,
      });
    }
    return this.ambient;
  }
}

export type AudioService = AudioServiceImpl;

export const audioService: AudioService = new AudioServiceImpl();
