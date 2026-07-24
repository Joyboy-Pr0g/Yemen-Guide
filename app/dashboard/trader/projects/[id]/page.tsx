import { notFound } from 'next/navigation'
import ProjectDetails from '@/components/projects/project-details'
import { Suspense } from 'react'
import { ProjectDetailsSkeleton } from '@/components/skeleton/project/ProjectDetailsSkeleton'
import { getTraderProject } from '@/lib/trader/server'

export default function TraderProjectDetailPage({ params }: { params: { id: string } }) {

    return <Suspense fallback={<ProjectDetailsSkeleton />}>
        <TraderProjectDetailPageData params={params} />
    </Suspense>
}

async function TraderProjectDetailPageData({ params }: { params: { id: string } }) {
    const { id } = await params
    let project
    try {
        project = await getTraderProject(Number(id))
    } catch {
        notFound()
    }
    return <ProjectDetails project={project} trackView={false} />
}
