'use client'

import { motion } from 'framer-motion'
import { Project } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'
import { Zap, BadgeCheck, Star, MapPin } from 'lucide-react'

export const PublicProjectCard = ({ project, pathStatus }: { project: Project, pathStatus: 'projects' | 'admin' | 'trader' }) => {
    const href = pathStatus === 'projects' ? `/projects/${project.slug}` :
        pathStatus === 'admin' ? `/dashboard/admin/projects/${project.id}` :
            `/dashboard/trader/projects/${project.id}`
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow border border-gray-50 group relative"
        >
            {/* Image */}
            <Link href={href} className="block relative aspect-video overflow-hidden">
                <Image
                    src={getImageUrl(project.image)}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
                />

                {/* Top badges row — always in top-end corner */}
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

            {/* Body */}
            <div className="p-4">
                <Link href={href}>
                    {/* Name row with logo */}
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

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-2.5">
                        <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                        <span className="text-sm font-semibold text-gray-700">
                            {project.average_rating > 0 ? project.average_rating.toFixed(1) : 'جديد'}
                        </span>
                    </div>

                    {/* Address */}
                    {(project.city || project.neighborhood) && (
                        <div className="flex items-start gap-1.5 text-gray-400 text-xs mb-3">
                            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-300" />
                            <span className="line-clamp-1">
                                {[project.city?.name, project.neighborhood?.name].filter(Boolean).join('، ')}
                            </span>
                        </div>
                    )}
                </Link>

            </div>
        </motion.div>
    )
}