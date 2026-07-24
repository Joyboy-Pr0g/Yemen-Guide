import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params
        if (!id) {
            return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 })
        }

        const token = await getAuthToken(req)
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const res = await fetchBackend(`/admin/projects/${id}/image`, token, { method: 'DELETE' })
        const data = await parseJsonResponse(res)

        if (res.ok) {
            revalidatePath('/api/v1/admin/projects/audit')
            revalidatePath('/api/v1/admin/projects/audit-projects')
            revalidatePath('/api/v1/projects')
            revalidatePath('/projects')
            revalidatePath(`/dashboard/admin/projects`)
            revalidatePath(`/dashboard/trader/projects`)
            revalidatePath(`/projects`)
            revalidateTag('projects')
        }

        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete project image'
        return NextResponse.json({ message }, { status: 502 })
    }
}
