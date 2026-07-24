import type { Project, PaginatedMeta, VerificationApplication, TraderStats } from '@/types'
import { authenticatedServerFetch } from '@/lib/authenticated-server-fetch'

const TRADER_LOGIN_REDIRECT = '/dashboard/trader/projects'

export const getTraderDashboard = async (): Promise<{ stats: TraderStats, most_viewed_projects: Project[] }> => {
    const data = await authenticatedServerFetch<{ stats: TraderStats, most_viewed_projects: Project[] }>(
        `/trader/dashboard`,
        'GET',
        { next: { revalidate: 3600, tags: ['trader-dashboard'] }, loginRedirect: '/dashboard/trader' },
    )
    return { stats: data.stats, most_viewed_projects: data.most_viewed_projects }
}

export const getTraderProjects = async (page = 1,): Promise<{ projects: Project[], meta: PaginatedMeta }> => {
    const params = new URLSearchParams({ page: String(page) })
    return authenticatedServerFetch<{ projects: Project[], meta: PaginatedMeta }>(
        `/trader/projects?${params}`,
        'GET',
        { next: { revalidate: 3600, tags: ['trader-projects'] }, loginRedirect: TRADER_LOGIN_REDIRECT },
    )
}

export const getTraderProject = async (id: number): Promise<Project> => {
    const data = await authenticatedServerFetch<{ project: Project }>(
        `/trader/projects/${id}`,
        'GET',
        { next: { revalidate: 3600 }, loginRedirect: TRADER_LOGIN_REDIRECT },
    )
    return data.project
}

export const getTraderVerifications = async (page = 1): Promise<{ applications: VerificationApplication[], meta: PaginatedMeta }> => {
    const params = new URLSearchParams({ page: String(page) })
    const data = await authenticatedServerFetch<{ applications: VerificationApplication[], meta: PaginatedMeta }>(
        `/trader/verifications?${params}`,
        'GET',
        { next: { revalidate: 3600, tags: ['verifications'] }, loginRedirect: '/dashboard/trader/verifications' },
    )
    return { applications: data.applications, meta: data.meta }
}

export const getTraderVerification = async (id: number): Promise<VerificationApplication> => {
    const data = await authenticatedServerFetch<{ application: VerificationApplication }>(
        `/trader/verifications/${id}`,
        'GET',
        { next: { revalidate: 3600 }, loginRedirect: '/dashboard/trader/verifications' },
    )
    return data.application
}

