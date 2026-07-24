import AuditProjectsContent from '@/components/admin/projects/AuditProjectsContent'
import { getAdminAuditProjects } from '@/lib/admin/server'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminAuditProjectsPage() {
    return (
        <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 shadow-card border border-gray-50">
                        <Skeleton className="h-6 w-40 mb-4" />
                        <Skeleton className="aspect-video w-full rounded-xl mb-3" />
                        <div className="grid grid-cols-2 gap-2">
                            <Skeleton className="aspect-video rounded-lg" />
                            <Skeleton className="aspect-video rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        }>
            <AdminAuditProjectsPageData />
        </Suspense>
    )
}

async function AdminAuditProjectsPageData() {
    const initialData = await getAdminAuditProjects()
    return <AuditProjectsContent initialData={initialData} />
}
