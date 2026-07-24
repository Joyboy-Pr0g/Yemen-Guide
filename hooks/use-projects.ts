'use client'

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { Project, PaginatedMeta } from '@/types'
import { sanitizeFilters, matchesInitialParams } from '@/utils/projectFilterNormalization'
import type { ProjectInitialFilters } from '@/utils/projectFilterNormalization'
import { getProjectBySlug, getProjects, rateProject, toggleFavorite } from '@/lib/visitor/visitor-api'
import { useCurrentUser } from '@/hooks/use-auth'

export function useInfiniteProjects(
  initialData: { projects: Project[]; meta: PaginatedMeta },
  filters: ProjectInitialFilters = {},
  initialParams: Record<string, string | undefined> = {},
) {
  const { data: user } = useCurrentUser()
  const isVisitor = !!user && user.role === 'visitor'
  const safe = sanitizeFilters(filters)
  const isInitialQuery = matchesInitialParams(safe, initialParams) && !isVisitor

  const baseParams = new URLSearchParams()
  Object.entries(safe).forEach(([k, v]) => {
    if (v !== undefined && v !== '') {
      baseParams.set(k, String(v))
    }
  })

  return useInfiniteQuery({
    queryKey: ['projects', 'infinite', safe],
    initialPageParam: 1,
    initialData: isInitialQuery
      ? { pages: [initialData], pageParams: [1] }
      : undefined,
    queryFn: ({ pageParam = 1 }) => {
      const params = new URLSearchParams(baseParams)
      params.set('page', String(pageParam))

      return getProjects(Object.fromEntries(params.entries()))
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
    staleTime: 0,
    refetchOnMount: isVisitor,
  })
}

export function useMapAreaProjects(
  filters: ProjectInitialFilters = {},
  enabled = false,
) {
  const safe = sanitizeFilters({ ...filters, page: 1, per_page: 100 })

  const params = new URLSearchParams()
  Object.entries(safe).forEach(([k, v]) => {
    if (v !== undefined && v !== '') {
      params.set(k, String(v))
    }
  })
  params.set('page', '1')

  return useQuery({
    queryKey: ['projects', 'map-area', safe],
    queryFn: () => getProjects(Object.fromEntries(params.entries())),
    enabled,
    staleTime: 0,
  })
}

export function useProject(slug: string, enabled = true) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => getProjectBySlug(slug),
    enabled,
    staleTime: 30 * 1000,
  })
}

//need to replace axios with fetch in the following functions

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, slug }: { id: number; slug: string }) =>
      toggleFavorite(id, slug),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
    onError: (error: { response?: { status?: number; data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'حدث خطأ ما')
    },
  })
}

export function useRateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, rating, slug }: { id: number; rating: number; slug: string }) =>
      rateProject(id, rating, slug),
    onSuccess: (data, { slug }) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project', slug] })
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ ما')
    },
  })
}
