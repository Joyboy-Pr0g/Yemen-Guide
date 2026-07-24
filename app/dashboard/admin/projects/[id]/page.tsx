import { notFound } from 'next/navigation'
import ProjectDetails from '@/components/projects/project-details'
import { Suspense } from 'react'
import { ProjectDetailsSkeleton } from '@/components/skeleton/project/ProjectDetailsSkeleton'
import { getAdminProject } from '@/lib/admin/server'

export default function AdminProjectDetailPage({ params }: { params: { id: string } }) {

    return <Suspense fallback={<ProjectDetailsSkeleton />}>
        <AdminProjectDetailPageData params={params} />
    </Suspense>
}

async function AdminProjectDetailPageData({ params }: { params: { id: string } }) {
    const { id } = await params
    let project
    try {
        project = await getAdminProject(Number(id))
    } catch {
        notFound()
    }
    return <ProjectDetails project={project} trackView={false} />
}
