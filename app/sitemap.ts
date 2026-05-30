/**
 * Sitemap — root + singleton tabs + per-project + per-experience entries.
 */

import type { MetadataRoute } from 'next';
import { allProjects, allExperiences } from 'contentlayer/generated';
import { SITE } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/experience`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/feed`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE.url}/interests`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const projectEntries: MetadataRoute.Sitemap = allProjects.map((p) => ({
    url: `${SITE.url}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const experienceEntries: MetadataRoute.Sitemap = allExperiences.map((e) => ({
    url: `${SITE.url}/experience/${e.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticEntries, ...projectEntries, ...experienceEntries];
}
