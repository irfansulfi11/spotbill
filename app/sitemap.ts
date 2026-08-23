import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.domain}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.domain}/support/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${site.domain}/privacy/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site.domain}/terms/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
