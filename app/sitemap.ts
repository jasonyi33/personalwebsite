/**
 * Sitemap for crawlers. Includes the root desktop, the singleton apps,
 * and one entry per project / blog post.
 */

import type { MetadataRoute } from 'next';
import { allProjects, allPosts } from 'contentlayer/generated';
import { SITE } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE.url}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE.url}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE.url}/now`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  const projectEntries: MetadataRoute.Sitemap = allProjects.map((p) => ({
    url: `${SITE.url}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const postEntries: MetadataRoute.Sitemap = allPosts
    .filter((p) => !p.draft)
    .map((p) => ({
      url: `${SITE.url}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: 'yearly',
      priority: 0.7,
    }));

  return [...staticEntries, ...projectEntries, ...postEntries];
}
