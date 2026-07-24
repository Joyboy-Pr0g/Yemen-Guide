import ProjectsContent from '@/components/projects/projects-content'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { getTraderProjects } from '@/lib/trader/server'
import { getCities, getCategories } from '@/lib/server-api'

export default function TraderProjectsPage() {
  return <Suspense fallback={Array.from({ length: 6 }).map((_, i) => (
    <tr key={i} className="border-b border-gray-50">
      <td className="px-4 py-3"><div className="flex gap-3"><Skeleton className="w-10 h-10 rounded-lg" /><Skeleton className="h-4 w-32 my-auto" /></div></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
      <td className="px-4 py-3"><Skeleton className="h-8 w-32 rounded-lg" /></td>
    </tr>
  ))}>
    <TraderProjectsPageData />
  </Suspense>
}

async function TraderProjectsPageData() {
  const [initialData, cities, categories] = await Promise.all([
    getTraderProjects(1),
    getCities(),
    getCategories(),
  ])
  return <ProjectsContent initialData={initialData} cities={cities} categories={categories} isAdmin={false} />
}