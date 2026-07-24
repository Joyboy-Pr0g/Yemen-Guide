import { Suspense } from 'react'
import { getProjects, getCities, getCategories, getPublicAdsByPosition } from '@/lib/server-api'
import PublicProjectsPageContent from '@/components/projects/public-projects-content'
import ProjectCardSkeletonGrid from '@/components/skeleton/project/ProjectCardSkeleton'

const title = 'بحث بالخريطة | دُّلني-اليمن'
const description = 'ابحث عن الأنشطة التجارية والمحلات على الخريطة في اليمن. تصفّح حسب المنطقة والتصنيف مع عرض قائمة وخريطة تفاعلية.'

export const metadata = {
  title,
  description,
  alternates: { canonical: '/projects/map' },
  openGraph: { title, description, url: '/projects/map' },
  twitter: { card: 'summary_large_image' as const, title, description },
}

interface ProjectsMapPageProps {
  searchParams: Record<string, string | undefined>
}

export default function ProjectsMapPage({ searchParams }: ProjectsMapPageProps) {
  return (
    <Suspense fallback={<ProjectCardSkeletonGrid count={4} />}>
      <ProjectsMapData searchParams={searchParams} />
    </Suspense>
  )
}

async function ProjectsMapData({ searchParams }: ProjectsMapPageProps) {
  const { status: _status, ...filters } = searchParams
  const [projectsResult, citiesResult, categoriesResult, sidebarAdsResult] = await Promise.allSettled([
    getProjects(filters as Record<string, string>),
    getCities(),
    getCategories(),
    getPublicAdsByPosition('sidebar'),
  ])

  const projectsWithMeta = projectsResult.status === 'fulfilled'
    ? projectsResult.value
    : { projects: [], meta: { current_page: 1, last_page: 1, hasMorePages: false, total: 0 } }
  const cities = citiesResult.status === 'fulfilled' ? citiesResult.value : []
  const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : []
  const sidebarAds = sidebarAdsResult.status === 'fulfilled' ? sidebarAdsResult.value : []

  return (
    <PublicProjectsPageContent
      projectsWithMeta={projectsWithMeta}
      initialParams={searchParams}
      cities={cities}
      categories={categories}
      sidebarAds={sidebarAds}
      defaultViewMode="map"
      pageTitle="بحث بالخريطة"
    />
  )
}
