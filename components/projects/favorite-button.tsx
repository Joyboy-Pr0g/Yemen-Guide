'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToggleFavorite, useProject } from '@/hooks/use-projects'
import { useCurrentUser } from '@/hooks/use-auth'

export default function FavoriteButton({ projectId, slug, isFavorite }: { projectId: number; slug: string; isFavorite: boolean }) {
  const { data: user } = useCurrentUser()
  const isAuthenticated = !!user
  const { data: liveProject } = useProject(slug, isAuthenticated)
  const { mutate: toggleFavorite, isPending } = useToggleFavorite()
  const [localFav, setLocalFav] = useState(isFavorite)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (liveProject) {
      setLocalFav(liveProject.is_favorite)
    }
  }, [liveProject?.is_favorite])

  const handleFavorite = () => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login?redirect=/projects/' + slug
      return
    }
    setLocalFav((p) => !p)
    setAnimating(true)
    setTimeout(() => setAnimating(false), 600)
    toggleFavorite({ id: projectId, slug: slug },
      {
        onSuccess: (data) => setLocalFav(data.is_favorite),
        onError: () => setLocalFav((p) => !p)
      })
  }

  return (
    <button
      onClick={handleFavorite}
      disabled={isPending || user?.role === 'admin'}
      className={cn(
        'flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border transition-all',
        localFav
          ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'
          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
        animating && 'animate-bounce-heart',
        user?.role === 'admin' && 'opacity-50 cursor-not-allowed'
      )}
    >
      <Heart className={cn('w-4 h-4', localFav ? 'fill-red-500 text-red-500' : '')} />
      {localFav ? 'محفوظ' : 'حفظ'}
    </button>
  )
}
