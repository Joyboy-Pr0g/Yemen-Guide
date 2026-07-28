import Link from 'next/link'
import { MapPin, Zap } from 'lucide-react'
import { AdsBanner } from '@/components/ads/ads-banner'
import { PublicProjectCard } from '@/components/projects/public-project-card'
import { ScrollAnimation, ScrollFadeIn } from '@/components/Home/ScrollAnimation'
import ProjectCardSkeletonGrid from '@/components/skeleton/project/ProjectCardSkeleton'
import type { Ad, City, Project } from '@/types'

interface ProjectsSectionProps {
  usAds: Ad[]
  hAds: Ad[]
  featuredProjects: Project[]
  citiesWithProjects: { city: City; projects: Project[] }[]
}

export function ProjectsSection({
  usAds,
  hAds,
  featuredProjects,
  citiesWithProjects,
}: ProjectsSectionProps) {
  return (
    <>
      {usAds.length > 0 ? (
        <ScrollFadeIn className="mt-8">
          <AdsBanner ads={usAds} columns={3} />
        </ScrollFadeIn>
      ) : null}

      {hAds.length > 0 ? (
        <ScrollFadeIn className="mt-4">
          <AdsBanner ads={hAds} columns={3} />
        </ScrollFadeIn>
      ) : null}

      {featuredProjects.length > 0 ? (
        <section className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/15 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">الأنشطة المميزة</h2>
                <p className="text-sm text-gray-400 mt-0.5">أنشطة تجارية مختارة ومميزة</p>
              </div>
            </div>
            <Link
              href="/projects?is_featured=1"
              rel="nofollow"
              className="text-sm font-semibold text-primary hover:underline"
            >
              عرض الكل
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProjects.map((project, index) => (
              <ScrollAnimation key={project.id} index={index}>
                <PublicProjectCard project={project} pathStatus="projects" />
              </ScrollAnimation>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-14 mb-16 space-y-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">أحدث الأنشطة التجارية</h2>
            <p className="text-sm text-gray-400 mt-1">اكتشف أفضل الأنشطة الموثّقة في مختلف المدن</p>
          </div>
          <Link href="/projects" className="text-sm font-semibold text-primary hover:underline">
            عرض الكل
          </Link>
        </div>

        {citiesWithProjects.length > 0 ? (
          citiesWithProjects.map(({ city, projects }, cityIndex) => (
            <ScrollAnimation key={city.id} index={cityIndex}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                    </div>
                    {city.name}
                  </h3>
                  <Link
                    href={`/projects?city_id=${city.id}`}
                    rel="nofollow"
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    المزيد من {city.name}
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {projects.map((project, index) => (
                    <ScrollAnimation key={project.id} index={index}>
                      <PublicProjectCard project={project} pathStatus="projects" />
                    </ScrollAnimation>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
          ))
        ) : (
          <ProjectCardSkeletonGrid count={8} />
        )}
      </section>
    </>
  )
}
