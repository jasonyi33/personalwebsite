'use client';

import type { Project } from 'contentlayer/generated';
import ProjectDetail from '@/components/apps/projects/ProjectDetail';

interface Props {
  project: Project;
}

export default function ProjectDetailShell({ project }: Props) {
  return <ProjectDetail project={project} nextProject={null} onNext={() => {}} />;
}
