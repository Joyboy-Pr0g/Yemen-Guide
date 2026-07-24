'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { useProject, useRateProject } from '@/hooks/use-projects'
import { StarRating } from '@/components/ui/star-rating'
import type { Project } from '@/types'
import { useCurrentUser } from '@/hooks/use-auth'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function RatingSection({ project }: { project: Project }) {
  const router = useRouter()
  const { data: user } = useCurrentUser()
  const isAuthenticated = !!user
  const { data: liveProject } = useProject(project.slug, isAuthenticated)
  const { mutate: rateProject, isPending } = useRateProject()

  const totalRatings = project.ratings?.length ?? 0
  const hasAverage = project.average_rating > 0
  const userRating = liveProject?.user_rating ?? project.user_rating ?? 0

  const [rated, setRated] = useState(userRating > 0)
  const [myRating, setMyRating] = useState(userRating)

  useEffect(() => {
    setRated(userRating > 0)
    setMyRating(userRating)
  }, [userRating])

  const handleRate = (rating: number) => {
    if (rated || !isAuthenticated) return

    rateProject(
      { id: project.id, rating, slug: project.slug },
      {
        onSuccess: () => {
          setRated(true)
          setMyRating(rating)
          router.refresh()
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : 'حدث خطأ ما'
          toast.error(message)
        },
      },
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card">
      <h2 className="font-bold text-gray-800 mb-4">التقييم</h2>

      {hasAverage && (
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-50">
          <div className="text-4xl font-extrabold text-gray-900">
            {project.average_rating.toFixed(1)}
          </div>
          <div>
            <StarRating rating={project.average_rating} size="md" />
            <p className="text-xs text-gray-400 mt-1">
              متوسط التقييم
              {totalRatings > 0 && (
                <span className="text-gray-500 font-medium"> · {totalRatings} تقييم</span>
              )}
            </p>
          </div>
        </div>
      )}

      {!hasAverage && totalRatings === 0 && (
        <p className="text-sm text-gray-400 mb-5 pb-5 border-b border-gray-50">لا توجد تقييمات بعد</p>
      )}

      {isAuthenticated ? (
        user?.role !== 'visitor' ? (
          <p className="text-sm text-gray-400">
            لا يمكنك تقييم هذا النشاط
          </p>
        ) : (
        <div>
          {rated && myRating > 0 ? (
            <>
              <p className="text-sm text-gray-600 mb-3">تقييمك لهذا النشاط</p>
              <StarRating rating={myRating} size="lg" />
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <Star className="w-3 h-3 fill-accent text-accent" />
                قيّمت هذا النشاط بـ {myRating} {myRating === 1 ? 'نجمة' : 'نجوم'}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-3">قيّم هذا النشاط</p>
              <StarRating
                rating={myRating}
                interactive
                onRate={handleRate}
                disabled={isPending}
                size="lg"
              />
            </>
          )}
        </div>
        )
      ) : (
        <p className="text-sm text-gray-400">
          <a href="/auth/login" className="text-primary font-medium hover:underline">سجّل الدخول</a>
          {' '}لتقييم هذا النشاط
        </p>
      )}
    </div>
  )
}
