import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

// Case studies are left out until they are linked from the site again.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, changeFrequency: 'monthly', priority: 1 }];
}
