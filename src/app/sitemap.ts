import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { projects } from '@/content/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: 'monthly', priority: 1 },
    ...projects.map((p) => ({
      url: `${site.url}/work/${p.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
