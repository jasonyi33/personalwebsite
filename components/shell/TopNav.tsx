'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useNavAnchors } from './NavAnchorContext';

interface Tab {
  href: string;
  label: string;
}

const TABS: readonly Tab[] = [
  { href: '/experience', label: 'experience' },
  { href: '/projects', label: 'projects' },
  { href: '/writing', label: 'writing' },
  { href: '/resume', label: 'resume' },
];

function rectFor(el: HTMLElement): { x: number; y: number; w: number; h: number } {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
}

export default function TopNav() {
  const pathname = usePathname();
  const { register, setOriginKey } = useNavAnchors();
  const tabRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const wordmarkRef = useRef<HTMLAnchorElement | null>(null);

  // Re-register rects after layout + on resize. We register positions in viewport coords;
  // the page wrapper consumes them at click time, so resize is the only thing that needs handling.
  useEffect(() => {
    const sync = () => {
      tabRefs.current.forEach((el, key) => register(key, rectFor(el)));
      if (wordmarkRef.current) register('/', rectFor(wordmarkRef.current));
    };
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [register]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur"
      style={{
        background: 'color-mix(in oklab, var(--bg) 78%, transparent)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <nav className="mx-auto flex w-full max-w-[1080px] items-center justify-between px-6 py-4">
        <Link
          ref={wordmarkRef}
          href="/"
          onClick={() => setOriginKey('/')}
          className="text-[14px] font-semibold tracking-[0.04em] uppercase"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
        >
          Jason Yi
        </Link>

        <ul className="flex items-center gap-1 sm:gap-2">
          {TABS.map((t) => {
            const active = isActive(t.href);
            return (
              <li key={t.href}>
                <Link
                  ref={(el: HTMLAnchorElement | null) => {
                    if (el) tabRefs.current.set(t.href, el);
                    else tabRefs.current.delete(t.href);
                  }}
                  href={t.href}
                  onClick={() => setOriginKey(t.href)}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] tracking-[0.04em] transition-colors sm:text-[13px]"
                  style={{
                    color: active ? 'var(--accent)' : 'var(--text-dim)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{
                      background: active ? 'var(--accent)' : 'transparent',
                      transition: 'background 180ms',
                    }}
                  />
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
