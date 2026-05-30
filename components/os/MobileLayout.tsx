'use client';

/**
 * Mobile layout — scrolling sections + iOS-style bottom tab bar.
 * Activated below 768px in place of the OS desktop shell.
 */

import { useEffect, useRef, useState } from 'react';
import { APPS, type AppId } from '@/lib/apps';
import AppIcon from './AppIcon';
import AboutApp from '@/components/apps/AboutApp';
import ExperienceApp from '@/components/apps/ExperienceApp';
import ProjectsApp from '@/components/apps/ProjectsApp';
import FeedApp from '@/components/apps/FeedApp';
import InterestsApp from '@/components/apps/InterestsApp';
import { useTheme } from './ThemeProvider';

const SECTION_RENDERERS: Record<AppId, React.ComponentType> = {
  about: AboutApp,
  experience: ExperienceApp,
  projects: ProjectsApp,
  feed: FeedApp,
  interests: InterestsApp,
};

export default function MobileLayout() {
  const { theme, toggle } = useTheme();
  const [active, setActive] = useState<AppId>('about');
  const refs = useRef<Record<string, HTMLElement | null>>({});

  // Update active tab as the user scrolls.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const id = (visible.target as HTMLElement).dataset.appId as AppId | undefined;
          if (id) setActive(id);
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleTab = (id: AppId) => {
    setActive(id);
    refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="mobile-shell flex min-h-screen flex-col">
      {/* Top bar */}
      <header
        className="sticky top-0 z-30 flex h-12 items-center justify-between border-b px-4"
        style={{
          background: 'var(--surface-2)',
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          borderColor: 'var(--border)',
        }}
      >
        <span
          className="text-[13px]"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}
        >
          jasonyi.live
        </span>
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          className="grid h-8 w-8 place-items-center rounded transition-colors"
          style={{ color: 'var(--text-dim)' }}
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          )}
        </button>
      </header>

      {/* Sections */}
      <main className="flex-1 pb-20">
        {APPS.map((app) => {
          const Section = SECTION_RENDERERS[app.id];
          return (
            <section
              key={app.id}
              data-app-id={app.id}
              ref={(el) => {
                refs.current[app.id] = el;
              }}
              className="border-b"
              style={{
                minHeight: '70vh',
                borderColor: 'var(--border)',
              }}
            >
              <div
                className="px-5 pt-6 pb-3 text-[11px] tracking-wide"
                style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
              >
                {app.dockLabel}
              </div>
              <div className="min-h-[60vh]">
                <Section />
              </div>
            </section>
          );
        })}
      </main>

      {/* Bottom tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around border-t px-2"
        style={{
          background: 'var(--surface-2)',
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          borderColor: 'var(--border)',
        }}
      >
        {APPS.map((app) => {
          const isActive = active === app.id;
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => handleTab(app.id)}
              aria-label={app.title}
              className="flex flex-1 flex-col items-center gap-0.5 rounded-md py-1"
              style={{ color: isActive ? 'var(--text)' : 'var(--text-dim)' }}
            >
              <AppIcon kind={app.icon} size={20} />
              <span
                className="text-[9px] tracking-wide"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {app.dockLabel}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
