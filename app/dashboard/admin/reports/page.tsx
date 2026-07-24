import ReportsContent from '@/components/admin/reports/ReportsContent'
import { getAdminReports } from '@/lib/admin/server'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminReportsPage() {
    return (
        <Suspense fallback={Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} className="border-b border-gray-50">
                <td className="px-4 py-3"><div className="flex gap-3"><Skeleton className="w-10 h-10 rounded-lg" /><Skeleton className="h-4 w-32 my-auto" /></div></td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                <td className="px-4 py-3"><Skeleton className="h-8 w-24 rounded-lg" /></td>
            </tr>
        ))}>
            <AdminReportsPageData />
        </Suspense>
    )
}

async function AdminReportsPageData() {
    const initialData = await getAdminReports()
    return <ReportsContent initialData={initialData} />
}
