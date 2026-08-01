'use client'

import * as LucideIcons from 'lucide-react'
import Link from 'next/link'
import {
  Building2,
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  HeartPulse,
  MapPin,
  ShoppingBag,
  Store,
  Users,
  Utensils,
  Wrench,
} from 'lucide-react'
import SearchBar from '@/components/search/search-bar'
import type { Category, City } from '@/types'
import { Suspense, useRef, type ElementType } from 'react'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
}

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const STATS = [
  { icon: Store, value: '+1,000', label: 'نشاط تجاري' },
  { icon: MapPin, value: '22', label: 'محافظة يمنية' },
  { icon: CheckCircle2, value: '+2000', label: 'نشاط موثّق' },
  { icon: Users, value: '+5,000', label: 'مستخدم نشط' },
]

const getCategoryIcon = (name: string) => {
  const Icon = (LucideIcons as unknown as Record<string, ElementType>)[name]
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

function FloatingIcon({
  icon: Icon,
  className,
  delay = 0,
}: {
  icon: ElementType
  className: string
  delay?: number
}) {
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

interface HeroAnimationProps {
  cats: Category[]
  cities: City[]
}

export function HeroAnimation({ cats, cities }: HeroAnimationProps) {
  return (
    <>
      <FloatingIcon icon={Store} className="top-10 start-[5%] rotate-12 hidden lg:flex" delay={0.2} />
      <FloatingIcon icon={Utensils} className="top-24 start-[12%] -rotate-6 hidden lg:flex" delay={0.35} />
      <FloatingIcon icon={HeartPulse} className="top-8 start-[20%] rotate-6 hidden xl:flex" delay={0.5} />
      <FloatingIcon icon={Car} className="bottom-16 start-[8%] rotate-3 hidden lg:flex" delay={0.65} />
      <FloatingIcon icon={GraduationCap} className="top-10 end-[5%] -rotate-12 hidden lg:flex" delay={0.2} />
      <FloatingIcon icon={Wrench} className="top-24 end-[12%] rotate-6 hidden lg:flex" delay={0.35} />
      <FloatingIcon icon={ShoppingBag} className="top-8 end-[20%] -rotate-6 hidden xl:flex" delay={0.5} />
      <FloatingIcon icon={Building2} className="bottom-16 end-[8%] -rotate-3 hidden lg:flex" delay={0.65} />

      <motion.div
        className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-10 sm:pt-20 sm:pb-12 text-center"
        initial="hidden"
        animate="visible"
        variants={heroStagger}
      >
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-semibold px-5 py-2 rounded-full mb-8 border border-white/20 backdrop-blur-sm shadow-sm"
        >
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse shrink-0" />
          دليل الأعمال والخدمات الأول في اليمن
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse shrink-0" />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight mb-4 drop-shadow-lg"
        >
          اكتشف كل ما تحتاجه
          <br />
          <span className="relative inline-block mt-2">
            <span className="text-accent">في اليمن</span>
            <svg
              className="absolute -bottom-2 start-0 w-full"
              viewBox="0 0 200 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 6 Q100 2 198 6" stroke="#b9a779" strokeWidth="3" strokeLinecap="round" fill="none" />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-white/65 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed"
        >
          أكثر من ألف نشاط تجاري موثّق — من المطاعم والصيدليات إلى العقارات والخدمات
        </motion.p>

        <motion.div variants={fadeUp} className="relative z-30 w-full max-w-5xl mx-auto">
          <Suspense>
            <SearchBar initalCities={cities} initalCategories={cats} />
          </Suspense>
        </motion.div>

        <motion.div variants={fadeUp} className="relative z-10 mt-6">
          <QuickSearchTags cats={cats} />
        </motion.div>
      </motion.div>

      <div className="relative z-20 px-4 pb-10  flex flex-col items-center">
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
      </div>
    </>
  )
}
