'use client'

import { AdsBanner } from '@/components/ads/ads-banner'
import * as LucideIcons from 'lucide-react'
import Link from 'next/link'
import { MapPin, Zap, Store, Utensils, HeartPulse, Car, Wrench, GraduationCap, Building2, ShoppingBag, Users, CheckCircle2, Info, ChevronLeft, ChevronRight } from 'lucide-react'
import { CategoryCard, CategoryCardSkeleton } from '@/components/categories/category-card'
import { PublicProjectCard } from '@/components/projects/public-project-card'
import type { Category, City, Ad, Project } from '@/types'
import ProjectCardSkeletonGrid from '@/components/skeleton/project/ProjectCardSkeleton'
import SearchBar from '@/components/search/search-bar'
import { Suspense, useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
}

const heroStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const sectionStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const sectionHeader = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

const scrollItem = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease, delay: i * 0.06 },
    }),
}

const viewport = { once: true, amount: 0.15 }

const getCategoryIcon = (name: string) => {
    const Icon = (LucideIcons as any)[name]
    return Icon ?? LucideIcons.Store
}

function QuickSearchTags({ cats }: { cats: Category[] }) {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scrollTags = (direction: -1 | 1) => {
        const el = scrollRef.current
        if (!el) return
        const isRtl = getComputedStyle(el).direction === 'rtl'
        const amount = direction * 220 * (isRtl ? -1 : 1)
        el.scrollBy({ left: amount, behavior: 'smooth' })
    }

    return (
        <div>
            <div className="flex items-center mb-2">
                <span className="text-white/40 text-xs font-medium ms-1 shrink-0">بحث سريع:</span>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => scrollTags(-1)}
                    aria-label="تمرير لليسار"
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white transition-all backdrop-blur-sm"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

                <div
                    ref={scrollRef}
                    className="flex flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {cats.map((cat, index) => {
                        const Icon = getCategoryIcon(cat.icon ?? 'Store')
                        return (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.35, delay: 0.7 + index * 0.04, ease }}
                                className="shrink-0"
                            >
                                <Link
                                    href={`/projects?category_id=${cat.id}`}
                                    rel="nofollow"
                                    className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white text-xs font-medium px-3 py-1.5 rounded-full transition-all backdrop-blur-sm hover:shadow-md"
                                >
                                    <Icon className="w-3 h-3" />
                                    {cat.name}
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>

                <button
                    type="button"
                    onClick={() => scrollTags(1)}
                    aria-label="تمرير لليمين"
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white transition-all backdrop-blur-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

const STATS = [
    { icon: Store, value: '+1,000', label: 'نشاط تجاري' },
    { icon: MapPin, value: '22', label: 'محافظة يمنية' },
    { icon: CheckCircle2, value: '+200', label: 'نشاط موثّق' },
    { icon: Users, value: '+5,000', label: 'مستخدم نشط' },
]

const ABOUT_SLIDES = [
    {
        title: 'دليلك الشامل في اليمن',
        text: 'دُّلني-اليمن يساعدك على اكتشاف كل ما تحتاجه في اليمن من أنشطة تجارية ومحلات وخدمات موثّقة، في مكان واحد سهل الاستخدام.',
    },
    {
        title: 'آلاف الأنشطة الموثّقة',
        text: 'يضم الدليل أكثر من ألف نشاط تجاري موزّع على 14 محافظة يمنية، من بينها أكثر من 200 نشاط موثّق، ويثق به أكثر من 5000 مستخدم نشط شهرياً.',
    },
    {
        title: 'تصفح وتواصل بسهولة',
        text: 'يمكنك تصفح الأنشطة حسب التصنيف مثل المطاعم والصيدليات والعقارات والسيارات والتعليم، أو حسب المدينة، والاطلاع على تقييمات المستخدمين، والتواصل مباشرة مع أصحاب المتاجر عبر الهاتف أو واتساب.',
    },
    {
        title: 'ابحث بسرعة ووضوح',
        text: 'سواء كنت تبحث عن مطعم قريب أو خدمة موثوقة أو نشاط تجاري جديد، دُّلني-اليمن يقدّم لك المعلومات التي تحتاجها بسرعة ووضوح.',
    },
]

function AboutSlider() {
    const [index, setIndex] = useState(0)

    const goTo = useCallback((next: number) => {
        setIndex((next + ABOUT_SLIDES.length) % ABOUT_SLIDES.length)
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((current) => (current + 1) % ABOUT_SLIDES.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const slide = ABOUT_SLIDES[index]

    return (
        <div className="mt-0 max-w-3xl mx-auto text-start">
            <div className="relative bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-5 sm:px-6 sm:py-6 shadow-lg overflow-hidden">


                <div className="relative min-h-[88px] sm:min-h-[72px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.35, ease }}
                        >
                            <p className="text-accent/90 text-xs sm:text-sm font-semibold mb-2">{slide.title}</p>
                            <p className="text-white/75 text-sm sm:text-[15px] leading-relaxed">{slide.text}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex items-center justify-center gap-1.5 mt-5 pt-4 border-t border-white/10">
                    {ABOUT_SLIDES.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`الشريحة ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all ${
                                i === index ? 'w-6 bg-accent' : 'w-1.5 bg-white/30 hover:bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

interface HomeContentProps {
    cats: Category[]
    cities: City[]
    citiesWithProjects: { city: City; projects: Project[] }[]
    hAds: Ad[]
    usAds: Ad[]
    featuredProjects: Project[]
}

// Floating background icon — purely decorative
function FloatingIcon({ icon: Icon, className, delay = 0 }: { icon: React.ElementType; className: string; delay?: number }) {
    return (
        <motion.div
            className={`absolute pointer-events-none select-none ${className}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
            transition={{
                opacity: { duration: 0.6, delay },
                scale: { duration: 0.6, delay },
                y: { duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay },
            }}
        >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-sm">
                <Icon className="w-6 h-6 text-white/25" />
            </div>
        </motion.div>
    )
}
export const HomeContent = ({ cats, cities, citiesWithProjects, hAds, usAds, featuredProjects }: HomeContentProps) => {


    return (
        <div className="bg-background">

            {/* ─── HERO ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, #002623 0%, #054239 40%, #0a6b5a 70%, #428177 100%)',
                minHeight: 520,
            }}>

                {/* Mesh grid overlay */}
                <div className="absolute inset-0 opacity-[0.07]" style={{
                    backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
                    backgroundSize: '48px 48px',
                }} />

                {/* Radial glow centre */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[700px] h-[700px] rounded-full opacity-[0.12]" style={{
                        background: 'radial-gradient(circle, #b9a779 0%, transparent 70%)',
                    }} />
                </div>

                {/* Bottom wave */}
                <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ lineHeight: 0 }}>
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 60 }}>
                        <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="#faf9f7" />
                    </svg>
                </div>

                {/* Floating decorative icons */}
                <FloatingIcon icon={Store} className="top-10 start-[5%]  rotate-12  hidden lg:flex" delay={0.2} />
                <FloatingIcon icon={Utensils} className="top-24 start-[12%] -rotate-6  hidden lg:flex" delay={0.35} />
                <FloatingIcon icon={HeartPulse} className="top-8  start-[20%] rotate-6   hidden xl:flex" delay={0.5} />
                <FloatingIcon icon={Car} className="bottom-16 start-[8%] rotate-3  hidden lg:flex" delay={0.65} />
                <FloatingIcon icon={GraduationCap} className="top-10 end-[5%]   -rotate-12  hidden lg:flex" delay={0.2} />
                <FloatingIcon icon={Wrench} className="top-24 end-[12%]  rotate-6   hidden lg:flex" delay={0.35} />
                <FloatingIcon icon={ShoppingBag} className="top-8  end-[20%]  -rotate-6  hidden xl:flex" delay={0.5} />
                <FloatingIcon icon={Building2} className="bottom-16 end-[8%] -rotate-3  hidden lg:flex" delay={0.65} />

                {/* Hero content */}
                <motion.div
                    className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-10 sm:pt-20 sm:pb-12 text-center"
                    initial="hidden"
                    animate="visible"
                    variants={heroStagger}
                >

                    {/* Badge pill */}
                    <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-semibold px-5 py-2 rounded-full mb-8 border border-white/20 backdrop-blur-sm shadow-sm">                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse shrink-0" />
                        دليل الأعمال والخدمات الأول في اليمن
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse shrink-0" />
                    </motion.div>

                    {/* Headline */}
                    <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight mb-4 drop-shadow-lg">                        اكتشف كل ما تحتاجه
                        <br />
                        <span className="relative inline-block mt-2">
                            <span className="text-accent">في اليمن</span>
                            {/* Underline accent */}
                            <svg className="absolute -bottom-2 start-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 6 Q100 2 198 6" stroke="#b9a779" strokeWidth="3" strokeLinecap="round" fill="none" />
                            </svg>
                        </span>
                    </motion.h1>

                    <motion.p variants={fadeUp} className="text-white/65 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">                        أكثر من ألف نشاط تجاري موثّق — من المطاعم والصيدليات إلى العقارات والخدمات
                    </motion.p>

                    {/* Search bar */}
                    <motion.div variants={fadeUp} className="relative z-30 w-full max-w-5xl mx-auto">
                        <Suspense>
                            <SearchBar initalCities={cities} initalCategories={cats} />
                        </Suspense>
                    </motion.div>

                    {/* Quick search tags */}
                    <motion.div variants={fadeUp} className="relative z-10 mt-6">
                        <QuickSearchTags cats={cats} />
                    </motion.div>
                </motion.div>

                {/* Stats bar + about slider */}
                <div className="relative z-20 px-4 pb-20 sm:pb-24 flex flex-col items-center gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.85, ease }}
                    >
                        <div className="hidden sm:flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-3 shadow-xl">
                            {STATS.map(({ icon: Icon, value, label }, i) => (
                                <motion.div
                                    key={label}
                                    className="flex items-center"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 1 + i * 0.08, ease }}
                                >
                                    <div className="flex items-center gap-2 px-4">
                                        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                                            <Icon className="w-4 h-4 text-accent" />
                                        </div>
                                        <div className="text-start">
                                            <p className="text-white font-black text-sm leading-none">{value}</p>
                                            <p className="text-white/55 text-[11px] leading-tight mt-0.5">{label}</p>
                                        </div>
                                    </div>
                                    {i < STATS.length - 1 && <div className="w-px h-8 bg-white/15 shrink-0" />}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1, ease }}
                        className="w-full max-w-3xl"
                    >
                        <AboutSlider />
                    </motion.div>
                </div>            </section>

            {/* ─── CONTENT ──────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* Under search ads */}
                {usAds && usAds.length > 0 && (
                    <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={viewport}
                        transition={{ duration: 0.5, ease }}
                    >
                        <AdsBanner ads={usAds} columns={3} />
                    </motion.div>
                )}

                {/* Home ads */}
                {hAds && hAds.length > 0 && (
                    <motion.div
                        className="mt-4"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={viewport}
                        transition={{ duration: 0.5, ease }}
                    >
                        <AdsBanner ads={hAds} columns={3} />
                    </motion.div>
                )}

                {/* Categories */}
                <motion.section
                    className="mt-14"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    variants={sectionStagger}
                >
                    <motion.div variants={sectionHeader} className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">تصفح حسب التصنيف</h2>
                            <p className="text-sm text-gray-400 mt-1">اختر تصنيفاً للعثور على ما تريد</p>
                        </div>
                        <Link href="/categories" className="text-sm font-semibold text-primary hover:underline">
                            عرض الكل
                        </Link>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {cats.length > 0
                            ? cats.slice(0, 12).map((cat, index) => (
                                <motion.div
                                    key={cat.id}
                                    custom={index}
                                    variants={scrollItem}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.1 }}
                                >
                                    <CategoryCard category={cat} />
                                </motion.div>
                            ))
                            : Array.from({ length: 12 }).map((_, i) => <CategoryCardSkeleton key={i} />)
                        }
                    </div>
                </motion.section>

                {/* Featured projects */}
                {featuredProjects.length > 0 && (
                    <motion.section
                        className="mt-14"
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewport}
                        variants={sectionStagger}
                    >
                        {/* Section header with accent strip */}
                        <motion.div variants={sectionHeader} className="flex items-center justify-between mb-6">                            <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent/15 rounded-xl flex items-center justify-center">
                                <Zap className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">الأنشطة المميزة</h2>
                                <p className="text-sm text-gray-400 mt-0.5">أنشطة تجارية مختارة ومميزة</p>
                            </div>
                        </div>
                            <Link href="/projects?is_featured=1" rel="nofollow" className="text-sm font-semibold text-primary hover:underline">
                                عرض الكل
                            </Link>
                        </motion.div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {featuredProjects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    custom={index}
                                    variants={scrollItem}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.1 }}
                                >
                                    <PublicProjectCard project={project} pathStatus="projects" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Cities with projects */}
                <motion.section
                    className="mt-14 mb-16 space-y-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    variants={sectionStagger}
                >
                    <motion.div variants={sectionHeader} className="flex items-center justify-between">                        <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">أحدث الأنشطة التجارية</h2>
                        <p className="text-sm text-gray-400 mt-1">اكتشف أفضل الأنشطة الموثّقة في مختلف المدن</p>
                    </div>
                        <Link href="/projects" className="text-sm font-semibold text-primary hover:underline">
                            عرض الكل
                        </Link>
                    </motion.div>

                    {citiesWithProjects.length > 0 ? (
                        citiesWithProjects.map(({ city, projects }, cityIndex) => (
                            <motion.div
                                key={city.id}
                                custom={cityIndex}
                                variants={scrollItem}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.08 }}
                            >
                                <div className="flex items-center justify-between mb-4">                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    {city.name}
                                </h3>
                                    <Link href={`/projects?city_id=${city.id}`} rel="nofollow" className="text-sm text-primary hover:underline font-medium">
                                        المزيد من {city.name}
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {projects.map((project, index) => (
                                        <motion.div
                                            key={project.id}
                                            custom={index}
                                            variants={scrollItem}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true, amount: 0.1 }}
                                        >
                                            <PublicProjectCard project={project} pathStatus="projects" />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <ProjectCardSkeletonGrid count={8} />
                    )}
                </motion.section>
            </div>
        </div>
    )
}