'use client';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import MDXComponents from '@/components/mdx/MDXComponents';

export default function MdxPost({ code }: { code: string }) {
  const MDX = useMDXComponent(code);
  return (
    <div className="prose mt-8 max-w-none">
      <MDX components={MDXComponents} />
    </div>
  );
}
