'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    Users,
    Store,
    ShieldCheck,
    Tag,
    Megaphone,
    Settings,
    LogOut,
    Menu,
    Clock,
    Flag,
    ImageIcon,
    User,
    type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLogout } from '@/hooks/use-auth'
import { useAdminPendingProjectsCount } from '@/hooks/use-admin'
import { SiteLogo, SiteName } from '@/components/ui/site-logo'
import { useSettings } from '@/context/settings-context'
import type { User as AuthUser } from '@/types'
import { useState } from 'react'

type NavItem = {
    href: string
    label: string
    icon: LucideIcon
    exact?: boolean
    badge?: number
}

const ADMIN_NAV_ITEMS: NavItem[] = [
    { href: '/dashboard/admin', label: 'الرئيسية', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/admin/users', label: 'المستخدمون', icon: Users },
    { href: '/dashboard/admin/projects', label: 'المشاريع', icon: Store },
    { href: '/dashboard/admin/projects/audit-projects', label: 'مراجعة الصور', icon: ImageIcon },
    { href: '/dashboard/admin/projects/pending', label: 'المشاريع المعلقة', icon: Clock },
    { href: '/dashboard/admin/reports', label: 'التبليغات', icon: Flag },
    { href: '/dashboard/admin/verifications', label: 'التوثيق', icon: ShieldCheck },
    { href: '/dashboard/admin/categories', label: 'التصنيفات', icon: Tag },
    { href: '/dashboard/admin/ads', label: 'الإعلانات', icon: Megaphone },
    { href: '/dashboard/admin/settings', label: 'الإعدادات', icon: Settings },
]

const TRADER_NAV_ITEMS: NavItem[] = [
    { href: '/dashboard/trader', label: 'الرئيسية', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/trader/projects', label: 'مشاريعي', icon: Store },
    { href: '/dashboard/trader/verifications', label: 'طلبات التوثيق', icon: ShieldCheck },
    { href: '/dashboard/trader/profile', label: 'الملف الشخصي', icon: User },
]

const NavBar = ({ navItems }: { navItems: NavItem[] }) => {
    const pathname = usePathname()

    const isNavMatch = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

    const activeHref = navItems
        .filter(({ href, exact }) => isNavMatch(href, exact))
        .sort((a, b) => b.href.length - a.href.length)[0]?.href

    return (
        <nav className="flex-1 p-3 space-y-0.5">
            {navItems.map(({ href, label, icon: Icon, badge }) => {
                const active = activeHref === href
                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                            active ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                    >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1">{label}</span>
                        {badge != null && badge > 0 && (
                            <span
                                className={cn(
                                    'min-w-5 h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center',
                                    active ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700',
                                )}
                            >
                                {badge}
                            </span>
                        )}
                    </Link>
                )
            })}
        </nav>
    )
}

export const DashboardNavBar = ({ variant, user }: { variant: 'admin' | 'trader'; user: AuthUser | null }) => {
    const { data: pendingCount } = useAdminPendingProjectsCount(variant === 'admin')
    const navItems = (variant === 'admin' ? ADMIN_NAV_ITEMS : TRADER_NAV_ITEMS).map((item) =>
        item.href === '/dashboard/admin/projects/pending'
            ? { ...item, badge: pendingCount }
            : item,
    )
    const roleLabel = variant === 'admin' ? 'مشرف' : 'تاجر'
    const { mutate: logout } = useLogout()
    const [open, setOpen] = useState(false)
    const settings = useSettings()
    const handleOpen = () => {
        setOpen(!open)
    }
    const handleClose = () => {
        setOpen(false)
    }
    return (
        <div>
            <aside className="hidden w-60 shrink-0 bg-white border-e border-gray-100 shadow-sm md:flex flex-col h-full overflow-y-auto">
                <div className="p-5 border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-2">
                        <SiteLogo size={32} logo={settings?.logo ?? undefined} />
                        <SiteName className="text-sm" />
                    </Link>
                </div>

                <div className="p-4 border-b border-gray-50">
                    <div className="w-10 h-10 bg-accent/15 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-accent font-bold">{user?.name?.charAt(0)}</span>
                    </div>
                    <p className="text-sm font-semibold text-center text-gray-800 truncate">{user?.name}</p>
                    <p className="text-xs text-center text-accent font-medium">{roleLabel}</p>
                </div>

                <NavBar navItems={navItems} />

                <div className="p-3 border-t border-gray-100">
                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        تسجيل الخروج
                    </button>
                </div>
            </aside>
            <div className="md:hidden p-3 text-gray-600 hover:bg-gray-50 rounded-xl flex items-center gap-2 w-full absolute top-0 left-0"
            >
                <Menu onClick={handleOpen} className="size-6" />
                <span>القائمة الجانبية</span>
            </div>
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/50 z-[200] backdrop-blur-sm md:hidden"
                            onClick={handleClose}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                        <motion.aside
                            className="fixed inset-y-0 right-0 z-[201] w-60 bg-white shadow-xl flex flex-col h-full md:hidden"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-5 border-b border-gray-100">
                                <Link href="/" className="flex items-center gap-2" onClick={handleClose}>
                                    <SiteLogo size={32} logo={settings?.logo ?? undefined} />
                                    <SiteName className="text-sm" />
                                </Link>
                            </div>
                            <div className="p-4 border-b border-gray-50">
                                <div className="w-10 h-10 bg-accent/15 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <span className="text-accent font-bold">{user?.name?.charAt(0)}</span>
                                </div>
                                <p className="text-sm font-semibold text-center text-gray-800 truncate">{user?.name}</p>
                                <p className="text-xs text-center text-accent font-medium">{roleLabel}</p>
                            </div>
                            <div className="flex-1 overflow-y-auto" onClick={handleClose}>
                                <NavBar navItems={navItems} />
                            </div>
                            <div className="p-3 border-t border-gray-100">
                                <button
                                    onClick={() => { handleClose(); logout() }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    تسجيل الخروج
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}