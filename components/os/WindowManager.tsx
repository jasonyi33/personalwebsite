'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useOsStore } from '@/lib/os-store';
import { APP_MAP, type AppId } from '@/lib/apps';
import Window from './Window';

const TerminalApp = dynamic(() => import('@/components/apps/TerminalApp'), { ssr: false });
const ProjectsApp = dynamic(() => import('@/components/apps/ProjectsApp'), { ssr: false });
const BlogApp = dynamic(() => import('@/components/apps/BlogApp'), { ssr: false });
const AboutApp = dynamic(() => import('@/components/apps/AboutApp'), { ssr: false });
const NowApp = dynamic(() => import('@/components/apps/NowApp'), { ssr: false });
const SettingsApp = dynamic(() => import('@/components/apps/SettingsApp'), { ssr: false });
const ReadmeApp = dynamic(() => import('@/components/apps/ReadmeApp'), { ssr: false });

function renderApp(appId: AppId) {
  switch (appId) {
    case 'terminal': return <TerminalApp />;
    case 'projects': return <ProjectsApp />;
    case 'blog': return <BlogApp />;
    case 'about': return <AboutApp />;
    case 'now': return <NowApp />;
    case 'settings': return <SettingsApp />;
    case 'readme': return <ReadmeApp />;
  }
}

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return mobile;
}

export default function WindowManager() {
  const windows = useOsStore((s) => s.windows);
  const hydrated = useOsStore((s) => s.hydrated);
  const isMobile = useIsMobile();

  if (!hydrated) return null;

  const visible = windows.filter((w) => !w.minimized);

  if (isMobile) {
    const top = visible.reduce<typeof visible[number] | null>(
      (acc, w) => (acc == null || w.z > acc.z ? w : acc),
      null,
    );
    if (!top) return null;
    return (
      <div
        className="fixed inset-x-0 bottom-16 top-7 z-10 overflow-hidden"
        style={{
          background: 'rgba(14,18,28,0.9)',
          backdropFilter: 'blur(14px) saturate(140%)',
          WebkitBackdropFilter: 'blur(14px) saturate(140%)',
        }}
      >
        {renderApp(top.appId)}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-10">
      {visible.map((w) => (
        <Window key={w.id} windowState={w}>
          {renderApp(w.appId)}
        </Window>
      ))}
    </div>
  );
}
