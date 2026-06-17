/**
 * Site-wide SEO constants — single source of truth for metadata.
 * `NEXT_PUBLIC_SITE_URL` should be configured in Vercel for the deployed canonical origin.
 */

export const SITE = {
  name: 'Jason Yi · AI Product Engineer',
  description:
    'Building agents for real businesses. Founder of VoiceReach (voice agents, backed by OpenAI), now building Leadrin. Prev: TikTok, Adobe, Google. Berkeley EECS.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.jasonyi.ai',
  twitter: '@jasonyi361',
  themeColor: '#7dd3fc',
  tagline: 'Building agents for real businesses.',
} as const;

export type SiteConfig = typeof SITE;
