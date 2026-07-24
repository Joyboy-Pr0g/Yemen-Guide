import { notFound } from 'next/navigation'
import { getProjectBySlug, SITE_URL } from '@/lib/server-api'
import { getImageUrl } from '@/lib/utils'
import { Suspense } from 'react'
import ProjectDetails from '@/components/projects/project-details'
import { ProjectDetailsSkeleton } from '@/components/skeleton/project/ProjectDetailsSkeleton'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params
  try {
    const project = await getProjectBySlug(slug)
    const description = project.description
      ? project.description.slice(0, 160)
      : `تعرّف على ${project.name} في دُّلني-اليمن`
    const image = getImageUrl(project.image)
    return {
      title: `${project.name} | دُّلني-اليمن`,
      description,
      alternates: { canonical: `/projects/${project.slug}` },
      openGraph: {
        type: 'website',
        locale: 'ar_YE',
        url: `${SITE_URL}/projects/${project.slug}`,
        title: project.name,
        description,
        images: [{ url: image }],
      },
      twitter: {
        card: 'summary_large_image',
        title: project.name,
        description,
        images: [image],
      },
    }
  } catch {
    return {}
  }
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {

  return <Suspense fallback={<ProjectDetailsSkeleton />}>
    <ProjectDetailPageData params={params} />
  </Suspense>
}

async function ProjectDetailPageData({ params }: { params: { slug: string } }) {
  const { slug } = await params
  let project
  try {
    project = await getProjectBySlug(slug)
  } catch {
    notFound()
  }
  return <ProjectDetails project={project} />
}