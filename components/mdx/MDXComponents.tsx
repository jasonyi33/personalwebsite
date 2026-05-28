/**
 * MDX component overrides for project and blog bodies.
 *
 * Implements the txnio "cascading H1–H5" hierarchy: each heading is shifted
 * left by 2ch * (n-1), producing a descending stair effect when multiple
 * headings stack on one screen.
 *
 * Typography defaults are tuned for both Projects (mixed) and Logs (terminal-
 * styled) readers. Color tokens come from globals.css CSS variables.
 */

import type { MDXComponents as MDXComponentsType } from 'mdx/types';
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

type ChildProps = { children?: ReactNode };

export const MDXComponents: MDXComponentsType = {
  h1: ({ children }: ChildProps) => (
    <h1
      className="font-[family-name:var(--font-display)] tracking-wide text-[20px] mt-6 mb-3"
      style={{ color: 'var(--nerv-bone)' }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }: ChildProps) => (
    <h2
      className="ml-[2ch] font-[family-name:var(--font-display)] tracking-wide text-[18px] mt-5 mb-3"
      style={{ color: 'var(--nerv-bone)' }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }: ChildProps) => (
    <h3
      className="ml-[4ch] font-[family-name:var(--font-display)] tracking-wide text-[16px] mt-4 mb-2"
      style={{ color: 'var(--nerv-bone)' }}
    >
      {children}
    </h3>
  ),
  h4: ({ children }: ChildProps) => (
    <h4
      className="ml-[6ch] font-[family-name:var(--font-display)] tracking-wide text-[14px] mt-4 mb-2"
      style={{ color: 'var(--nerv-bone)' }}
    >
      {children}
    </h4>
  ),
  h5: ({ children }: ChildProps) => (
    <h5
      className="ml-[8ch] font-[family-name:var(--font-display)] tracking-wide text-[13px] mt-3 mb-2"
      style={{ color: 'var(--nerv-bone)' }}
    >
      {children}
    </h5>
  ),
  p: ({ children }: ChildProps) => (
    <p className="my-3 leading-7" style={{ color: 'var(--nerv-bone)' }}>
      {children}
    </p>
  ),
  a: ({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      className="underline-offset-2 hover:underline"
      style={{ color: 'var(--nerv-cyan)' }}
      {...rest}
    >
      {children}
    </a>
  ),
  code: ({ children }: ChildProps) => (
    <code
      className="rounded px-1 py-0.5 text-[0.9em]"
      style={{
        background: 'rgba(255,255,255,0.05)',
        color: 'var(--nerv-cyan)',
      }}
    >
      {children}
    </code>
  ),
  pre: ({ children, ...rest }: HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="my-4 overflow-x-auto rounded border p-3 text-[12px]"
      style={{
        background: 'rgba(0,0,0,0.4)',
        borderColor: 'rgba(255,255,255,0.10)',
      }}
      {...rest}
    >
      {children}
    </pre>
  ),
  ul: ({ children }: ChildProps) => (
    <ul className="my-3 list-disc pl-5" style={{ color: 'var(--nerv-bone)' }}>
      {children}
    </ul>
  ),
  ol: ({ children }: ChildProps) => (
    <ol className="my-3 list-decimal pl-5" style={{ color: 'var(--nerv-bone)' }}>
      {children}
    </ol>
  ),
  li: ({ children }: ChildProps) => <li className="my-1">{children}</li>,
  hr: () => (
    <hr className="my-6" style={{ borderColor: 'rgba(255,255,255,0.10)' }} />
  ),
  blockquote: ({ children }: ChildProps) => (
    <blockquote
      className="my-4 border-l-2 pl-4 italic"
      style={{
        borderColor: 'var(--nerv-cyan-dim)',
        color: 'var(--nerv-bone-dim)',
      }}
    >
      {children}
    </blockquote>
  ),
  strong: ({ children }: ChildProps) => (
    <strong style={{ color: 'var(--nerv-bone)' }}>{children}</strong>
  ),
  em: ({ children }: ChildProps) => (
    <em style={{ color: 'var(--nerv-bone)' }}>{children}</em>
  ),
};

export default MDXComponents;
