'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ExternalLink, ImageIcon, Search, Trash2 } from 'lucide-react'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import {
    useAdminAuditProjects,
    useDeleteAuditProject,
    useDeleteAuditProjectFeaturedImage,
    useDeleteAuditProjectMainImage,
} from '@/hooks/use-admin'
import { useDebounce } from '@/hooks/use-debounce'
import { getImageUrl } from '@/lib/utils'
import type { AuditProject, PaginatedMeta } from '@/types'

interface AuditProjectsContentProps {
    initialData: { projects: AuditProject[]; meta: PaginatedMeta }
}

type DeleteTarget =
    | { type: 'project'; project: AuditProject }
    | { type: 'main'; project: AuditProject }
    | { type: 'featured'; project: AuditProject; imageId: number }

export default function AuditProjectsContent({ initialData }: AuditProjectsContentProps) {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
    const debouncedSearch = useDebounce(search, 300)

    const { data, isFetching } = useAdminAuditProjects(page, debouncedSearch, initialData)
    const deleteProject = useDeleteAuditProject()
    const deleteMainImage = useDeleteAuditProjectMainImage()
    const deleteFeaturedImage = useDeleteAuditProjectFeaturedImage()

    useEffect(() => {
        setPage(1)
    }, [debouncedSearch])

    const isLoading = deleteProject.isPending || deleteMainImage.isPending || deleteFeaturedImage.isPending
    const isEmpty = !isFetching && data?.projects.length === 0

    const handleConfirmDelete = () => {
        if (!deleteTarget) return

        if (deleteTarget.type === 'project') {
            deleteProject.mutate(deleteTarget.project.id, { onSettled: () => setDeleteTarget(null) })
            return
        }

        if (deleteTarget.type === 'main') {
            deleteMainImage.mutate(deleteTarget.project.id, { onSettled: () => setDeleteTarget(null) })
            return
        }

        deleteFeaturedImage.mutate(
            { projectId: deleteTarget.project.id, imageId: deleteTarget.imageId },
            { onSettled: () => setDeleteTarget(null) },
        )
    }

    const confirmMessage = deleteTarget?.type === 'project'
        ? `هل أنت متأكد من حذف مشروع "${deleteTarget.project.name}" بالكامل؟ لا يمكن التراجع عن هذا الإجراء.`
        : deleteTarget?.type === 'main'
            ? `هل تريد حذف الصورة الرئيسية لمشروع "${deleteTarget.project.name}"؟`
            : deleteTarget
                ? `هل تريد حذف هذه الصورة من مشروع "${deleteTarget.project.name}"؟`
                : ''

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 border border-violet-100">
                        <ImageIcon className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">مراجعة صور المشاريع</h1>
                        <p className="text-sm text-gray-400 mt-0.5">عرض وحذف الصور الرئيسية والصور المميزة للمشاريع</p>
                    </div>
                </div>
                {data && (
                    <span className="text-sm font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
                        {data.meta.total} مشروع
                    </span>
                )}
            </div>

            <div className="relative mb-6 max-w-xl">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ابحث باسم المشروع..."
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            {isFetching && !data ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-card border border-gray-50">
                            <Skeleton className="h-6 w-40 mb-4" />
                            <Skeleton className="aspect-video w-full rounded-xl mb-3" />
                            <div className="grid grid-cols-2 gap-2">
                                <Skeleton className="aspect-video rounded-lg" />
                                <Skeleton className="aspect-video rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : isEmpty ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">لا توجد مشاريع بصور للمراجعة</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {data?.projects.map((project) => (
                            <article
                                key={project.id}
                                className="bg-white rounded-2xl p-4 shadow-card border border-gray-50"
                            >
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div className="min-w-0">
                                        <h2 className="font-bold text-gray-900 truncate">{project.name}</h2>
                                        <Link
                                            href={`/dashboard/admin/projects/${project.id}`}
                                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                                        >
                                            عرض المشروع
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteTarget({ type: 'project', project })}
                                        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        حذف المشروع
                                    </button>
                                </div>

                                {project.image && (
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-gray-500">الصورة الرئيسية</span>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteTarget({ type: 'main', project })}
                                                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                حذف
                                            </button>
                                        </div>
                                        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                                            <Image
                                                src={getImageUrl(project.image)}
                                                alt={project.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 100vw, 50vw"
                                            />
                                        </div>
                                    </div>
                                )}

                                {project.featured_images.length > 0 && (
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 mb-2 block">
                                            الصور المميزة ({project.featured_images.length})
                                        </span>
                                        <div className="grid grid-cols-2 gap-2">
                                            {project.featured_images.map((featuredImage) => (
                                                <div key={featuredImage.id} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteTarget({
                                                            type: 'featured',
                                                            project,
                                                            imageId: featuredImage.id,
                                                        })}
                                                        className="absolute top-2 end-2 z-10 inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-white bg-red-600/90 hover:bg-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        حذف
                                                    </button>
                                                    <Image
                                                        src={getImageUrl(featuredImage.image)}
                                                        alt={`${project.name} - صورة مميزة`}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 640px) 50vw, 25vw"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>

                    {data && data.meta.last_page > 1 && (
                        <div className="mt-8">
                            <Pagination
                                currentPage={data.meta.current_page}
                                totalPages={data.meta.last_page}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </>
            )}

            <ConfirmModal
                open={!!deleteTarget}
                title={
                    deleteTarget?.type === 'project'
                        ? 'حذف المشروع'
                        : deleteTarget?.type === 'main'
                            ? 'حذف الصورة الرئيسية'
                            : 'حذف الصورة المميزة'
                }
                message={confirmMessage}
                confirmLabel="حذف"
                variant="danger"
                loading={isLoading}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </motion.div>
    )
}
