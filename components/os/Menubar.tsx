'use client';

/**
 * Top menubar (28px). Persistent recruiter spine.
 *
 * Left: identity line (Jason Yi · AI Product Engineer · Berkeley EECS),
 *       collapses to just "Jason Yi" on narrow viewports.
 * Right: Resume + Email shortcuts → clock → theme toggle → mute toggle.
 */

import { useEffect, useState } from 'react';
import { useAudio } from '@/components/os/AudioProvider';
import { useTheme } from '@/components/os/ThemeProvider';

const EMAIL = 'jasonyi2023@gmail.com';

export default function Menubar() {
  const { muted, setMuted } = useAudio();
  const { theme, toggle } = useTheme();

  const [now, setNow] = useState<string>('');
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setNow(
        `${d.getHours().toString().padStart(2, '0')}:${d
          .getMinutes()
          .toString()
          .padStart(2, '0')}`,
      );
    };
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[1000] flex h-7 items-center justify-between gap-3 border-b px-3 text-[11px]"
      style={{
        background: 'var(--surface)',
        backdropFilter: 'blur(20px) saturate(140%)',
        WebkitBackdropFilter: 'blur(20px) saturate(140%)',
        borderColor: 'var(--border)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <span
        className="min-w-0 truncate"
        style={{ color: 'var(--text)' }}
      >
        <span>Jason Yi</span>
        <span className="hidden md:inline" style={{ color: 'var(--text-dim)' }}>
          {' · '}AI Product Engineer{' · '}Berkeley EECS
        </span>
      </span>

      <div className="flex shrink-0 items-center gap-3">
        <a
          href="/recruiter"
          className="hidden sm:inline-flex items-center gap-1 rounded px-1.5 py-0.5 transition-colors hover:bg-[var(--accent-2)]"
          style={{ color: 'var(--text)' }}
        >
          Resume <span aria-hidden style={{ color: 'var(--text-dim)' }}>↗</span>
        </a>
        <a
          href={`mailto:${EMAIL}`}
          className="hidden sm:inline-flex items-center rounded px-1.5 py-0.5 transition-colors hover:bg-[var(--accent-2)]"
          style={{ color: 'var(--text)' }}
        >
          Email
        </a>

        <span style={{ color: 'var(--text-dim)' }} aria-label={`Time ${now}`}>
          {now}
        </span>
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          className="grid h-5 w-5 place-items-center rounded transition-colors hover:text-[var(--text)]"
          style={{ color: 'var(--text-dim)' }}
        >
          {theme === 'dark' ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={() => setMuted(!muted)}
          aria-pressed={muted}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="grid h-5 w-5 place-items-center rounded transition-colors hover:text-[var(--text)]"
          style={{ color: muted ? 'var(--text-faint)' : 'var(--text-dim)' }}
        >
          {muted ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M11 5L6 9H3v6h3l5 4z" />
              <path d="M22 9l-6 6M16 9l6 6" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M11 5L6 9H3v6h3l5 4z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
