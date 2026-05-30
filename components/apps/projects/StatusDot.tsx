'use client';

import type { Project } from 'contentlayer/generated';

type Status = Project['status'];

interface Props {
  status: Status;
  size?: number;
}

const COLOR: Record<Status, string> = {
  live: 'var(--status-live)',
  wip: 'var(--status-wip)',
  archived: 'var(--status-arch)',
};

export default function StatusDot({ status, size = 7 }: Props) {
  return (
    <span
      aria-label={`status: ${status}`}
      title={status}
      className="inline-block rounded-full"
      style={{
        width: size,
        height: size,
        background: COLOR[status],
      }}
    />
  );
}
