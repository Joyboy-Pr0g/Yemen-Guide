import { Store, Eye, Star } from 'lucide-react'
import { getTraderDashboard } from '@/lib/trader/server'
import { Project, TraderStats } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import ProjectCardSkeletonGrid from '@/components/skeleton/project/ProjectCardSkeleton'
import { Suspense } from 'react';
import { PublicProjectCard } from '@/components/projects/public-project-card'

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

function DashboardStates({ stats }: { stats: TraderStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="إجمالي المشاريع" value={stats.total_projects.toLocaleString()} icon={Store} color="bg-blue-500" />
      <StatCard label="المشاريع المنشورة" value={stats.public_projects.toLocaleString()} icon={Store} color="bg-primary" />
      <StatCard label="المشاريع المسدودة" value={stats.draft_projects.toLocaleString()} icon={Store} color="bg-green-500" />
      <StatCard label="إجمالي المشاهدات" value={Number(stats.total_views).toLocaleString()} icon={Eye} color="bg-primary" />
      <StatCard label="إجمالي التقييمات" value={Number(stats.total_ratings).toLocaleString()} icon={Star} color="bg-primary" />
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
        <PublicProjectCard key={project.id} project={project} pathStatus="trader" />
      ))}
    </div>
  )
}

export default async function TraderDashboardPage() {
  const { stats, most_viewed_projects: projects } = await getTraderDashboard()

  return (
    <div>
      <h1 className="mt-4 sm:mt-0 text-xl sm:text-2xl font-bold text-gray-900 mb-8">لوحة تحكم التاجر</h1>

      <Suspense fallback={<DashboardStatesSkeleton />}>
        <DashboardStates stats={stats} />
      </Suspense>

      <h2 className="text-xl font-bold text-gray-900 mt-4 mb-4">المشاريع الأكثر مشاهدة</h2>
      <Suspense fallback={<ProjectCardSkeletonGrid count={6} />}>
        <DashboardProjects projects={projects} />
      </Suspense>
    </div>
  )
}
