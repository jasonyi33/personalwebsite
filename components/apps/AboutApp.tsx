'use client';

/**
 * PROFILE.dat — the About window (spec 5.3).
 *
 * Single-pane scrollable body composed of WHOAMI / BIO.txt / CONTACT /
 * COLOPHON sections, with a hex-clipped portrait frame at the top. The
 * portrait falls back to a minimal ASCII silhouette when no avatar field
 * is present on the About document. BIO.txt is rendered via the contentlayer
 * MDX bundle; we attempt to import the shared MDXComponents map from Phase
 * 6B but fall back to an empty map if it's not yet on disk.
 */

import { useMemo } from 'react';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { getAbout } from '@/lib/content';

// TODO(phase-6b): swap for the real MDXComponents map once
// `@/components/mdx/MDXComponents` lands. Until then we render with the
// default tag mapping, which is good enough for the placeholder bio.
type MDXComponentMap = Record<string, React.ComponentType<unknown>>;
const MDXComponents: MDXComponentMap = {};

const ASCII_SILHOUETTE = `   ______
  /      \\
 /  o  o  \\
|    __    |
|   ----   |
 \\        /
  \\______/
   |    |
   |    |
   |____|`;

interface SectionHeaderProps {
  label: string;
}

function SectionHeader({ label }: SectionHeaderProps) {
  return (
    <h2
      className="mt-6 mb-2 text-[12px] tracking-[0.18em] uppercase"
      style={{
        color: 'var(--nerv-cyan)',
        fontFamily: 'var(--font-display), var(--font-mono), monospace',
      }}
    >
      &gt; {label}
    </h2>
  );
}

interface DataRowProps {
  label: string;
  value: string;
}

function DataRow({ label, value }: DataRowProps) {
  return (
    <div className="flex gap-3 text-[13px] leading-[1.6]">
      <span style={{ color: 'var(--nerv-cyan-dim)' }}>{label}</span>
      <span style={{ color: 'var(--nerv-bone)' }}>{value}</span>
    </div>
  );
}

const HEX_CLIP =
  'polygon(25% 5%, 75% 5%, 95% 50%, 75% 95%, 25% 95%, 5% 50%)';

interface PortraitProps {
  avatar?: string;
  name: string;
}

function Portrait({ avatar, name }: PortraitProps) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: 160,
        height: 160,
        clipPath: HEX_CLIP,
        WebkitClipPath: HEX_CLIP,
        border: '1px solid var(--nerv-cyan)',
        background: 'rgba(0, 207, 255, 0.04)',
      }}
    >
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatar}
          alt={`${name} portrait`}
          width={160}
          height={160}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <pre
          aria-label="ASCII silhouette portrait"
          className="text-[10px] leading-[1.1] m-0"
          style={{
            color: 'var(--nerv-cyan-dim)',
            fontFamily: 'var(--font-mono), monospace',
          }}
        >
          {ASCII_SILHOUETTE}
        </pre>
      )}
    </div>
  );
}

// The About document doesn't currently expose an `avatar` field on its
// frontmatter schema, but we read it defensively so adding one later
// "just works" without another edit here.
interface AboutWithAvatar {
  avatar?: string;
}

export default function AboutApp() {
  const about = getAbout();
  const Body = useMDXComponent(about.body.code);

  const links = useMemo(() => about.links ?? [], [about.links]);
  const avatar = (about as unknown as AboutWithAvatar).avatar;

  return (
    <div
      className="h-full w-full overflow-y-auto px-6 py-5"
      style={{ fontFamily: 'var(--font-mono), monospace' }}
    >
      {/* Header / hex portrait */}
      <div className="flex justify-center">
        <Portrait avatar={avatar} name={about.name} />
      </div>

      {/* WHOAMI */}
      <SectionHeader label="WHOAMI" />
      <div className="space-y-1">
        <DataRow label="NAME:    " value={about.name} />
        <DataRow label="HANDLE:  " value={about.handle} />
        <DataRow label="ROLE:    " value={about.role} />
        <DataRow label="LOCATION:" value={about.location} />
      </div>

      {/* BIO.txt */}
      <SectionHeader label="BIO.txt" />
      <div
        className="text-[13px] leading-[1.7] space-y-3"
        style={{ color: 'var(--nerv-bone)' }}
      >
        <Body components={MDXComponents} />
      </div>

      {/* CONTACT */}
      <SectionHeader label="CONTACT" />
      <ul className="space-y-1 text-[13px]">
        {about.email ? (
          <li>
            <a
              href={`mailto:${about.email}`}
              className="hover:underline"
              style={{ color: 'var(--nerv-cyan)' }}
            >
              [EMAIL] ↗
            </a>
          </li>
        ) : null}
        {links.map((link) => (
          <li key={`${link.label}-${link.url}`}>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:underline"
              style={{ color: 'var(--nerv-cyan)' }}
            >
              [{link.label.toUpperCase()}] ↗
            </a>
          </li>
        ))}
      </ul>

      {/* COLOPHON */}
      <SectionHeader label="COLOPHON" />
      <p
        className="text-[11px] leading-[1.6] whitespace-pre-line"
        style={{ color: 'var(--nerv-bone-dim)' }}
      >
        {`Inspired by txnio.com and the NERV interface from Neon Genesis Evangelion.
Built with Next.js, Tailwind, framer-motion, three.js.
Type set in JetBrains Mono, Orbitron, and Noto Sans JP.`}
      </p>
    </div>
  );
}
