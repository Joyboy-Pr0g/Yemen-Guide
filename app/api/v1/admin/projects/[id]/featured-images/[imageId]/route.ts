import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; imageId: string }> },
) {
    try {
        const { id, imageId } = await params
        if (!id || !imageId) {
            return NextResponse.json({ message: 'Missing parameters' }, { status: 400 })
        }

        const token = await getAuthToken(req)
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const res = await fetchBackend(
            `/admin/projects/${id}/featured-images/${imageId}`,
            token,
            { method: 'DELETE' },
        )
        const data = await parseJsonResponse(res)

        if (res.ok) {
            revalidatePath('/api/v1/admin/projects/audit')
            revalidateTag('projects')
        }

        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete featured image'
        return NextResponse.json({ message }, { status: 502 })
    }
}
