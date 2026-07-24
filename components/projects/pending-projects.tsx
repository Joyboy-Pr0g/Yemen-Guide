'use client'

import { ProjectCard } from '@/components/projects/project-card'
import { useAdminPendingProjects } from '@/hooks/use-admin'
import { Project, PaginatedMeta } from '@/types'
import { useEffect, useState } from 'react'
import { Pagination } from '@/components/ui/pagination'
import { useDebounce } from '@/hooks/use-debounce'
import ProjectCardSkeleton from '@/components/skeleton/project/ProjectCardSkeleton'
import { Clock, Search, Inbox } from 'lucide-react'

interface PendingProjectsProps {
    initialData: { projects: Project[], meta: PaginatedMeta }
}

export function PendingProjects({ initialData }: PendingProjectsProps) {
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 300)

    const [page, setPage] = useState(1)

    const { data: adminData, isFetching: adminFetching } = useAdminPendingProjects(
        page,
        debouncedSearch,
        initialData,
    )


    useEffect(() => {
        setPage(1)
    }, [debouncedSearch])

    const isEmpty = !adminFetching && adminData?.projects.length === 0
    const hasSearch = debouncedSearch.trim().length > 0

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 border border-amber-100">
                        <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">المشاريع المعلقة</h1>
                        <p className="text-sm text-gray-400 mt-0.5">مراجعة واعتماد المشاريع الجديدة</p>
                    </div>
                </div>
                {adminData && (
                    <span className="text-sm font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
                        {adminData.meta.total} مشروع
                    </span>
                )}
            </div>

            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>المشاريع التالية بانتظار موافقتك قبل أن تظهر للعموم.</span>
            </div>

            <div className="relative w-full sm:max-w-[600px]">
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="البحث بالاسم..."
                    className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-2.5 text-sm outline-none focus:border-primary bg-white shadow-sm"
                />
            </div>

            {adminFetching ? (
                <ProjectCardSkeleton count={8} />
            ) : isEmpty ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-card">
                    <Inbox className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                    {hasSearch ? (
                        <>
                            <p className="text-lg font-medium text-gray-500">لا توجد نتائج</p>
                            <p className="text-sm text-gray-400 mt-1">جرّب تغيير كلمة البحث</p>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-medium text-gray-500">لا توجد مشاريع معلقة</p>
                            <p className="text-sm text-gray-400 mt-1">جميع المشاريع تمت مراجعتها</p>
                        </>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                    {adminData?.projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            isAdmin={true}
                        />
                    ))}
                </div>
            )}

            {adminData?.meta && adminData.meta.last_page > 1 && (
                <Pagination
                    currentPage={adminData.meta.current_page}
                    totalPages={adminData.meta.last_page}
                    onPageChange={setPage}
                />
            )}
        </div>
    )
}
