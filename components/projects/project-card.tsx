import { motion } from 'framer-motion'
import { Project } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'
import { Zap, BadgeCheck, Star, MapPin, Eye, Pencil, Trash2, CheckCircle, XCircle, Clock, Loader2, User, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { RejectModal } from './reject-model'
import { Badge } from '../ui/badge'
import { useApproveProject, useRejectProject } from '@/hooks/use-admin'

interface ProjectCardProps {
    project: Project
    isAdmin?: boolean
    dashboardBase?: string
    isUpdatingProjectStatus?: boolean
    isEditingProject?: boolean
    isDeletingProject?: boolean
    isFeatured?: boolean
    onStatus?: () => void
    onFeatured?: () => void
    onEdit?: () => void
    onDelete?: () => void
}

export const ProjectCard = ({ project, onStatus, onFeatured, onEdit, onDelete, isAdmin = false, dashboardBase = '/dashboard/admin/projects', isUpdatingProjectStatus, isEditingProject, isDeletingProject, isFeatured }: ProjectCardProps) => {
    const viewHref = isAdmin ? `${dashboardBase}/${project.id}` : `/projects/${project.slug}`

    const { mutate: approveProject, isPending: isApproving } = useApproveProject()
    const { mutate: rejectProject, isPending: isRejecting } = useRejectProject()
    const [showRejectModal, setShowRejectModal] = useState(false)

    const handleApproveProject = () => {
        approveProject({ id: project.id, slug: project.slug })
    }

    const handleRejectProject = (reason: string) => {
        rejectProject({ id: project.id, slug: project.slug, reason }, {
            onSettled: () => setShowRejectModal(false),
        })
    }



    return (
        <motion.div
            whileHover={showRejectModal ? undefined : { y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow border border-gray-50 group relative"
        >
            <Link href={viewHref} className="block relative aspect-video overflow-hidden">
                <Image
                    src={getImageUrl(project.image)}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
                />

                <div className="absolute top-3 end-3 flex flex-col items-end gap-1.5">
                    {project.is_featured && (
                        <span className="bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <Zap className="w-3 h-3" />
                            مميز
                        </span>
                    )}
                    {project.sub_category && (
                        <span className="bg-white/95 backdrop-blur-sm text-primary text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                            {project.sub_category.name}
                        </span>
                    )}
                </div>
            </Link>

            <div className="p-4">
                <Link href={viewHref}>
                    <div className="flex items-center gap-2.5 mb-1.5">
                        {project.logo && (
                            <div className="w-8 h-8 relative rounded-full overflow-hidden border border-gray-100 shrink-0">
                                <Image src={getImageUrl(project.logo)} alt="logo" fill className="object-cover" sizes="32px" />
                            </div>
                        )}
                        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1 group-hover:text-primary transition-colors flex-1">
                            {project.name}
                            {project.is_verified && <BadgeCheck className="w-3.5 h-3.5 text-accent inline ms-1 shrink-0" />}
                        </h3>
                    </div>

                    <div className="flex items-center gap-1.5 mb-2.5">
                        <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                        <span className="text-sm font-semibold text-gray-700">
                            {project.average_rating > 0 ? project.average_rating.toFixed(1) : 'جديد'}
                        </span>
                    </div>

                    {(project.city || project.neighborhood) && (
                        <div className="flex items-start justify-between gap-1.5 text-gray-400 text-xs mb-3">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-300" />
                                <span className="line-clamp-1">
                                    {[project.city?.name, project.neighborhood?.name].filter(Boolean).join('، ')}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-300" />
                                <span className="line-clamp-1">
                                    {project.trader?.name}
                                </span>
                            </div>
                        </div>
                    )}
                </Link>

                {/* Approval badge for trader view */}
                {!isAdmin && project.admin_approval_status && (
                    <Badge variant={project.admin_approval_status === 'approved' ? 'green' : 'red'}>
                        {project.admin_approval_status === 'approved' ? 'موافق عليه' : 'مرفوض'}
                    </Badge>
                )}

                <div className={`grid gap-2 ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    <Link href={viewHref} className="flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold py-2.5 rounded-xl transition-colors border border-gray-100">
                        <Eye className="w-3.5 h-3.5" />
                        عرض
                    </Link>
                    {onEdit && (
                        <button
                            type="button"
                            onClick={onEdit}
                            className="flex items-center justify-center gap-1.5 bg-primary/8 hover:bg-primary/15 text-primary text-xs font-semibold py-2.5 rounded-xl transition-colors border border-primary/10"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                            تعديل
                        </button>
                    )}
                    {onStatus && (
                        <button
                            type="button"
                            disabled={isUpdatingProjectStatus}
                            onClick={onStatus}
                            className="flex items-center justify-center gap-1.5 bg-primary/8 hover:bg-primary/15 text-primary text-xs font-semibold py-2.5 rounded-xl transition-colors border border-primary/10"
                        >
                            {project.status === 'public' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            {project.status === 'public' ? 'مخفي' : 'منشور'}
                        </button>
                    )}
                    {onDelete && (
                        <button
                            type="button"
                            onClick={onDelete}
                            className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-2.5 rounded-xl transition-colors border border-red-100"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            حذف
                        </button>
                    )}
                    {isAdmin && project.admin_approval_status !== 'approved' && (
                        <button
                            type="button"
                            disabled={isApproving}
                            onClick={handleApproveProject}
                            className="flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold py-2.5 rounded-xl transition-colors border border-green-100"
                        >
                            {isApproving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                            قبول
                        </button>
                    )}
                    {isAdmin && project.admin_approval_status !== 'rejected' && (
                        <button
                            type="button"
                            disabled={isRejecting}
                            onClick={() => { setShowRejectModal(true) }}
                            className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-2.5 rounded-xl transition-colors border border-red-100"
                        >
                            {isRejecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                            رفض
                        </button>
                    )}
                    {onFeatured && (
                        <button
                            type="button"
                            title="تمييز المشروع"
                            onClick={onFeatured}
                            className="flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold py-2.5 rounded-xl transition-colors border border-gray-100"
                        >
                            <Zap className="w-3.5 h-3.5" />
                            تمييز
                        </button>
                    )}
                </div>
            </div>

            <RejectModal
                open={showRejectModal}
                loading={isRejecting}
                onCancel={() => setShowRejectModal(false)}
                onConfirm={handleRejectProject}
            />
        </motion.div>
    )
}
