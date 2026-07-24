'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SiteSettings } from '@/types'
import { Facebook, Instagram, MessageCircle, Mail } from 'lucide-react'
import { SiteLogo, SiteName } from '@/components/ui/site-logo'
import { useSettings } from '@/context/settings-context'
import { useIsAndroid } from '@/hooks/use-is-android'
import { ConfirmModal } from '@/components/ui/confirm-modal'

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.dulnisy.mobileapp&pcampaignid=web_share'

export default function Footer() {
  const settings = useSettings()
  const isAndroid = useIsAndroid()
  const [showAppModal, setShowAppModal] = useState(false)

  const handleBadgeClick = (e: React.MouseEvent) => {
    if (isAndroid) {
      e.preventDefault()
      setShowAppModal(true)
    }
  }

  return (
    <footer className="bg-primary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <SiteLogo logo={settings?.logo ?? undefined} size={32} className="bg-accent" />
              <SiteName className="text-base text-white" name={settings?.site_name ?? 'دُّلني-اليمن'} />
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              دليل الأعمال والخدمات الأول في اليمن. اكتشف أفضل الأماكن والخدمات بسهولة.
            </p>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleBadgeClick}
              className="inline-block mt-4"
            >
              <Image
                src="/google-play-badge.png"
                alt="Get it on Google Play"
                width={200}
                height={60}
                className="h-12 w-auto"
              />
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">روابط سريعة</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              {[['/', 'الرئيسية'], ['/projects', 'دليل الأعمال'], ['/projects/map', 'بحث بالخريطة'], ['/categories', 'التصنيفات']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white hover:translate-x-1 inline-block transition-all">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">الحساب</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              {[['/auth/login', 'تسجيل الدخول'], ['/auth/register', 'إنشاء حساب'], ['/me/favorites', 'المفضلة'], ['/dashboard/trader', 'لوحة التاجر']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white hover:translate-x-1 inline-block transition-all">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">تواصل معنا</h4>
            <div className="space-y-2.5 text-sm text-white/70">
              <a href={`mailto:${settings?.contact_email ?? 'info@yemenguide.sy'}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                <span>{settings?.contact_email ?? 'info@yemenguide.sy'}</span>
              </a>
            </div>
            <div className="flex gap-3 mt-4">
              <a href={settings?.facebook_url ?? '#'} className="w-9 h-9 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={settings?.instagram_url ?? '#'} className="w-9 h-9 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={settings?.whatsapp_support ?? '#'} className="w-9 h-9 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 border-t border-white/10 flex  items-center justify-between ">
          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/50 text-xs"
          >
            {[['/about', 'من نحن'], ['/privacy-policy', 'سياسة الخصوصية'], ['/terms', 'شروط الاستخدام'], ['/cookie-policy', 'سياسة الكوكيز']].map(([href, label]) => (
              <Link key={href} href={href} className="hover:text-white transition-colors">{label}</Link>
            ))}
          </div>
          <div className=" text-white/50 text-sm">
            <p>
              © 2024{" "}
              <a
                href="https://www.injazdev.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors font-medium"
              >
                إنجاز التطويرية
              </a>
              . جميع الحقوق محفوظة.
            </p>
          </div>
        </div>


      </div>

      <ConfirmModal
        open={showAppModal}
        variant="app"
        title="استخدام التطبيق"
        message="أنت تتصفح من جهاز جوال. هل تريد المتابعة على الموقع أم استخدام تطبيق دُلني اليمن؟"
        confirmLabel="استخدام التطبيق"
        cancelLabel="متابعة على الموقع"
        onConfirm={() => {
          window.location.href = PLAY_STORE_URL
          setShowAppModal(false)
        }}
        onCancel={() => setShowAppModal(false)}
      />
    </footer>
  )
}
