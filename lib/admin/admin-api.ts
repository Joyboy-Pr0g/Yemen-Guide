import { User, PaginatedMeta, Project, ProjectFilters, VerificationApplication, Category, SubCategory, Ad, AdPosition, SiteSettings, ProjectReport, ReportFilters, AuditProject } from '@/types'
import { resolveSiteLogoUrl } from '@/lib/utils'
import { bbfFetch, bbfUpload } from '@/lib/api'

// Users API
export const getUsers = async (page = 1, search = '', role = ''): Promise<{ users: User[], meta: PaginatedMeta }> => {
  const params = new URLSearchParams({ page: String(page) })
  if (search) params.set('search', search)
  if (role) params.set('role', role)
  return bbfFetch<{ users: User[], meta: PaginatedMeta }>(`/admin/users?${params}`)
}
export const blockUser = async (id: number): Promise<{ message: string }> => {
  return bbfFetch(`/admin/users/${id}/block`, { method: 'PATCH' })
}
export const unblockUser = async (id: number): Promise<{ message: string }> => {
  return bbfFetch(`/admin/users/${id}/unblock`, { method: 'PATCH' })
}
export const getTraderProjects = async (userId: number): Promise<{ projects: Project[] }> => {
  return bbfFetch(`/admin/users/${userId}/projects`)
}
export const createUser = async (data: { name: string; email: string; role: string; password: string; password_confirmation: string }): Promise<{ message: string; errors?: Record<string, string[]> }> => {
  return bbfFetch<{ message: string; errors?: Record<string, string[]> }>(`/admin/users`, { method: 'POST', body: JSON.stringify(data) })
}
export const updateUser = async (
  id: number,
  data: { name: string; email: string; role: string; password?: string; password_confirmation?: string },
): Promise<{ message: string; user?: User; errors?: Record<string, string[]> }> => {
  return bbfFetch<{ message: string; user?: User; errors?: Record<string, string[]> }>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

// Projects API
export const getAdminProjects = async (page = 1, search = '', filters: ProjectFilters):
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
  if (filters.trader_id) params.set('trader_id', filters.trader_id)
  if (filters.verified) params.set('verified', filters.verified)
  return bbfFetch<{ projects: Project[], meta: PaginatedMeta }>(`/admin/projects?${params}`)
}
export const getAdminPendingProjects = async (page = 1, search = ''): Promise<{ projects: Project[], meta: PaginatedMeta }> => {
  const params = new URLSearchParams({ page: String(page), search: search })
  return bbfFetch<{ projects: Project[], meta: PaginatedMeta }>(`/admin/projects/pending?${params}`)
}
export const getAdminAuditProjects = async (page = 1, search = ''): Promise<{ projects: AuditProject[], meta: PaginatedMeta }> => {
  const params = new URLSearchParams({ page: String(page) })
  if (search) params.set('search', search)
  return bbfFetch<{ projects: AuditProject[], meta: PaginatedMeta }>(`/admin/projects/audit?${params}`)
}
export const deleteAuditProject = async (id: number): Promise<{ message: string }> => {
  return bbfFetch<{ message: string }>(`/admin/projects/${id}`, { method: 'DELETE' })
}
export const deleteAuditProjectMainImage = async (id: number): Promise<{ message: string }> => {
  return bbfFetch<{ message: string }>(`/admin/projects/${id}/image`, { method: 'DELETE' })
}
export const deleteAuditProjectFeaturedImage = async (projectId: number, imageId: number): Promise<{ message: string }> => {
  return bbfFetch<{ message: string }>(`/admin/projects/${projectId}/featured-images/${imageId}`, { method: 'DELETE' })
}
export const createProject = async (data: FormData): Promise<{ message: string, errors?: Record<string, string[]> }> => {
  return bbfUpload<{ message: string, errors?: Record<string, string[]> }>(`/admin/projects`, data)
}
export const approveProject = async (id: number, slug: string): Promise<{ message: string }> => {
  return bbfFetch<{ message: string }>(`/admin/projects/${id}/approve`, { method: 'PATCH', body: JSON.stringify({ slug }) })
}
export const rejectProject = async (id: number, slug: string, reason?: string): Promise<{ message: string }> => {
  return bbfFetch<{ message: string }>(`/admin/projects/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ slug, reason }) })
}
export const setProjectFeatured = async (id: number, slug: string, is_featured: boolean, featured_until?: string | null): Promise<{ message: string }> => {
  return bbfFetch<{ message: string }>(`/admin/projects/${id}/featured`, { method: 'PATCH', body: JSON.stringify({ is_featured, featured_until, slug }) })
}

export const getAdminReports = async (
  page = 1,
  search = '',
  filters: ReportFilters = {},
): Promise<{ reports: ProjectReport[]; meta: PaginatedMeta }> => {
  const params = new URLSearchParams({ page: String(page) })
  if (search) params.set('search', search)
  if (filters.status) params.set('status', filters.status)
  if (filters.report_type) params.set('report_type', filters.report_type)
  return bbfFetch<{ reports: ProjectReport[]; meta: PaginatedMeta }>(`/admin/projects/reports?${params}`)
}

// Verifications API
export const getVerifications = async (page = 1): Promise<{ applications: VerificationApplication[], meta: PaginatedMeta }> => {
  return bbfFetch<{ applications: VerificationApplication[], meta: PaginatedMeta }>(`/admin/verifications?page=${page}`)
}
export const reviewVerification = async (id: number, action: string, admin_notes?: string): Promise<{ message: string, application: VerificationApplication }> => {
  return bbfFetch<{ message: string, application: VerificationApplication }>(`/admin/verifications/${id}/review`, { method: 'PATCH', body: JSON.stringify({ action, admin_notes }) })
}

// Categories API
export const getCategories = async (): Promise<Category[]> => {
  const data = await bbfFetch<{ categories: Category[] }>('/admin/categories')
  return data.categories
}
export const createCategory = async (data: { name: string, slug: string, icon: string }): Promise<{ message: string, category: Category }> => {
  return bbfFetch<{ message: string, category: Category }>(`/admin/categories`, { method: 'POST', body: JSON.stringify(data) })
}
export const updateCategory = async (id: number, data: { name: string, slug: string, icon: string }): Promise<{ message: string, category: Category }> => {
  return bbfFetch<{ message: string, category: Category }>(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}
export const deleteCategory = async (id: number): Promise<{ message: string }> => {
  return bbfFetch<{ message: string }>(`/admin/categories/${id}`, { method: 'DELETE' })
}
export const createSubCategory = async (data: { category_id: number, name: string, slug: string }): Promise<{ message: string, subCategory: SubCategory }> => {
  return bbfFetch<{ message: string, subCategory: SubCategory }>(`/admin/sub-categories`, { method: 'POST', body: JSON.stringify(data) })
}
export const updateSubCategory = async (id: number, data: { name: string, slug: string }): Promise<{ message: string, subCategory: SubCategory }> => {
  return bbfFetch<{ message: string, subCategory: SubCategory }>(`/admin/sub-categories/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}
export const deleteSubCategory = async (id: number): Promise<{ message: string }> => {
  return bbfFetch<{ message: string }>(`/admin/sub-categories/${id}`, { method: 'DELETE' })
}

// Ads API
export const getAds = async (page = 1): Promise<{ ads: Ad[], meta: PaginatedMeta }> => {
  const params = new URLSearchParams({ page: String(page) })
  return bbfFetch<{ ads: Ad[], meta: PaginatedMeta }>(`/admin/ads?${params}`)
}
export const createAd = async (data: FormData): Promise<{ message: string, ad: Ad }> => {
  return bbfUpload<{ message: string, ad: Ad }>(`/admin/ads`, data)
}
export const updateAd = async (id: number, data: FormData): Promise<{ message: string, ad: Ad }> => {
  return bbfUpload<{ message: string, ad: Ad }>(`/admin/ads/${id}`, data, 'PUT')
}
export const deleteAd = async (id: number): Promise<{ message: string }> => {
  return bbfFetch<{ message: string }>(`/admin/ads/${id}`, { method: 'DELETE' })
}

// Settings API
type SettingItem = { key: string; value: string | null }

function parseSettingsResponse(items: SettingItem[]): SiteSettings {
  const map = Object.fromEntries(items.map(({ key, value }) => [key, value ?? '']))

  return {
    site_name: map.site_name ?? '',
    site_description: map.site_description ?? '',
    meta_keywords: map.meta_keywords ?? '',
    logo: resolveSiteLogoUrl(map.logo ?? ''),
    contact_email: map.contact_email || null,
    facebook_url: map.facebook_url || null,
    instagram_url: map.instagram_url || null,
    whatsapp_support: map.whatsapp_support || null,
  }
}

function toSettingsPayload(settings: Omit<SiteSettings, 'logo'>): { settings: SettingItem[] } {
  return {
    settings: Object.entries(settings).map(([key, value]) => ({
      key,
      value: value ?? null,
    })),
  }
}

export const getSettings = async (): Promise<SiteSettings> => {
  const data = await bbfFetch<{ settings: SettingItem[] }>('/admin/settings')
  return parseSettingsResponse(data.settings)
}

export const updateSettings = async (settings: Omit<SiteSettings, 'logo'>): Promise<{ message: string, settings: SiteSettings }> => {
  const data = await bbfFetch<{ message: string, settings: SettingItem[] }>(`/admin/settings`, {
    method: 'PUT',
    body: JSON.stringify(toSettingsPayload(settings)),
  })

  return {
    message: data.message,
    settings: parseSettingsResponse(data.settings),
  }
}

export const uploadLogo = async (logo: FormData): Promise<{ message: string, logo: string }> => {
  return bbfUpload<{ message: string, logo: string }>(`/admin/settings/logo`, logo, 'POST')
}