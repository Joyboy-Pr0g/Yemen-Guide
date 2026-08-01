import { Suspense } from 'react'
import { HomePageSkeleton } from '@/components/skeleton/HomePageSkeleton'
import { getCategories, getPublicAdsByPosition, getCitiesWithProjects, getFeaturedProjects, getCities, getSiteSettings } from '@/lib/server-api'
import { HomeContent } from '@/components/Home/HomeContent'
import { SOCIAL_COVER_IMAGE, SOCIAL_PROFILE_IMAGE, SOCIAL_SHARE_IMAGE } from '@/lib/utils'


export const metadata = async () => {
  const settings = await getSiteSettings()
  return {
    title: settings.site_name,
    description: settings.site_description,
    keywords: settings.meta_keywords,
    icons: {
      icon: settings.logo || SOCIAL_PROFILE_IMAGE,
      apple: settings.logo || SOCIAL_PROFILE_IMAGE,
      shortcut: settings.logo || SOCIAL_PROFILE_IMAGE,
    },
    openGraph: {
      title: settings.site_name,
      description: settings.site_description,
      url: '/',
      images: [
        { url: SOCIAL_SHARE_IMAGE, width: 1080, height: 1350, alt: settings.site_name },
        { url: SOCIAL_COVER_IMAGE, width: 1640, height: 624, alt: `${settings.site_name} — Facebook cover` },
      ],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: settings.site_name,
      description: settings.site_description,
      images: [SOCIAL_SHARE_IMAGE],
    },
  }
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeData />
    </Suspense>
  )
}

async function HomeData() {
  const [categories, initialCities, citiesData, homeAds, underSearchAds, featuredData] = await Promise.allSettled([
    getCategories(),
    getCities(),
    getCitiesWithProjects(5),
    getPublicAdsByPosition('home_page'),
    getPublicAdsByPosition('under_search'),
    getFeaturedProjects(6),
  ])

  const cats = categories.status === 'fulfilled' ? categories.value : []
  const cities = initialCities.status === 'fulfilled' ? initialCities.value : []
  const citiesWithProjects = citiesData.status === 'fulfilled' ? citiesData.value : []
  const hAds = homeAds.status === 'fulfilled' ? homeAds.value : []
  const usAds = underSearchAds.status === 'fulfilled' ? underSearchAds.value : []
  const featuredProjects = featuredData.status === 'fulfilled' ? featuredData.value : []

  return (
    <HomeContent cats={cats}
      cities={cities}
      citiesWithProjects={citiesWithProjects}
      hAds={hAds}
      usAds={usAds}
      featuredProjects={featuredProjects}
    />
  )
}




