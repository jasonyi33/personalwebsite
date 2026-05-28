/**
 * Site-wide SEO constants — single source of truth for metadata.
 * `NEXT_PUBLIC_SITE_URL` should be configured in Vercel for the deployed canonical origin.
 */

export const SITE = {
  name: 'JASON-OS',
  description:
    'Personal site of Jason Yi — EECS @ UC Berkeley. Projects, logs, and signals from an in-browser NERV-themed OS.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jasonyi.live',
  twitter: '@jasonyi361',
  themeColor: '#00CFFF',
} as const;

export type SiteConfig = typeof SITE;
