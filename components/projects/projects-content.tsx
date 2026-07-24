'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ProjectCard } from './project-card'
import { useDebounce } from '@/hooks/use-debounce'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Eye, Plus, RotateCcw, Zap, ZapOff, Pencil, Trash2, CheckCircle, XCircle, Clock, Loader2, EyeOff } from 'lucide-react'
import { useAdminProjects, useSetProjectFeatured, useCreateProject, useApproveProject, useRejectProject } from '@/hooks/use-admin'
import { useTraderProjects, useCreateTraderProject, useUpdateTraderProject, useDeleteTraderProject, useUpdateProjectStatus } from '@/hooks/use-trader'
import { Pagination } from '@/components/ui/pagination'
import { ProjectsFilterBar } from './ProjectFilterBar'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { getStatusLabel, getStatusColor, getImageUrl } from '@/lib/utils'
import { Search, SlidersHorizontal } from 'lucide-react'
import type { Project, PaginatedMeta, ProjectFilters, City, User, Category } from '@/types'
import { CreateProjectModal } from './create-project'
import { EditProjectModal } from './edit-project'
import ProjectCardSkeleton from '../skeleton/project/ProjectCardSkeleton'
import ProjectTablesSkeleton from '../skeleton/project/ProjecTablesSkeleton'
import { Badge } from '../ui/badge'
import { RejectModal } from './reject-model'
import toast from 'react-hot-toast'


interface ProjectsPageContentProps {
    initialData: { projects: Project[], meta: PaginatedMeta }
    cities: City[]
    categories: Category[]
    traders?: { users: User[], meta: PaginatedMeta } | null
    isAdmin: boolean
}

export default function ProjectsPageContent({ initialData, cities, categories, traders, isAdmin = false }: ProjectsPageContentProps) {
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 300)
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [deletingProject, setDeletingProject] = useState<Project | null>(null)
    const [showFilters, setShowFilters] = useState(false)
    const [rejectingProject, setRejectingProject] = useState<Project | null>(null)
    const [filters, setFilters] = useState<ProjectFilters>({
        status: '',
        admin_approval_status: '',
        featured: '',
        city_id: '',
        neighborhood_id: '',
        sub_category_id: '',
        category_id: '',
        trader_id: '',
        verified: '',
    })

    const traderFilters = {
        status: filters.status,
        admin_approval_status: filters.admin_approval_status,
        featured: filters.featured,
        city_id: filters.city_id,
        neighborhood_id: filters.neighborhood_id,
        sub_category_id: filters.sub_category_id,
        category_id: filters.category_id,
        verified: filters.verified,
    }

    const { data: adminData, isFetching: adminFetching } = useAdminProjects(
        page,
        debouncedSearch,
        filters,
        initialData,
        isAdmin,
    )
    const { data: traderData, isFetching: traderFetching } = useTraderProjects(
        page,
        debouncedSearch,
        traderFilters,
        initialData,
        !isAdmin,
    )

    const { mutate: createAdminProject, isPending: isCreatingAdminProject, error: createAdminProjectError } = useCreateProject()
    const { mutate: createTraderProject, isPending: isCreatingTraderProject, error: createTraderProjectError } = useCreateTraderProject()
    const { mutate: updateTraderProject, isPending: isUpdatingTraderProject, error: updateTraderProjectError } = useUpdateTraderProject()
    const { mutate: deleteTraderProject, isPending: isDeletingTraderProject } = useDeleteTraderProject()
    const { mutate: setFeatured } = useSetProjectFeatured()
    const { mutate: updateProjectStatus, isPending: isUpdatingProjectStatus } = useUpdateProjectStatus()
    const { mutate: approveProject, isPending: isApproving } = useApproveProject()
    const { mutate: rejectProject, isPending: isRejecting } = useRejectProject()

    const data = isAdmin ? adminData : traderData
    const isFetching = isAdmin ? adminFetching : traderFetching
    const isCreatingProject = isAdmin ? isCreatingAdminProject : isCreatingTraderProject
    const createProjectError = isAdmin ? createAdminProjectError : createTraderProjectError
    const createProject = isAdmin ? createAdminProject : createTraderProject
    const dashboardBase = isAdmin ? '/dashboard/admin/projects' : '/dashboard/trader/projects'

    const resetFilters = () => {
        setFilters({
            status: '',
            admin_approval_status: '',
            featured: '',
            city_id: '',
            neighborhood_id: '',
            sub_category_id: '',
            category_id: '',
            trader_id: '',
            verified: '',
        })
        setPage(1)
    }

    const handleCreateProject = (formData: FormData) => {
        createProject(formData, {
            onSuccess: () => {
                setShowProjectForm(false)
                router.refresh()
            },
        })
    }

    const handleUpdateProject = (formData: FormData) => {
        if (!editingProject) return

        updateTraderProject(
            { id: editingProject.id, data: formData },
            {
                onSuccess: () => {
                    setEditingProject(null)
                    router.refresh()
                },
            },
        )
    }

    const handleDeleteProject = () => {
        if (!deletingProject) return

        deleteTraderProject(deletingProject.id, {
            onSettled: () => {
                setDeletingProject(null)
                router.refresh()
            },
        })
    }

    const handleApproveProject = (project: Project) => {
        approveProject({ id: project.id, slug: project.slug })
    }

    const handleRejectProject = (project: Project, reason: string) => {
        rejectProject({ id: project.id, slug: project.slug, reason }, { onSettled: () => setRejectingProject(null) })
    }

    useEffect(() => {
        setPage(1)
    }, [debouncedSearch, filters])

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-gray-900">المشاريع</h1>
                {data && <p className="text-sm text-gray-400">{data.meta.total} مشروع</p>}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 w-full sm:max-w-[600px]">
                    <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="البحث بالاسم..."
                        className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-2.5 text-sm outline-none focus:border-primary"
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 border w-full sm:w-auto border-gray-200 rounded-xl px-4 py-2 hover:border-primary hover:text-primary transition-colors"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            {showFilters ? 'إغلاق الفلاتر' : 'الفلاتر'}
                        </button>
                        {showFilters && (
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-2 text-sm font-medium text-gray-600 w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2 hover:border-primary hover:text-primary transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                إعادة الفلاتر
                            </button>
                        )}
                    </div>
                    <button
                        disabled={isCreatingProject}
                        className="w-full sm:w-auto flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                        onClick={() => setShowProjectForm(true)}
                    >
                        <Plus className="w-4 h-4" />
                        إضافة مشروع
                    </button>
                </div>
            </div>

            {!isAdmin && (
                <div className="mb-4 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                    <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>أي مشروع جديد أو محتوى معدّل سيُرسل للمراجعة قبل النشر للعموم.</span>
                </div>
            )}

            {showFilters && (
                <ProjectsFilterBar
                    can_select_trader={isAdmin}
                    can_select_status={true}
                    can_select_approval_status={isAdmin}
                    can_select_featured={isAdmin}
                    can_select_verified={true}
                    filters={filters}
                    setFilters={setFilters}
                    cities={cities}
                    categories={categories}
                    traders={traders}
                />
            )}

            <div className="xl:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {isFetching ? (
                    <ProjectCardSkeleton count={8} />
                ) : data?.projects.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 col-span-full">
                        <p className="text-lg font-medium">لا توجد نتائج</p>
                        <p className="text-sm mt-1">جرّب تغيير معايير البحث</p>
                    </div>
                ) : data?.projects.map((project: Project) => (
                    <ProjectCard
                        key={project.id}
                        isAdmin={isAdmin}
                        project={project}
                        dashboardBase={dashboardBase}
                        onFeatured={isAdmin ? () => {
                            setFeatured({
                                id: project.id,
                                slug: project.slug,
                                is_featured: !project.is_featured,
                                featured_until: project.is_featured ? null : new Date(Date.now() + 30 * 86400000).toISOString(),
                            })
                        } : undefined}
                        isUpdatingProjectStatus={isUpdatingProjectStatus}
                        isEditingProject={editingProject === project}
                        isDeletingProject={deletingProject === project}
                        isFeatured={project.is_featured}
                        onStatus={!isAdmin ? () => updateProjectStatus({ id: project.id, slug: project.slug, status: project.status === 'public' ? 'draft' : 'public' }) : undefined}
                        onEdit={!isAdmin ? () => setEditingProject(project) : undefined}
                        onDelete={!isAdmin ? () => setDeletingProject(project) : undefined}
                    />
                ))}
            </div>

            <div className="hidden xl:block bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-50 bg-gray-50/50">
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">المشروع</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">الحالة</th>
                                {isAdmin && <th className="text-right px-4 py-3 font-semibold text-gray-600">موافقة الإدارة</th>}
                                {!isAdmin && <th className="text-right px-4 py-3 font-semibold text-gray-600">حالة المراجعة</th>}
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">التحقق</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">المشاهدات</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isFetching
                                ?
                                <ProjectTablesSkeleton isAdmin={isAdmin} />
                                : data?.projects.map((project: Project) => (
                                    <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 relative shrink-0">
                                                    <Image src={getImageUrl(project.image)} alt={project.name} fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{project.name}</p>
                                                    {project.trader && <p className="text-xs text-gray-400">{project.trader.name}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(project.status)}`}>
                                                {getStatusLabel(project.status)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-1">
                                                <Badge variant={project.admin_approval_status === 'approved' ? 'green' : 'red'}>
                                                    {project.admin_approval_status === 'approved' ? 'موافق عليه' : 'مرفوض'}
                                                </Badge>
                                                {!isAdmin && project.admin_message && (
                                                    <p
                                                        onClick={() => toast.success(project.admin_message as string)}
                                                        className="cursor-pointer text-xs text-gray-400 max-w-[180px] truncate" title={project.admin_message}>
                                                        {project.admin_message}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(project.is_verified ? 'approved' : 'rejected')}`}>
                                                {project.is_verified ? 'تم التحقق' : 'غير متحقق'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3.5 h-3.5" />
                                                {project.views_count}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Link
                                                    href={`${dashboardBase}/${project.id}`}
                                                    title="عرض المشروع"
                                                    className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold py-1.5 px-3 rounded-xl transition-colors border border-gray-100"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                </Link>
                                                {!isAdmin && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingProject(project)}
                                                            className="flex items-center gap-1.5 bg-primary/8 hover:bg-primary/15 text-primary text-xs font-semibold py-1.5 px-3 rounded-xl transition-colors border border-primary/10"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                            تعديل
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={isUpdatingProjectStatus}
                                                            onClick={() => updateProjectStatus({ id: project.id, slug: project.slug, status: project.status === 'public' ? 'draft' : 'public' })}
                                                            className="flex items-center gap-1.5 bg-primary/8 hover:bg-primary/15 text-primary text-xs font-semibold py-1.5 px-3 rounded-xl transition-colors border border-primary/10"
                                                        >
                                                            {isUpdatingProjectStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : project.status === 'public' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                            {project.status === 'public' ? 'إلغاء النشر' : 'نشر'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setDeletingProject(project)}
                                                            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-1.5 px-3 rounded-xl transition-colors border border-red-100"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            حذف
                                                        </button>
                                                    </>
                                                )}
                                                {isAdmin && (
                                                    <>
                                                        {project.admin_approval_status !== 'approved' && (
                                                            <button
                                                                onClick={() => handleApproveProject(project)}
                                                                className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold py-1.5 px-3 rounded-xl transition-colors border border-green-100"
                                                                title="الموافقة على المشروع"
                                                            >
                                                                {isApproving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                                                قبول
                                                            </button>
                                                        )}
                                                        {project.admin_approval_status !== 'rejected' && (
                                                            <button
                                                                onClick={() => setRejectingProject(project)}
                                                                className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-1.5 px-3 rounded-xl transition-colors border border-red-100"
                                                                title="رفض المشروع"
                                                            >
                                                                <XCircle className="w-3.5 h-3.5" />
                                                                رفض
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => setFeatured({ id: project.id, slug: project.slug, is_featured: !project.is_featured, featured_until: project.is_featured ? null : new Date(Date.now() + 30 * 86400000).toISOString() })}
                                                            className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold py-1.5 px-3 rounded-xl transition-colors border border-gray-100"
                                                            title={project.is_featured ? 'إلغاء التمييز' : 'تمييز'}
                                                        >
                                                            {project.is_featured ? <Zap className="w-3.5 h-3.5" /> : <ZapOff className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {data && <Pagination currentPage={data.meta.current_page} totalPages={data.meta.last_page} onPageChange={setPage} />}

            {showProjectForm && (
                <CreateProjectModal
                    isAdmin={isAdmin}
                    open={showProjectForm}
                    onClose={() => setShowProjectForm(false)}
                    onSubmit={handleCreateProject}
                    loading={isCreatingProject}
                    errors={createProjectError?.errors}
                    categories={categories}
                    cities={cities}
                    traders={traders}
                />
            )}

            {!isAdmin && editingProject && (
                <EditProjectModal
                    open={!!editingProject}
                    project={editingProject}
                    onClose={() => setEditingProject(null)}
                    onSubmit={handleUpdateProject}
                    loading={isUpdatingTraderProject}
                    errors={updateTraderProjectError?.errors}
                    categories={categories}
                    cities={cities}
                />
            )}

            <ConfirmModal
                open={!!deletingProject}
                title="حذف المشروع"
                message={`هل تريد حذف "${deletingProject?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
                confirmLabel="حذف"
                variant="danger"
                loading={isDeletingTraderProject}
                onConfirm={handleDeleteProject}
                onCancel={() => setDeletingProject(null)}
            />
            <RejectModal
                open={!!rejectingProject}
                loading={isRejecting}
                onCancel={() => setRejectingProject(null)}
                onConfirm={(reason) => rejectingProject && handleRejectProject(rejectingProject, reason)}
            />
        </div>
    )
}
