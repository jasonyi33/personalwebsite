'use client';

/**
 * PREFS.cfg — Settings app (spec 5.6).
 *
 * Single-pane form with mono-styled sections:
 *  - Audio (volume + mute)
 *  - Motion (reduce-motion toggle persisted to localStorage)
 *  - Accent (three swatches mutating --nerv-cyan)
 *  - Boot (replay boot sequence)
 *  - Reset (clear all nerv-os:* keys)
 *
 * Volume tries `audio.setVolume` first; if that helper isn't exposed by the
 * audio service yet, we fall back to toggling mute when volume hits 0.
 */

import { useEffect, useState, type ChangeEvent } from 'react';
import { useAudio } from '@/components/os/AudioProvider';

type AudioServiceMaybeVolume = {
  setVolume?: (v: number) => void;
};

const ACCENTS: { id: 'cyan' | 'red' | 'amber'; label: string; color: string }[] = [
  { id: 'cyan', label: 'CYAN', color: '#00CFFF' },
  { id: 'red', label: 'RED', color: '#E5252A' },
  { id: 'amber', label: 'AMBER', color: '#F7C948' },
];

const STORAGE_KEYS = {
  volume: 'nerv-os:volume',
  reducedMotion: 'nerv-os:reduced-motion',
  accent: 'nerv-os:accent',
  booted: 'nerv-os:booted',
};

export default function SettingsApp() {
  const { muted, setMuted, audio } = useAudio();
  const [volume, setVolume] = useState<number>(60);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [accent, setAccent] = useState<string>('#00CFFF');

  // Hydrate from localStorage.
  useEffect(() => {
    try {
      const v = window.localStorage.getItem(STORAGE_KEYS.volume);
      if (v != null) {
        const n = Number(v);
        if (Number.isFinite(n) && n >= 0 && n <= 100) setVolume(n);
      }
      const rm = window.localStorage.getItem(STORAGE_KEYS.reducedMotion);
      if (rm === '1') setReducedMotion(true);
      const ac = window.localStorage.getItem(STORAGE_KEYS.accent);
      if (ac) setAccent(ac);
    } catch {
      /* ignore */
    }
  }, []);

  // Apply reduced-motion attribute on <html>.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (reducedMotion) {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    } else {
      document.documentElement.removeAttribute('data-reduced-motion');
    }
  }, [reducedMotion]);

  const handleVolume = (e: ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    setVolume(next);
    try {
      window.localStorage.setItem(STORAGE_KEYS.volume, String(next));
    } catch {
      /* ignore */
    }
    const svc = audio as unknown as AudioServiceMaybeVolume;
    if (typeof svc.setVolume === 'function') {
      svc.setVolume(next / 100);
    } else if (next === 0 && !muted) {
      setMuted(true);
    } else if (next > 0 && muted) {
      setMuted(false);
    }
  };

  const handleReducedMotion = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    setReducedMotion(next);
    try {
      window.localStorage.setItem(STORAGE_KEYS.reducedMotion, next ? '1' : '0');
    } catch {
      /* ignore */
    }
  };

  const pickAccent = (color: string) => {
    setAccent(color);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--nerv-cyan', color);
    }
    try {
      window.localStorage.setItem(STORAGE_KEYS.accent, color);
    } catch {
      /* ignore */
    }
  };

  const replayBoot = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.booted);
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  const resetAll = () => {
    if (typeof window === 'undefined') return;
    const ok = window.confirm(
      'RESET JASON-OS\n\nThis clears all jason-os:* preferences and reloads.\nContinue?',
    );
    if (!ok) return;
    try {
      const toDelete: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith('nerv-os:')) toDelete.push(key);
      }
      toDelete.forEach((k) => window.localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  return (
    <div className="h-full w-full overflow-y-auto p-5 font-[family-name:var(--font-mono)]">
      <div className="mx-auto flex max-w-[480px] flex-col gap-6 text-[12px]">
        {/* AUDIO */}
        <Section title="AUDIO">
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3">
              <span className="w-20 shrink-0" style={{ color: 'var(--nerv-bone-dim)' }}>
                VOLUME
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={handleVolume}
                className="nerv-range flex-1"
                aria-label="master volume"
              />
              <span className="w-10 text-right" style={{ color: 'var(--nerv-cyan)' }}>
                {volume}
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={muted}
                onChange={(e) => setMuted(e.target.checked)}
                className="nerv-check"
                aria-label="mute audio"
              />
              <span style={{ color: 'var(--nerv-bone)' }}>MUTE</span>
            </label>
          </div>
        </Section>

        {/* MOTION */}
        <Section title="MOTION">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={handleReducedMotion}
              className="nerv-check"
              aria-label="reduce motion"
            />
            <span style={{ color: 'var(--nerv-bone)' }}>REDUCE MOTION</span>
          </label>
        </Section>

        {/* ACCENT */}
        <Section title="ACCENT">
          <div className="flex items-center gap-3">
            {ACCENTS.map((a) => {
              const selected = accent.toLowerCase() === a.color.toLowerCase();
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => pickAccent(a.color)}
                  aria-label={`set accent ${a.label}`}
                  aria-pressed={selected}
                  className="flex flex-col items-center gap-1"
                >
                  <span
                    className="block h-7 w-7 rounded-full transition-transform"
                    style={{
                      background: a.color,
                      boxShadow: selected
                        ? `0 0 0 2px var(--nerv-bone), 0 0 12px ${a.color}`
                        : `0 0 0 1px rgba(255,255,255,0.15)`,
                      transform: selected ? 'scale(1.06)' : 'scale(1)',
                    }}
                  />
                  <span
                    className="text-[10px] tracking-[0.2em]"
                    style={{
                      color: selected ? 'var(--nerv-bone)' : 'var(--nerv-bone-dim)',
                    }}
                  >
                    {a.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* BOOT */}
        <Section title="BOOT">
          <button
            type="button"
            onClick={replayBoot}
            className="nerv-btn"
            style={{
              borderColor: 'rgba(0,207,255,0.5)',
              color: 'var(--nerv-cyan)',
            }}
          >
            REPLAY BOOT SEQUENCE
          </button>
        </Section>

        {/* RESET */}
        <Section title="RESET">
          <button
            type="button"
            onClick={resetAll}
            className="nerv-btn"
            style={{
              borderColor: 'var(--nerv-red)',
              color: 'var(--nerv-red)',
            }}
          >
            RESET JASON-OS
          </button>
        </Section>
      </div>

      <style jsx>{`
        .nerv-range {
          appearance: none;
          -webkit-appearance: none;
          height: 2px;
          background: rgba(0, 207, 255, 0.25);
          outline: none;
        }
        .nerv-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: var(--nerv-cyan);
          border: 0;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(0, 207, 255, 0.6);
        }
        .nerv-range::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: var(--nerv-cyan);
          border: 0;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(0, 207, 255, 0.6);
        }
        .nerv-check {
          appearance: none;
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          background: transparent;
          border: 1px solid rgba(0, 207, 255, 0.5);
          cursor: pointer;
          position: relative;
        }
        .nerv-check:checked {
          background: var(--nerv-cyan);
          box-shadow: 0 0 6px rgba(0, 207, 255, 0.6);
        }
        .nerv-btn {
          background: transparent;
          border: 1px solid;
          padding: 8px 14px;
          letter-spacing: 0.25em;
          font: inherit;
          cursor: pointer;
          transition: background 120ms ease, color 120ms ease;
        }
        .nerv-btn:hover {
          background: rgba(255, 255, 255, 0.04);
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3
        className="text-[11px] tracking-[0.3em] uppercase"
        style={{
          color: 'var(--nerv-cyan)',
          borderBottom: '1px solid rgba(0,207,255,0.2)',
          paddingBottom: 4,
        }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}
