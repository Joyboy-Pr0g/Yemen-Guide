import { cache } from 'react'
import { cookies } from 'next/headers'
import { fetchBackend } from '@/lib/api-proxy'
import type { User } from '@/types'

export const getAuthToken = cache(async (): Promise<string | undefined> => {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value
})

export const getSession = cache(async (): Promise<User | null> => {
  const token = await getAuthToken()
  if (!token) return null

  try {
    const res = await fetchBackend('/auth/me', token)
    if (!res.ok) return null
    const data = (await res.json()) as { user?: User }
    return data.user ?? null
  } catch {
    return null
  }
})
