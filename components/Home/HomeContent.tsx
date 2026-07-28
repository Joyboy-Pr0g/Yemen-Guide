import { CategoriesSection } from '@/components/Home/CategoriesSection'
import { HeroSection } from '@/components/Home/HeroSection'
import { ProjectsSection } from '@/components/Home/ProjectsSection'
import type { Ad, Category, City, Project } from '@/types'

interface HomeContentProps {
  cats: Category[]
  cities: City[]
  citiesWithProjects: { city: City; projects: Project[] }[]
  hAds: Ad[]
  usAds: Ad[]
  featuredProjects: Project[]
}

export function HomeContent({
  cats,
  cities,
  citiesWithProjects,
  hAds,
  usAds,
  featuredProjects,
}: HomeContentProps) {
  return (
    <div className="bg-background">
      <HeroSection cats={cats} cities={cities} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <CategoriesSection cats={cats} />
        <ProjectsSection
          usAds={usAds}
          hAds={hAds}
          featuredProjects={featuredProjects}
          citiesWithProjects={citiesWithProjects}
        />
      </div>
    </div>
  )
}
