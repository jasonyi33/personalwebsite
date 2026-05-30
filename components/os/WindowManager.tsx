'use client';

import dynamic from 'next/dynamic';
import { useOsStore } from '@/lib/os-store';
import type { AppId } from '@/lib/apps';
import Window from './Window';

const AboutApp = dynamic(() => import('@/components/apps/AboutApp'), { ssr: false });
const ExperienceApp = dynamic(() => import('@/components/apps/ExperienceApp'), { ssr: false });
const ProjectsApp = dynamic(() => import('@/components/apps/ProjectsApp'), { ssr: false });
const FeedApp = dynamic(() => import('@/components/apps/FeedApp'), { ssr: false });
const InterestsApp = dynamic(() => import('@/components/apps/InterestsApp'), { ssr: false });

function renderApp(appId: AppId) {
  switch (appId) {
    case 'about':
      return <AboutApp />;
    case 'experience':
      return <ExperienceApp />;
    case 'projects':
      return <ProjectsApp />;
    case 'feed':
      return <FeedApp />;
    case 'interests':
      return <InterestsApp />;
  }
}

export default function WindowManager() {
  const windows = useOsStore((s) => s.windows);
  const hydrated = useOsStore((s) => s.hydrated);

  if (!hydrated) return null;

  const visible = windows.filter((w) => !w.minimized);

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
