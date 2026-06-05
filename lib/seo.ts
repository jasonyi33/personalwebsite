/**
 * Site-wide SEO constants — single source of truth for metadata.
 * `NEXT_PUBLIC_SITE_URL` should be configured in Vercel for the deployed canonical origin.
 */

export const SITE = {
  name: 'Jason Yi · AI Product Engineer',
  description:
    'AI Product Engineer at UC Berkeley EECS. Voice interfaces, knowledge graphs, agentic software. Prev: TikTok, Google. 1st @ SF10x, presented at OpenAI DevDay.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jasonyi.live',
  twitter: '@jasonyi361',
  themeColor: '#7dd3fc',
  tagline: 'I ship AI products end-to-end.',
} as const;

export type SiteConfig = typeof SITE;
