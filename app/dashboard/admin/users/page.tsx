import { UsersPageContent } from '@/components/admin/users/users'
import { getUsers } from '@/lib/admin/server'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'

export default async function AdminUsersPage() {
  const initialData = await getUsers()
  return <Suspense fallback={Array.from({ length: 6 }).map((_, i) => (
    <tr key={i} className="border-b border-gray-50">
      <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
      <td className="px-4 py-3"><Skeleton className="h-8 w-24 rounded-lg" /></td>
    </tr>))}>
    <UsersPageContent initialData={initialData} />
  </Suspense>
}