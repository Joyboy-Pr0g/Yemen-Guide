import { bbfFetch } from '@/lib/api'
import type { Visual, VisualKey } from '@/types'

export const getVisualByKey = async (key: VisualKey): Promise<{ visual: Visual }> => {
  return bbfFetch<{ visual: Visual }>(`/visuals/${key}`)
}

export const getPublicVisuals = async (): Promise<{ visuals: Visual[] }> => {
  return bbfFetch<{ visuals: Visual[] }>('/visuals')
}
