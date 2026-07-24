import type { AdminStats, Project, User, PaginatedMeta, VerificationApplication, Category, Ad, SiteSettings, AdminApprovalStatus, ProjectReport, ReportFilters, CityWithProjects, AuditProject } from '@/types'
import { cookies } from 'next/headers'

const BBF_API_URL = process.env.NEXT_PUBLIC_BBF_API_URL || 'http://localhost:3000/api/v1'

const serverFetch = async <T>(path: string, method: string, options?: RequestInit): Promise<T> => {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    const res = await fetch(`${BBF_API_URL}${path}`, {
        headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        method,
        ...options,
    })

    if (!res.ok) {
        throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`)
    }

    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) {
        throw new Error(`Expected JSON from ${path}, got ${contentType || 'unknown type'}`)
    }

    return res.json()
}

export const getDashboard = async (): Promise<{ stats: AdminStats, projects: Project[], cities_with_projects: CityWithProjects[] }> => {
    const data = await serverFetch<{ stats: AdminStats, most_viewed_projects: Project[], cities_with_projects: CityWithProjects[] }>('/admin/dashboard', 'GET', {
        next: { revalidate: 3600 },
    })
    return { stats: data.stats, projects: data.most_viewed_projects, cities_with_projects: data.cities_with_projects }
}

export const getUsers = async (page = 1, role = ''): Promise<{ users: User[], meta: PaginatedMeta }> => {
    const params = new URLSearchParams({ page: String(page) })
    if (role) params.set('role', role)
    const data = await serverFetch<{ users: User[], meta: PaginatedMeta }>(`/admin/users?${params}`, 'GET', {
        next: { revalidate: 3600 },
    })
    return { users: data.users, meta: data.meta }
}

export const getUser = async (id: number): Promise<User> => {
    const data = await serverFetch<{ user: User }>(`/admin/users/${id}`, 'GET', {
        next: { revalidate: 3600 },
    })
    return data.user
}

export const getUserProjects = async (id: number): Promise<Project[]> => {
    const data = await serverFetch<{ projects: Project[] }>(`/admin/users/${id}/projects`, 'GET', {
        next: { revalidate: 3600 },
    })
    return data.projects
}

export const getAdminProjects = async (page = 1): Promise<{ projects: Project[], meta: PaginatedMeta }> => {
    const params = new URLSearchParams({ page: String(page) })
    const data = await serverFetch<{ projects: Project[], meta: PaginatedMeta }>(`/admin/projects?${params}`, 'GET', {
        next: { revalidate: 3600 },
    })
    return data
}

export const getAdminAuditProjects = async (page = 1, search = ''): Promise<{ projects: AuditProject[], meta: PaginatedMeta }> => {
    const params = new URLSearchParams({ page: String(page) })
    if (search) params.set('search', search)
    return serverFetch<{ projects: AuditProject[], meta: PaginatedMeta }>(`/admin/projects/audit?${params}`, 'GET', {
        next: { revalidate: 60, tags: ['admin-projects-audit'] },
    })
}

export const getAdminProject = async (id: number): Promise<Project> => {
    const data = await serverFetch<{ project: Project }>(`/admin/projects/${id}`, 'GET', {
        next: { revalidate: 3600 },
    })
    return data.project
}

export const getAdminPendingProjects = async (page = 1, search = ''): Promise<{ projects: Project[], meta: PaginatedMeta }> => {
    const params = new URLSearchParams({ page: String(page), search: search })
    const data = await serverFetch<{ projects: Project[], meta: PaginatedMeta }>(`/admin/projects/pending?${params.toString()}`, 'GET', {
        next: { revalidate: 3600, tags: ['admin-projects-pending'] },
    })
    return { projects: data.projects, meta: data.meta }
}

export const getAdminReports = async (
    page = 1,
    search = '',
    filters: ReportFilters = {},
): Promise<{ reports: ProjectReport[], meta: PaginatedMeta }> => {
    const params = new URLSearchParams({ page: String(page) })
    if (search) params.set('search', search)
    if (filters.status) params.set('status', filters.status)
    if (filters.report_type) params.set('report_type', filters.report_type)
    const data = await serverFetch<{ reports: ProjectReport[], meta: PaginatedMeta }>(`/admin/projects/reports?${params}`, 'GET', {
        next: { revalidate: 3600 },
    })
    return { reports: data.reports, meta: data.meta }
}

export const getAdminVerifications = async (page = 1): Promise<{ applications: VerificationApplication[], meta: PaginatedMeta }> => {
    const params = new URLSearchParams({ page: String(page) })
    const data = await serverFetch<{ applications: VerificationApplication[], meta: PaginatedMeta }>(`/admin/verifications?${params}`, 'GET', {
        next: { revalidate: 3600, tags: ['verifications'] },
    })
    return { applications: data.applications, meta: data.meta }
}

export const getAdminVerification = async (id: number): Promise<VerificationApplication> => {
    const data = await serverFetch<{ application: VerificationApplication }>(`/admin/verifications/${id}`, 'GET', {
        next: { revalidate: 3600 },
    })
    return data.application
}

export const getAdminCategories = async (): Promise<Category[]> => {
    const data = await serverFetch<{ categories: Category[] }>('/admin/categories', 'GET', {
        next: { revalidate: 3600 },
    })
    return data.categories
}

export const getAdminAds = async (page = 1): Promise<{ ads: Ad[], meta: PaginatedMeta }> => {
    const params = new URLSearchParams({ page: String(page) })
    const data = await serverFetch<{ ads: Ad[], meta: PaginatedMeta }>(`/admin/ads?${params}`, 'GET', {
        next: { revalidate: 3600 },
    })
    return { ads: data.ads, meta: data.meta }
}
