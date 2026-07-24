'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ProjectImageGallery from './project-image-gallery'
import { Phone, MessageCircle, MapPin, Eye, BadgeCheck, Star, ChevronRight, Navigation } from 'lucide-react'
import { getImageUrl, getWhatsAppUrl } from '@/lib/utils'
import RatingSection from './rating-section'
import FavoriteButton from './favorite-button'
import ShareButton from './share-button'
import ViewPing from './view-ping'
import { Project } from '@/types'
import { useTrackProjectView } from '@/hooks/use-track-project-view'
import { Report } from './report'

const ProjectMap = dynamic(() => import('./project-map'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 animate-pulse" />,
})

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
}

const slideFromLeft = {
    hidden: { opacity: 0, x: -48 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
}

const mainStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const sidebarStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

export default function ProjectDetails({ project, trackView = true }: { project: Project; trackView?: boolean }) {
    useTrackProjectView(project.id)

    const hasCoords = project.latitude && project.longitude
    const googleMapsUrl = hasCoords
        ? `https://www.google.com/maps?q=${project.latitude},${project.longitude}`
        : null

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <motion.nav
                className="flex items-center gap-1.5 text-sm text-gray-400 mb-6"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
            >
                <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/projects" className="hover:text-primary transition-colors">الأعمال</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-600 font-medium">{project.name}</span>
            </motion.nav>

            {trackView && project.slug && <ViewPing slug={project.slug} />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    className="lg:col-span-2 space-y-6"
                    initial="hidden"
                    animate="visible"
                    variants={mainStagger}
                >
                    <motion.div variants={fadeUp}>
                        <ProjectImageGallery
                            name={project.name}
                            mainImage={project.image}
                            featuredImages={project.featured_images}
                            isFeatured={project.is_featured}
                        />
                    </motion.div>

                    <motion.div variants={fadeUp} className="bg-white rounded-2xl p-6 shadow-card">
                        <div className="flex items-start gap-4">
                            {project.logo && (
                                <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-gray-100 shadow-sm shrink-0">
                                    <Image src={getImageUrl(project.logo)} alt={`${project.name} logo`} fill className="object-cover" sizes="64px" />
                                </div>
                            )}

                            <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">{project.name}</h1>
                                    {project.is_verified && <BadgeCheck className="w-6 h-6 text-accent shrink-0" />}
                                </div>

                                <div className="flex items-center gap-3 mt-2 flex-wrap">
                                    {project.sub_category && (
                                        <Link
                                            href={`/projects?sub_category_id=${project.sub_category.id}`}
                                            rel="nofollow"
                                            className="text-xs bg-primary/8 text-primary font-medium px-2.5 py-1 rounded-full hover:bg-primary/15 transition-colors"
                                        >
                                            {project.sub_category.name}
                                        </Link>
                                    )}
                                    {project.average_rating > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-accent text-accent" />
                                            <span className="text-sm font-bold text-gray-700">{project.average_rating.toFixed(1)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>{project.views_count > 0 ? project.views_count.toLocaleString() : 0} مشاهدة</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-4">
                                    <FavoriteButton projectId={project.id} slug={project.slug} isFavorite={project.is_favorite ?? false} />
                                    <ShareButton name={project.name} />
                                    <Report slug={project.slug} reports={project.reports ?? []} />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} className="bg-white rounded-2xl p-6 shadow-card">
                        <h2 className="font-bold text-gray-800 mb-3">عن النشاط</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
                    </motion.div>

                    {hasCoords && (
                        <motion.div variants={fadeUp} className="bg-white rounded-2xl p-5 shadow-card">
                            <h2 className="font-bold text-gray-800 mb-3">الموقع على الخريطة</h2>
                            <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-100 h-72 [&_.leaflet-container]:rounded-xl">
                                <ProjectMap
                                    latitude={project.latitude!}
                                    longitude={project.longitude!}
                                    name={project.name}
                                />
                            </div>
                            <a
                                href={googleMapsUrl!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 rounded-xl bg-primary/8 text-primary text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                <Navigation className="w-4 h-4" />
                                الاتجاهات على خرائط Google
                            </a>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={sidebarStagger}
                >
                    <motion.div variants={slideFromLeft} className="bg-white rounded-2xl p-5 shadow-card space-y-3">
                        <h3 className="font-bold text-gray-800 mb-4">معلومات التواصل</h3>
                        <a
                            href={`tel:${project.phone_number}`}
                            className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-xl p-3.5 transition-colors group"
                        >
                            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                                <Phone className="w-4 h-4 text-primary group-hover:text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">رقم الهاتف</p>
                                <p className="text-sm font-semibold" dir="ltr">{project.phone_number}</p>
                            </div>
                        </a>
                        {project.whatsapp_number && (
                            <a
                                href={getWhatsAppUrl(project.whatsapp_number)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-green-50 hover:bg-green-100 text-green-800 rounded-xl p-3.5 transition-colors group"
                            >
                                <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                                    <MessageCircle className="w-4 h-4 text-green-600 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-green-600">واتساب</p>
                                    <p className="text-sm font-semibold" dir="ltr">{project.whatsapp_number}</p>
                                </div>
                            </a>
                        )}
                    </motion.div>

                    <motion.div variants={slideFromLeft} className="bg-white rounded-2xl p-5 shadow-card">
                        <h3 className="font-bold text-gray-800 mb-3">الموقع</h3>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                                {[project.city?.name, project.neighborhood?.name, project.address_details].filter(Boolean).join('، ')}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div variants={slideFromLeft}>
                        <Suspense>
                            <RatingSection project={project} />
                        </Suspense>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
