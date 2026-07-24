import { Users, Store, Eye, UserCheck } from 'lucide-react'
import { getDashboard } from '@/lib/admin/server'
import { AdminStats, CityWithProjects, Project } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import ProjectCardSkeleton from '@/components/skeleton/project/ProjectCardSkeleton'
import { Suspense } from 'react';
import { PublicProjectCard } from '@/components/projects/public-project-card'
import { FaIcon } from '@/components/ui/fa-icon'

function StatCard({ label, value, icon: Icon, color }: { label: string; value: React.ReactNode; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-sm text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}

function DashboardCities({ citiesWithProjects }: { citiesWithProjects: CityWithProjects[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5">
      {citiesWithProjects.map((city) => (
        <div key={city.id}>
          <div className="bg-white rounded-2xl p-3 shadow-card">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-primary">
              <FaIcon icon="fa-solid fa-city" className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{city.name}</p>
            <p className="text-sm text-gray-400 mt-0.5">{city.projects_count} مشروع</p>
          </div>
        </div>
      ))}
    </div>
  )
}
function DashboardCitiesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5">
      {[...Array(10)].map((_, i) => (
        <div key={i}>
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <Skeleton className="w-10 h-10 rounded-xl mb-3" />
            <Skeleton className="h-6 w-20 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
    </div>
  )
}

function DashboardStates({ stats }: { stats: AdminStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="إجمالي الزوار" value={stats.total_visitors.toLocaleString()} icon={Users} color="bg-blue-500" />
      <StatCard label="التجار" value={stats.total_traders.toLocaleString()} icon={UserCheck} color="bg-primary" />
      <StatCard label="الأنشطة النشطة" value={stats.active_listings.toLocaleString()} icon={Store} color="bg-green-500" />
      <StatCard label="إجمالي المشاهدات" value={Number(stats.total_views).toLocaleString()} icon={Eye} color="bg-accent" />
    </div>
  )
}

function DashboardStatesSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-card">
          <Skeleton className="w-10 h-10 rounded-xl mb-3" />
          <Skeleton className="h-6 w-20 mb-1" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  )
}

function DashboardProjects({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5">
      {projects.map((project) => (
        <PublicProjectCard key={project.id} project={project} pathStatus="admin" />
      ))}
    </div>
  )
}

export default async function AdminDashboardPage() {
  const { stats, projects, cities_with_projects } = await getDashboard()

  return (
    <div className='space-y-8'>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">لوحة تحكم المشرف</h1>

      <Suspense fallback={<DashboardStatesSkeleton />}>
        <DashboardStates stats={stats} />
      </Suspense>
      <Suspense fallback={<DashboardCitiesSkeleton />}>
        <DashboardCities citiesWithProjects={cities_with_projects} />
      </Suspense>

      <h2 className="text-xl font-bold text-gray-900 mt-4 mb-4">المشاريع الأكثر مشاهدة</h2>
      <Suspense fallback={<ProjectCardSkeleton count={10} />}>
        <DashboardProjects projects={projects} />
      </Suspense>
    </div>
  )
}
