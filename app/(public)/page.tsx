import { Suspense } from 'react'
import { HomePageSkeleton } from '@/components/skeleton/HomePageSkeleton'
import { getCategories, getPublicAdsByPosition, getCitiesWithProjects, getFeaturedProjects, getCities, getSiteSettings } from '@/lib/server-api'
import { HomeContent } from '@/components/Home/HomeContent'
import { DEFAULT_SITE_LOGO } from '@/lib/utils'


export const metadata = async () => {
  const settings = await getSiteSettings()
  return {
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




