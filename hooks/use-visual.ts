'use client'

import { useQuery } from '@tanstack/react-query'
import { getVisualByKey } from '@/lib/visuals-api'
import type { Visual, VisualKey } from '@/types'

export function useVisual(key: VisualKey, enabled = true) {
  return useQuery({
    queryKey: ['visual', key],
    queryFn: () => getVisualByKey(key),
    select: (data) => data.visual,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export type { Visual }
