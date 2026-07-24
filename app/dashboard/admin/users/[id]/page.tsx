import { getUser, getUserProjects } from '@/lib/admin/server'
import UserDetailPageContent from '@/components/admin/users/user'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import type { Project } from '@/types'

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params
  return <Suspense fallback={<div className="space-y-4 max-w-3xl">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-40 rounded-2xl" />
    <Skeleton className="h-40 rounded-2xl" />
  </div>}>
    <AdminUserDetailPageContent id={id} />
  </Suspense>
}

async function AdminUserDetailPageContent({ id }: { id: string }) {

  const user = await getUser(Number(id))
  let projects: Project[] = []
  if (user && user.role === 'trader') {
    projects = await getUserProjects(Number(id))
  }
  return <UserDetailPageContent user={user} projects={projects} />
}