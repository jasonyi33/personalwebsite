'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sortedExperiences } from '@/lib/content';
import ExperienceListItem from './experience/ExperienceListItem';
import ExperienceDetail from './experience/ExperienceDetail';

function useIsNarrow(): boolean {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return narrow;
}

export default function ExperienceApp() {
  const experiences = useMemo(() => sortedExperiences(), []);
  const [index, setIndex] = useState(0);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);
  const narrow = useIsNarrow();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('experience');
    if (!slug) return;
    const i = experiences.findIndex((e) => e.slug === slug);
    if (i >= 0) {
      setIndex(i);
      setMobileShowDetail(true);
    }
  }, [experiences]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (experiences.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIndex((i) => Math.min(experiences.length - 1, i + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (narrow) setMobileShowDetail(true);
      } else if (e.key === 'Escape') {
        if (narrow && mobileShowDetail) {
          e.preventDefault();
          setMobileShowDetail(false);
        }
      }
    },
    [experiences.length, narrow, mobileShowDetail],
  );

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  if (experiences.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <span
          className="text-[12px]"
          style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
        >
          no experience yet.
        </span>
      </div>
    );
  }

  const current = experiences[index];
  const handleSelect = (i: number) => {
    setIndex(i);
    if (narrow) setMobileShowDetail(true);
  };
  const handleBack = () => setMobileShowDetail(false);

  const showSidebar = !narrow || !mobileShowDetail;
  const showDetail = !narrow || mobileShowDetail;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex h-full w-full outline-none"
    >
      {showSidebar ? (
        <aside
          className="flex shrink-0 flex-col overflow-y-auto"
          style={{
            width: narrow ? '100%' : 260,
            borderRight: narrow ? 'none' : '1px solid var(--border)',
            background: 'rgba(0,0,0,0.06)',
          }}
        >
          <div
            className="px-3 py-2 text-[10px] tracking-wide"
            style={{
              color: 'var(--text-dim)',
              borderBottom: '1px solid var(--border)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            roles
          </div>
          <div className="flex flex-col py-1">
            {experiences.map((e, i) => (
              <ExperienceListItem
                key={e.slug}
                experience={e}
                index={i}
                selected={i === index}
                onSelect={() => handleSelect(i)}
              />
            ))}
          </div>
        </aside>
      ) : null}

      {showDetail ? (
        <div className="min-w-0 flex-1">
          <ExperienceDetail
            key={current.slug}
            experience={current}
            onBack={handleBack}
            showBack={narrow}
          />
        </div>
      ) : null}
    </div>
  );
}
