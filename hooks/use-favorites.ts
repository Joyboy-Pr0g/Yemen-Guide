'use client'

import { useQuery } from '@tanstack/react-query'
import type { Project, PaginatedMeta } from '@/types'
import { getFavorites } from '@/lib/visitor/visitor-api'

export function useFavorites(initialData: { projects: Project[], meta: PaginatedMeta }, page = 1) {
  return useQuery({
    queryKey: ['favorites', page],
    queryFn: () =>
      getFavorites(page),
    staleTime: 30 * 1000,
    initialData: initialData,
    refetchOnMount: false,
  })
}
