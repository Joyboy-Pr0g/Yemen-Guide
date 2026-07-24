'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/use-favorites'
import ProjectCardSkeletonGrid from '@/components/skeleton/project/ProjectCardSkeleton'
import { Pagination } from '@/components/ui/pagination'
import { Project, PaginatedMeta } from '@/types'
import { PublicProjectCard } from '../projects/public-project-card'

export default function FavoritesCard({ initialData }: { initialData: { projects: Project[], meta: PaginatedMeta } }) {
    const [page, setPage] = useState(1)
    const { data, isLoading } = useFavorites(initialData, page)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-400" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">المفضلة</h1>
                    {data && <p className="text-sm text-gray-400">{data.meta.total} نشاط محفوظ</p>}
                </div>
            </div>

            {isLoading ? (
                <ProjectCardSkeletonGrid count={8} />
            ) : data?.projects.length === 0 ? (
                <div className="text-center py-20">
                    <Heart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">لا توجد أنشطة في المفضلة</p>
                    <p className="text-sm text-gray-300 mt-1">اضغط على قلب أي نشاط لحفظه هنا</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {data?.projects.map((p) => <PublicProjectCard key={p.id} project={p} pathStatus="projects" />)}
                    </div>
                    {data && (
                        <Pagination currentPage={data.meta.current_page} totalPages={data.meta.last_page} onPageChange={setPage} />
                    )}
                </>
            )}
        </div>
    )
}
