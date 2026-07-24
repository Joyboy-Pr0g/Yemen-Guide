import { PaginatedMeta, Project } from '@/types'

import { bbfFetch } from '@/lib/api'

// Projects API
export const getFavorites = async (page = 1):
  Promise<{ projects: Project[], meta: PaginatedMeta }> => {
  const params = new URLSearchParams({ page: String(page) })
  return bbfFetch<{ projects: Project[], meta: PaginatedMeta }>(`/me/projects/favorites?${params}`)
}

export const toggleFavorite = async (projectId: number, slug: string): Promise<{ message: string, is_favorite: boolean }> => {
  return bbfFetch<{ message: string, is_favorite: boolean }>(`/me/projects/${projectId}/favorite`, {
    method: 'POST',
    body: JSON.stringify({ slug: slug }),
  })
}

export const rateProject = async (projectId: number, rating: number, slug: string): Promise<{ message: string, rating: number }> => {
  return bbfFetch<{ message: string, rating: number }>(`/me/projects/${projectId}/rate`, {
    method: 'POST',
    body: JSON.stringify({ rating, slug: slug }),
  })
}

/** Client-only: includes auth cookie so backend can resolve is_favorite / user_rating. */
export const getProjectBySlug = async (slug: string): Promise<Project> => {
  const data = await bbfFetch<{ project: Project }>(`/projects/${slug}`)
  return data.project
}

/** Client-only: forwards auth cookie for personalized project sorting. */
export const getProjects = async (
  params?: Record<string, string>,
): Promise<{ projects: Project[]; meta: PaginatedMeta }> => {
  const query = params ? `?${new URLSearchParams(params).toString()}` : ''
  return bbfFetch<{ projects: Project[]; meta: PaginatedMeta }>(`/projects${query}`)
}

export const logInteraction = async (
  projectId: number,
  type: 'view' | 'click' | 'save' | 'share' = 'view',
): Promise<{ success: boolean }> => {
  return bbfFetch<{ success: boolean }>('/interactions', {
    method: 'POST',
    body: JSON.stringify({ project_id: projectId, type }),
  })
}



