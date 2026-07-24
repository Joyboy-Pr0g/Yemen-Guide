import type { Metadata } from 'next'
import Script from 'next/script'
import '@fontsource/tajawal/400.css'
import '@fontsource/tajawal/500.css'
import '@fontsource/tajawal/700.css'
import '@fontsource/tajawal/800.css'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import Providers from '@/components/providers'
import { SettingsProvider } from '@/context/settings-context'
import { getSiteSettings, SITE_URL } from '@/lib/server-api'
import { getSession } from '@/lib/auth/session'
import { DEFAULT_SITE_LOGO } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/next'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata = async () => {
  const settings = await getSiteSettings()
  return {
    metadataBase: new URL(SITE_URL),
    title: settings.site_name,
    description: settings.site_description,
    keywords: settings.meta_keywords,
    icons: {
      icon: settings.logo || DEFAULT_SITE_LOGO,
      apple: settings.logo || DEFAULT_SITE_LOGO,
      shortcut: settings.logo || DEFAULT_SITE_LOGO,
      other: {
        rel: 'icon',
        url: settings.logo || DEFAULT_SITE_LOGO,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'ar_YE',
      url: SITE_URL,
      siteName: settings.site_name,
      title: settings.site_name,
      description: settings.site_description,
      images: [{ url: '/dulni-sharer.png', width: 1080, height: 1350 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.site_name,
      description: settings.site_description,
      images: ['/dulni-sharer.png'],
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, initialUser] = await Promise.all([
    getSiteSettings(),
    getSession(),
  ])

  return (
    <html lang="ar" dir="rtl">
      <body className="font-tajawal bg-background min-h-screen">
        {GA_ID && process.env.NODE_ENV === 'production' && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        <SettingsProvider promiseSettings={Promise.resolve(settings)}>
          <Providers initialUser={initialUser}>
            {children}
          </Providers>
        </SettingsProvider>
        <Analytics />
      </body>
    </html>
  )
}
