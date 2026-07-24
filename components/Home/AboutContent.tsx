'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Store, MapPin, CheckCircle2, Users, Search, BadgeCheck, MessageCircle, ArrowRight } from 'lucide-react'

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

const STATS = [
    { icon: Store, value: '+1,000', label: 'نشاط تجاري' },
    { icon: MapPin, value: '14', label: 'محافظة يمنية' },
    { icon: CheckCircle2, value: '+200', label: 'نشاط موثّق' },
    { icon: Users, value: '+5,000', label: 'مستخدم نشط' },
]

const STEPS = [
    {
        icon: Search,
        title: 'ابحث',
        description: 'اختر مدينتك أو التصنيف الذي يهمك، أو استخدم البحث للعثور على ما تحتاجه مباشرة.',
    },
    {
        icon: BadgeCheck,
        title: 'قارن وتحقق',
        description: 'تصفّح تفاصيل الأنشطة التجارية، تقييمات المستخدمين، وشارة التوثيق للأنشطة الموثوقة.',
    },
    {
        icon: MessageCircle,
        title: 'تواصل مباشرة',
        description: 'تواصل مع صاحب النشاط مباشرة عبر الهاتف أو واتساب دون وسيط.',
    },
]

export const AboutContent = () => {
    return (
        <div className="bg-background">
            {/* ─── HERO ─────────────────────────────────────────────── */}
            <section
                className="relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #002623 0%, #054239 40%, #0a6b5a 70%, #428177 100%)',
                    minHeight: 360,
                }}
            >
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
                        backgroundSize: '48px 48px',
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                        className="w-[600px] h-[600px] rounded-full opacity-[0.12]"
                        style={{ background: 'radial-gradient(circle, #b9a779 0%, transparent 70%)' }}
                    />
                </div>
                <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ lineHeight: 0 }}>
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 60 }}>
                        <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="#faf9f7" />
                    </svg>
                </div>

                <motion.div
                    className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center"
                    initial="hidden"
                    animate="visible"
                    variants={heroStagger}
                >
                    <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-semibold px-5 py-2 rounded-full mb-8 border border-white/20 backdrop-blur-sm shadow-sm">
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse shrink-0" />
                        من نحن
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse shrink-0" />
                    </motion.div>

                    <motion.h1 variants={fadeUp} className="text-3xl sm:text-5xl font-black text-white leading-[1.15] tracking-tight mb-5 drop-shadow-lg">
                        نسهّل عليك اكتشاف
                        <br />
                        <span className="text-accent">اليمن</span>
                    </motion.h1>

                    <motion.p variants={fadeUp} className="text-white/70 text-base sm:text-lg leading-relaxed">
                        دُّلني-اليمن منصة تجمع الأنشطة التجارية والخدمات في مكان واحد، لتسهيل التواصل بين الناس
                        وأصحاب الأعمال في جميع المحافظات اليمنية.
                    </motion.p>
                </motion.div>
            </section>

            {/* ─── CONTENT ──────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Mission */}
                <motion.section
                    className="mt-14 max-w-3xl mx-auto text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    variants={sectionHeader}
                >
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">رسالتنا</h2>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                        نؤمن بأن العثور على الخدمة أو النشاط التجاري المناسب يجب أن يكون بسيطاً وسريعاً. لذلك بنينا دليل
                        اليمن ليكون المرجع الأول الذي يجمع المطاعم والصيدليات والعقارات والسيارات والتعليم وغيرها الكثير
                        في منصّة واحدة سهلة الاستخدام، ويمنح أصحاب الأعمال فرصة الوصول إلى عملاء جدد في مدينتهم ومحافظتهم.
                    </p>
                </motion.section>

                {/* Stats */}
                <motion.section
                    className="mt-14"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    variants={sectionStagger}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {STATS.map(({ icon: Icon, value, label }, i) => (
                            <motion.div
                                key={label}
                                custom={i}
                                variants={scrollItem}
                                className="bg-white rounded-2xl shadow-card p-5 text-center"
                            >
                                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-accent/15 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-accent" />
                                </div>
                                <p className="text-xl font-black text-gray-900">{value}</p>
                                <p className="text-xs text-gray-400 mt-1">{label}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* How it works */}
                <motion.section
                    className="mt-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    variants={sectionStagger}
                >
                    <motion.div variants={sectionHeader} className="text-center mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">كيف يعمل الدليل</h2>
                        <p className="text-sm text-gray-400 mt-1">ثلاث خطوات بسيطة للوصول إلى ما تحتاجه</p>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {STEPS.map(({ icon: Icon, title, description }, i) => (
                            <motion.div
                                key={title}
                                custom={i}
                                variants={scrollItem}
                                className="bg-white rounded-2xl shadow-card p-6 text-center"
                            >
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* CTA for businesses */}
                <motion.section
                    className="mt-16 mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    variants={sectionHeader}
                >
                    <div className="bg-primary rounded-2xl p-8 sm:p-10 text-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">هل تملك نشاطاً تجارياً؟</h2>
                        <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
                            أضف نشاطك التجاري إلى دُّلني-اليمن مجاناً، وابدأ بالوصول إلى عملاء جدد في مدينتك.
                        </p>
                        <Link
                            href="/auth/register"
                            className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors"
                        >
                            سجّل نشاطك الآن
                            <ArrowRight className="w-4 h-4 rotate-180" />
                        </Link>
                    </div>
                </motion.section>
            </div>
        </div>
    )
}
