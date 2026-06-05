'use client';

/**
 * About — auto-opening landing window. The top "card" is a recruiter-shaped
 * triage block (eyebrow → name → headline → value prop → credential chips →
 * availability → CTAs). The MDX prose below is the slower, narrative read.
 */

import { useMemo } from 'react';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { getAbout } from '@/lib/content';
import { useOsStore } from '@/lib/os-store';

export default function AboutApp() {
  const about = getAbout();
  const Body = useMDXComponent(about.body.code);
  const links = useMemo(() => about.links ?? [], [about.links]);
  const chips = useMemo(() => about.chips ?? [], [about.chips]);
  const openApp = useOsStore((s) => s.openApp);

  const handleWork = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openApp('projects');
  };

  return (
    <div
      className="h-full w-full overflow-y-auto px-7 py-7"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <div className="mx-auto max-w-[600px]">
        {/* Hero / résumé card */}
        <section className="mb-8">
          {about.eyebrow ? (
            <p
              className="mb-3 text-[10px] tracking-[0.18em]"
              style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
            >
              {about.eyebrow}
            </p>
          ) : null}

          <h1
            className="text-[28px] font-semibold tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            {about.name}
          </h1>

          {about.headline ? (
            <p
              className="mt-2 text-[22px] font-medium tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              {about.headline}
            </p>
          ) : null}

          {about.valueProp ? (
            <p
              className="mt-3 text-[14px] leading-[1.6]"
              style={{ color: 'var(--text-dim)' }}
            >
              {about.valueProp}
            </p>
          ) : null}

          {chips.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border px-2.5 py-1 text-[11px]"
                  style={{
                    borderColor: 'var(--border-2)',
                    color: 'var(--text)',
                    background: 'var(--surface-2)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {chip}
                </li>
              ))}
            </ul>
          ) : null}

          {about.availability ? (
            <p
              className="mt-5 flex items-center gap-2 text-[12px]"
              style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
            >
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--status-live)' }}
              />
              {about.availability}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="/resume"
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[12px] transition-colors hover:bg-[var(--accent-2)]"
              style={{
                borderColor: 'var(--border-2)',
                color: 'var(--text)',
                background: 'var(--surface-2)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Resume <span aria-hidden style={{ color: 'var(--text-dim)' }}>↓</span>
            </a>
            <button
              type="button"
              onClick={handleWork}
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[12px] transition-colors hover:bg-[var(--accent-2)]"
              style={{
                borderColor: 'var(--border-2)',
                color: 'var(--text)',
                background: 'var(--surface-2)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Work <span aria-hidden style={{ color: 'var(--text-dim)' }}>→</span>
            </button>
            <a
              href={`mailto:${about.email ?? 'jasonyi2023@gmail.com'}`}
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[12px] transition-colors hover:bg-[var(--accent-2)]"
              style={{
                borderColor: 'var(--border-2)',
                color: 'var(--text)',
                background: 'var(--surface-2)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Email
            </a>
          </div>
        </section>

        <div
          className="my-7 h-px w-full"
          style={{ background: 'var(--border)' }}
          aria-hidden
        />

        <article
          className="space-y-5 text-[14px] leading-[1.7]"
          style={{ color: 'var(--text)' }}
        >
          <Body components={mdxComponents} />
        </article>

        <section className="mt-9">
          <p
            className="mb-2 text-[11px] tracking-wide"
            style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
          >
            elsewhere
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px]">
            {links.map((link) => (
              <li key={`${link.label}-${link.url}`}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline-offset-4 hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  {link.label.toLowerCase()} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

const mdxComponents = {
  p: ({ children, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) => {
    if (
      Array.isArray(children) &&
      children.length === 1 &&
      isInlineCodeOnly(children[0])
    ) {
      const text = extractText(children[0]);
      return (
        <h3
          {...rest}
          className="mt-7 mb-1.5 text-[11px] tracking-wide first:mt-0"
          style={{
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-mono)',
            textTransform: 'lowercase',
          }}
        >
          {text}
        </h3>
      );
    }
    return (
      <p {...rest} className="leading-[1.75]">
        {children}
      </p>
    );
  },
  a: ({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      {...rest}
      className="underline-offset-4 hover:underline"
      style={{ color: 'var(--accent)' }}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer noopener' : undefined}
    >
      {children}
    </a>
  ),
};

function isInlineCodeOnly(node: unknown): boolean {
  if (!node || typeof node !== 'object') return false;
  const el = node as { type?: unknown; props?: { mdxType?: string; originalType?: string } };
  const tag = (el as { type?: { name?: string } | string }).type;
  const tagName =
    typeof tag === 'string'
      ? tag
      : (tag as { name?: string } | undefined)?.name ?? '';
  return tagName === 'code' || el.props?.mdxType === 'code' || el.props?.originalType === 'code';
}

function extractText(node: unknown): string {
  if (!node || typeof node !== 'object') return '';
  const el = node as { props?: { children?: unknown } };
  const c = el.props?.children;
  if (typeof c === 'string') return c;
  if (Array.isArray(c)) return c.map(extractText).join('');
  return '';
}
