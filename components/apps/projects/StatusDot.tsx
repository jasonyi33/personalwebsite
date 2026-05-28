'use client';

/**
 * StatusDot — small color-coded indicator for project status.
 * green=live, amber=wip, red=archived.
 */

import type { Project } from 'contentlayer/generated';

type Status = Project['status'];

interface Props {
  status: Status;
  size?: number;
}

const COLOR: Record<Status, string> = {
  live: 'var(--nerv-green)',
  wip: 'var(--nerv-amber)',
  archived: 'var(--nerv-red)',
};

const GLOW: Record<Status, string> = {
  live: '0 0 6px rgba(76,255,175,0.7)',
  wip: '0 0 6px rgba(247,201,72,0.7)',
  archived: '0 0 6px rgba(229,37,42,0.7)',
};

export default function StatusDot({ status, size = 8 }: Props) {
  return (
    <span
      aria-label={`status: ${status}`}
      title={status}
      className="inline-block rounded-full"
      style={{
        width: size,
        height: size,
        background: COLOR[status],
        boxShadow: GLOW[status],
      }}
    />
  );
}
