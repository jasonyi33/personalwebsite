/**
 * Site-wide SEO constants — single source of truth for metadata.
 * `NEXT_PUBLIC_SITE_URL` should be configured in Vercel for the deployed canonical origin.
 */

export const SITE = {
  name: 'jasonyi.live',
  description:
    'Personal site of Jason Yi — EECS @ UC Berkeley. About, experience, projects, feed, and interests, packaged as an in-browser desktop.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jasonyi.live',
  twitter: '@jasonyi361',
  themeColor: '#7dd3fc',
} as const;

export type SiteConfig = typeof SITE;
