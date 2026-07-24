import AdminProjectsPageContent from '@/components/projects/projects-content'
import { Suspense } from 'react'
import { getAdminProjects } from '@/lib/admin/server'
import { Skeleton } from '@/components/ui/skeleton'
import { getCities, getCategories } from '@/lib/server-api'
import { getUsers } from '@/lib/admin/server'

export default function AdminProjectsPage() {
  return <Suspense fallback={Array.from({ length: 6 }).map((_, i) => (
    <tr key={i} className="border-b border-gray-50">
      <td className="px-4 py-3"><div className="flex gap-3"><Skeleton className="w-10 h-10 rounded-lg" /><Skeleton className="h-4 w-32 my-auto" /></div></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
      <td className="px-4 py-3"><Skeleton className="h-8 w-32 rounded-lg" /></td>
    </tr>
  ))}>
    <AdminProjectsPageData />
  </Suspense>
}

async function AdminProjectsPageData() {
  const [initialData, cities, categories, traders] = await Promise.all([
    getAdminProjects(),
    getCities(),
    getCategories(),
    getUsers(1,'trader'),
  ])
  return <AdminProjectsPageContent initialData={initialData} cities={cities} categories={categories} traders={traders} isAdmin={true} />
}