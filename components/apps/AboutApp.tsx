'use client';

/**
 * About — single-pane scrollable bio. First-person voice, lowercase
 * Geist Mono section labels, MDX body in Geist Sans.
 */

import { useMemo } from 'react';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { getAbout } from '@/lib/content';

export default function AboutApp() {
  const about = getAbout();
  const Body = useMDXComponent(about.body.code);
  const links = useMemo(() => about.links ?? [], [about.links]);

  return (
    <div
      className="h-full w-full overflow-y-auto px-7 py-7"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <div className="mx-auto max-w-[560px]">
        <header className="mb-7">
          <h1
            className="text-[24px] font-semibold tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            {about.name}
          </h1>
          <p
            className="mt-1.5 text-[13px]"
            style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
          >
            {about.role} · {about.location}
          </p>
        </header>

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

// Map the MDX inline-code markers (`about`, `background`, `what's next`) to
// lowercase Geist Mono section labels and let everything else render normally.
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
