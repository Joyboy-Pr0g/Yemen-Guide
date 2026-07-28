'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

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

export function AboutSlider() {
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
    <div className="mt-0 max-w-3xl mx-auto text-start w-full">
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
