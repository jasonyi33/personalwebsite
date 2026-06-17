/**
 * Site-wide SEO constants — single source of truth for metadata.
 * Canonical origin is pinned to the primary domain (www.jasonyi.ai) so OG/canonical
 * URLs always resolve, independent of any stale NEXT_PUBLIC_SITE_URL env override.
 */

export const SITE = {
  name: 'Jason Yi · AI Product Engineer',
  description:
    'Building agents for real businesses. Founder of VoiceReach (voice agents, backed by OpenAI), now building Leadrin. Prev: TikTok, Adobe, Google. Berkeley EECS.',
  url: 'https://www.jasonyi.ai',
  twitter: '@jasonyi361',
  themeColor: '#7dd3fc',
  tagline: 'Building agents for real businesses.',
} as const;

export type SiteConfig = typeof SITE;
