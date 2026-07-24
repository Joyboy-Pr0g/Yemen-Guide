'use client'

import { useEffect } from 'react'
import { useCurrentUser } from '@/hooks/use-auth'
import { logInteraction } from '@/lib/visitor/visitor-api'

export function useTrackProjectView(projectId: number) {
  const { data: user } = useCurrentUser()
  const isVisitor = !!user && user.role === 'visitor'

  useEffect(() => {
    if (!isVisitor || !projectId) return

    const timer = setTimeout(() => {
      logInteraction(projectId, 'view').catch(() => {})
    }, 2000)

    return () => clearTimeout(timer)
  }, [projectId, isVisitor])
}
