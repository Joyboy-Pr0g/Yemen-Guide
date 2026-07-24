import { Suspense } from 'react'
import { getProjects, getCities, getCategories, getPublicAdsByPosition } from '@/lib/server-api'
import PublicProjectsPageContent from '@/components/projects/public-projects-content'
import ProjectCardSkeletonGrid from '@/components/skeleton/project/ProjectCardSkeleton'

const title = 'تصفح الأعمال التجارية والمحلات | دُّلني-اليمن'
const description = 'تصفح آلاف الأنشطة التجارية والمحلات والخدمات في اليمن حسب المدينة أو التصنيف، مع تقييمات حقيقية من المستخدمين وتواصل مباشر مع أصحاب المتاجر.'

export const metadata = {
  title,
  description,
  alternates: { canonical: '/projects' },
  openGraph: { title, description, url: '/projects' },
  twitter: { card: 'summary_large_image' as const, title, description },
}

interface ProjectsPageProps {
  searchParams: Record<string, string | undefined>
}

export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  return (
    <Suspense fallback={<ProjectCardSkeletonGrid count={8} />}>
      <ProjectsData searchParams={searchParams} />
    </Suspense>
  )
}


async function ProjectsData({ searchParams }: ProjectsPageProps) {
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
    />
  )
}
