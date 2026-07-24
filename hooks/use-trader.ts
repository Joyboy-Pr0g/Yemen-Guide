'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createTraderProject, createTraderVerification, deleteTraderProject, getTraderProjects, getTraderVerifications, updateTraderProject, updateTraderProjectStatus } from '@/lib/trader/trader-api'
import type { VerificationApplication, ProjectFilters, PaginatedMeta, Project } from '@/types'
import { sanitizeFilters, matchesInitialParams } from '@/utils/projectFilterNormalization'
import type { ProjectInitialFilters } from '@/utils/projectFilterNormalization'
import { useInfiniteQuery } from '@tanstack/react-query'

export function useInfiniteTraderProjects(
  initialData: { projects: Project[]; meta: PaginatedMeta },
  filters: ProjectInitialFilters = {},
  initialParams: Record<string, string | undefined> = {},
) {
  const safe = sanitizeFilters(filters)
  const isInitialQuery = matchesInitialParams(safe, initialParams)

  const baseParams = new URLSearchParams()
  Object.entries(safe).forEach(([k, v]) => {
    if (v !== undefined && v !== '') {
      baseParams.set(k, String(v))
    }
  })

  if (!baseParams.get('status')) {
    baseParams.set('status', 'public')
  }

  return useInfiniteQuery({
    queryKey: ['projects', 'infinite', safe],
    initialPageParam: 1,
    initialData: isInitialQuery
      ? { pages: [initialData], pageParams: [1] }
      : undefined,
    queryFn: ({ pageParam = 1 }) => {
      const params = new URLSearchParams(baseParams)
      params.set('page', String(pageParam))

      return getTraderProjects(filters.page, filters.search, filters)
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
    staleTime: 0,
    refetchOnMount: false,
  })
}
export function useTraderProjects(
  page = 1,
  search = '',
  filters: Omit<ProjectFilters, 'trader_id'>,
  initialData?: Awaited<ReturnType<typeof getTraderProjects>>,
  enabled = true,
) {
  const isInitialQuery =
    page === 1 &&
    !search.trim() &&
    !filters.status &&
    !filters.admin_approval_status &&
    !filters.featured &&
    !filters.city_id &&
    !filters.neighborhood_id &&
    !filters.sub_category_id &&
    !filters.category_id &&
    !filters.verified

  return useQuery({
    queryKey: ['trader', 'projects', page, search, filters],
    queryFn: () => getTraderProjects(page, search, filters),
    initialData: enabled && isInitialQuery ? initialData : undefined,
    staleTime: 0,
    enabled,
    refetchOnMount: false,
  })
}
export function useUpdateProjectStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, slug, status }: { id: number; slug: string; status: 'public' | 'draft' }) =>
      updateTraderProjectStatus(id, slug, status),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['trader', 'projects'] })
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
}
export function useCreateTraderProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) =>
      createTraderProject(data),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['trader', 'projects'] })
    },
    onError: (error: any) => {
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((msg: any) => {
          toast.error(msg)
        })
      }
    },
  })
}
export function useUpdateTraderProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => updateTraderProject(id, data),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['trader', 'projects'] })
    },
    onError: (error: any) => {
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((msg: any) => {
          toast.error(msg)
        })
      }
    },
  })
}
export function useDeleteTraderProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      deleteTraderProject(id),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['trader', 'projects'] })
    },
    onError: (error: any) => {
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((msg: any) => {
          toast.error(msg)
        })
      }
    },
  })
}

export function useTraderVerifications(initialData?: { applications: VerificationApplication[]; meta: PaginatedMeta }) {
  return useQuery({
    queryKey: ['trader', 'verifications'],
    queryFn: () =>
      getTraderVerifications(),
    staleTime: 0,
    initialData: initialData ? initialData : undefined,
    refetchOnMount: false,
  })
}
export function useSubmitVerification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) =>
      createTraderVerification(data),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['trader', 'verifications'] })
    },
    onError: (error: any) => {
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((msg: any) => {
          toast.error(msg)
        })
      }
    },
  })
}
