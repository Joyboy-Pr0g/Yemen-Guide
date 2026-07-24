import type { MetadataRoute } from 'next'
import { SITE_URL, getProjects } from '@/lib/server-api'

const MAX_PAGES = 50

async function getAllProjectSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  const slugs: { slug: string; updatedAt: string }[] = []
  let page = 1
  while (page <= MAX_PAGES) {
    const { projects, meta } = await getProjects({ page: String(page) })
    slugs.push(...projects.map((p) => ({ slug: p.slug, updatedAt: p.created_at })))
    if (!meta.hasMorePages || page >= meta.last_page) break
    page += 1
  }
  return slugs
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Only clean, canonical URLs belong here — category/city browsing is done
  // via query params on /projects, which are marked nofollow and excluded on purpose.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/categories`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/cookie-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/data-deletion`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const projectSlugs = await getAllProjectSlugs().catch(() => [])

  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map(({ slug, updatedAt }) => ({
    url: `${SITE_URL}/projects/${slug}`,
    lastModified: updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes]
}
