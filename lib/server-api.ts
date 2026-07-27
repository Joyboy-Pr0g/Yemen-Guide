import type { Category, City, Project, Ad, PaginatedMeta, SiteSettings } from '@/types'
import { cache } from 'react'
import { resolveSiteLogoUrl, DEFAULT_SITE_LOGO } from '@/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const SITE_URL = 'https://dulni-sy.com'

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: 'دُّلني-اليمن',
  site_description: 'دليل الأعمال والمحلات التجارية في اليمن',
  meta_keywords: 'دُّلني-اليمن, محلات, أعمال, اليمن',
  logo: DEFAULT_SITE_LOGO,
  contact_email: null,
  facebook_url: null,
  instagram_url: null,
  whatsapp_support: null,
}

async function serverFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Accept: 'application/json' },
    ...options,
  })
  if (!res.ok) {
    await res.text()
    throw new Error(`API Error: ${res.status}`)
  }
  return res.json()
}

export async function getCategories(): Promise<Category[]> {
  const data = await serverFetch<{ categories: Category[] }>('/categories', {
   
  })
  return data.categories
}

export async function getCities(): Promise<City[]> {
  const data = await serverFetch<{ cities: City[] }>('/cities', {
   
  })
  return data.cities
}

export async function getProjects(params?: Record<string, string>): Promise<{ projects: Project[]; meta: PaginatedMeta }> {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  const data = await serverFetch<{ projects: Project[]; meta: PaginatedMeta }>(`/projects${query}`, {
    next: { revalidate: 3600, tags: ['projects'], },
  })
  return data
}

export async function getProjectBySlug(slug: string): Promise<Project> {
  const data = await serverFetch<{ project: Project }>(`/projects/${slug}`, {
    next: { revalidate: 3600, tags: ['projects',`project-${slug}`], },
  })
  return data.project
}

export async function getPublicAdsByPosition(position?: string): Promise<Ad[]> {
  const query = position ? `?position=${position}` : "";

  const data = await serverFetch<{ ads: Ad[] }>(`/ads${query}`, {
    next: { revalidate: 3600, tags: ['ads'], },
  });

  return data.ads;
}

export async function getFeaturedProjects(count = 6): Promise<Project[]> {
  const data = await serverFetch<{ projects: Project[]; meta: any }>(`/projects/featured?count=${count}`, {
    next: { revalidate: 60, tags: ['featured-projects'], },
  })
  return data.projects;
}

export async function getCitiesWithProjects(count = 6): Promise<{ city: City; projects: Project[] }[]> {
  const data = await serverFetch<{ data: { city: City; projects: Project[] }[] }>(`/cities/projects?count=${count}`, {
    next: { revalidate: 60, tags: ['cities-with-projects'], },
  })
  return data.data;
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const data = await serverFetch<{ settings: SiteSettings }>('/settings', {
      next: { revalidate: 60, tags: ['site-settings'] },
    })
    return { ...data.settings, logo: resolveSiteLogoUrl(data.settings.logo) }
  } catch {
    return DEFAULT_SITE_SETTINGS
  }
})
