
import { Suspense } from 'react'
import FavoritesCard from '@/components/visitor/favorites-card'
import { getFavorites } from '@/lib/visitor/server'
import ProjectCardSkeletonGrid from '@/components/skeleton/project/ProjectCardSkeleton'

export default function FavoritesPage() {
  return <Suspense fallback={<ProjectCardSkeletonGrid count={8} />}>
    <FavoritesPageData />
  </Suspense>
}

async function FavoritesPageData() {
  const initialData = await getFavorites(1)
  return <FavoritesCard initialData={initialData} />
}