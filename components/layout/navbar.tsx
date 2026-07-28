'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { use, useState } from 'react'
import { Plus, LogOut, LayoutDashboard, Heart, ChevronDown, Menu, X, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLogout } from '@/hooks/use-auth'
import { useAuthContext } from '@/context/auth-context'
import type { User } from '@/types'
import { cn } from '@/lib/utils'
import { canUseAuthenticatedNav } from '@/lib/auth/email-verification'
import { SiteLogo, SiteName } from '@/components/ui/site-logo'
import { SettingsContext, useSettings } from '@/context/settings-context'

export default function Navbar({ user: serverUser }: { user: User | null }) {
  const settings = useSettings()
  const { user: clientUser } = useAuthContext()
  const user = clientUser ?? serverUser
  const isAuthenticated = canUseAuthenticatedNav(user)
  const { mutate: logout } = useLogout()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) router.push(`/projects?search=${encodeURIComponent(searchQuery.trim())}`)
  }

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/projects', label: 'دليل الأعمال' },
    { href: '/projects/map', label: 'بحث بالخريطة' },
    { href: '/categories', label: 'التصنيفات' },
  ]

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/dashboard/admin'
    if (user?.role === 'trader') return '/dashboard/trader'
    return '/me/favorites'
  }

  const addProjectHref =
    user?.role === 'trader'
      ? '/dashboard/trader/projects'
      : `/auth/login?redirect=${encodeURIComponent('/dashboard/trader/projects')}`

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <SiteLogo logo={settings?.logo ?? undefined} size={65} className="shadow-sm group-hover:shadow-md transition-shadow" />
            <div className="leading-none">
              <SiteName className="block text-base" name={settings?.site_name ?? 'دُّلني-اليمن'} />
            </div>
          </Link>


          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-md font-bold transition-colors',
                  pathname === link.href ? 'text-primary' : 'text-gray-600 hover:text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search bar - desktop only */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن نشاط..."
              className="w-56 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary pe-9 bg-gray-50 focus:bg-white transition-colors"
            />
            <button type="submit" className="absolute end-2.5 text-gray-400 hover:text-primary">
              <Search className="w-4 h-4" />
            </button>
          </form>


          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href={addProjectHref}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة نشاط</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">{user?.name?.charAt(0)}</span>
                  </div>
                  <ChevronDown className={cn('w-3 h-3 text-gray-500 transition-transform', dropdownOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-primary" />
                        <span>لوحة التحكم</span>
                      </Link>
                      <Link
                        href="/me/favorites"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-red-400" />
                        <span>المفضلة</span>
                      </Link>
                      <button
                        onClick={() => { logout(); setDropdownOpen(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors px-3 py-2">
                    تسجيل الدخول
                  </Link>
                  <Link href="/auth/register" className="text-sm font-semibold bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors">
                    إنشاء حساب
                  </Link>
                </div>
                <div className="flex sm:hidden items-center gap-1.5">
                  <Link
                    href="/auth/login"
                    className="text-[11px] font-medium text-gray-600 hover:text-primary transition-colors px-2 py-1.5 rounded-lg border border-gray-200 whitespace-nowrap"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-[11px] font-semibold bg-primary text-white px-2 py-1.5 rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
                  >
                    إنشاء حساب
                  </Link>
                </div>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 py-3"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-2 py-3 text-sm font-medium rounded-lg',
                    pathname === link.href ? 'text-primary bg-primary/5' : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
