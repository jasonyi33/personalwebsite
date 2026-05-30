/**
 * MDX component overrides for project, blog, and experience bodies.
 * Geist Sans body, neutral palette, accent for links + inline code.
 */

import type { MDXComponents as MDXComponentsType } from 'mdx/types';
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

type ChildProps = { children?: ReactNode };

export const MDXComponents: MDXComponentsType = {
  h1: ({ children }: ChildProps) => (
    <h1
      className="mt-6 mb-3 text-[20px] font-semibold tracking-tight"
      style={{ color: 'var(--text)' }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }: ChildProps) => (
    <h2
      className="mt-6 mb-2 text-[16px] font-semibold tracking-tight"
      style={{ color: 'var(--text)' }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }: ChildProps) => (
    <h3
      className="mt-5 mb-2 text-[14px] font-semibold tracking-tight"
      style={{ color: 'var(--text)' }}
    >
      {children}
    </h3>
  ),
  h4: ({ children }: ChildProps) => (
    <h4
      className="mt-4 mb-2 text-[13px] font-medium tracking-tight"
      style={{ color: 'var(--text)' }}
    >
      {children}
    </h4>
  ),
  h5: ({ children }: ChildProps) => (
    <h5
      className="mt-3 mb-1.5 text-[12px] font-medium tracking-tight uppercase"
      style={{ color: 'var(--text-dim)' }}
    >
      {children}
    </h5>
  ),
  p: ({ children }: ChildProps) => (
    <p className="my-3 leading-[1.75]">{children}</p>
  ),
  a: ({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      className="underline-offset-4 hover:underline"
      style={{ color: 'var(--accent)' }}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...rest}
    >
      {children}
    </a>
  ),
  code: ({ children }: ChildProps) => (
    <code
      className="rounded px-1 py-[1px] text-[0.9em]"
      style={{
        background: 'var(--accent-2)',
        color: 'var(--text)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {children}
    </code>
  ),
  pre: ({ children, ...rest }: HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="my-4 overflow-x-auto rounded-lg border p-3 text-[12.5px]"
      style={{
        background: 'rgba(0,0,0,0.18)',
        borderColor: 'var(--border)',
        fontFamily: 'var(--font-mono)',
      }}
      {...rest}
    >
      {children}
    </pre>
  ),
  ul: ({ children }: ChildProps) => <ul className="my-3 list-disc pl-5">{children}</ul>,
  ol: ({ children }: ChildProps) => <ol className="my-3 list-decimal pl-5">{children}</ol>,
  li: ({ children }: ChildProps) => <li className="my-1">{children}</li>,
  hr: () => <hr className="my-6" style={{ borderColor: 'var(--border)' }} />,
  blockquote: ({ children }: ChildProps) => (
    <blockquote
      className="my-4 border-l-2 pl-4 italic"
      style={{
        borderColor: 'var(--border-2)',
        color: 'var(--text-dim)',
      }}
    >
      {children}
    </blockquote>
  ),
  strong: ({ children }: ChildProps) => (
    <strong style={{ color: 'var(--text)' }}>{children}</strong>
  ),
  em: ({ children }: ChildProps) => <em>{children}</em>,
};

export default MDXComponents;
