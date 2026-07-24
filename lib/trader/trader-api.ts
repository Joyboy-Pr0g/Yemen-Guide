import { User, PaginatedMeta, Project, ProjectFilters, VerificationApplication, Category, SubCategory, Ad, AdPosition, SiteSettings } from '@/types'

import { bbfFetch, bbfUpload } from '@/lib/api'

// Projects API
export const getTraderProjects = async (page = 1, search = '', filters: ProjectFilters):
  Promise<{ projects: Project[], meta: PaginatedMeta }> => {
  const params = new URLSearchParams({ page: String(page) })
  if (search) params.set('search', search)
  if (filters.status) params.set('status', filters.status)
  if (filters.admin_approval_status) params.set('admin_approval_status', filters.admin_approval_status)
  if (filters.featured) params.set('featured', filters.featured)
  if (filters.city_id) params.set('city_id', filters.city_id)
  if (filters.neighborhood_id) params.set('neighborhood_id', filters.neighborhood_id)
  if (filters.sub_category_id) params.set('sub_category_id', filters.sub_category_id)
  if (filters.category_id) params.set('category_id', filters.category_id)
  if (filters.verified) params.set('verified', filters.verified)
  return bbfFetch<{ projects: Project[], meta: PaginatedMeta }>(`/trader/projects?${params}`)
}
export const createTraderProject = async (data: FormData): Promise<{ message: string, errors?: Record<string, string[]> }> => {
  return bbfUpload<{ message: string, errors?: Record<string, string[]> }>(`/trader/projects`, data)
}
export const updateTraderProject = async (id: number, data: FormData): Promise<{ message: string, errors?: Record<string, string[]> }> => {
  return bbfUpload<{ message: string, errors?: Record<string, string[]> }>(`/trader/projects/${id}`, data, 'PUT')
}
export const updateTraderProjectStatus = async (id: number, slug: string, status: 'public' | 'draft'): Promise<{ message: string }> => {
  return bbfFetch<{ message: string }>(`/trader/projects/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, slug }) })
}
export const deleteTraderProject = async (id: number): Promise<{ message: string }> => {
  return bbfFetch<{ message: string }>(`/trader/projects/${id}`, { method: 'DELETE' })
}

// Verifications API
export const getTraderVerifications = async (page = 1): Promise<{ applications: VerificationApplication[], meta: PaginatedMeta }> => {
  return bbfFetch<{ applications: VerificationApplication[], meta: PaginatedMeta }>(`/trader/verifications?page=${page}`)
}
export const createTraderVerification = async (data: FormData): Promise<{ message: string, errors?: Record<string, string[]> }> => {
  return bbfUpload<{ message: string, errors?: Record<string, string[]> }>(`/trader/verifications`, data)
}

// Profile API
export const updateTraderProfile = async (data: { name: string }): Promise<{ message: string; user: User }> => {
  return bbfFetch<{ message: string; user: User }>(`/trader/profile`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const updateTraderPassword = async (data: {
  current_password: string
  password: string
  password_confirmation: string
}): Promise<{ message: string }> => {
  return bbfFetch<{ message: string }>(`/trader/profile/password`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}


