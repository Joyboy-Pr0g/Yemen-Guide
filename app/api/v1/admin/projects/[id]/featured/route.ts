import { fetchBackend, getAuthToken, parseJsonResponse } from '@/lib/api-proxy'
import { NextResponse, NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        if (!id) {
            return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 })
        }

        const body = await request.json()
        const { is_featured, featured_until, slug } = body

        if (typeof is_featured !== 'boolean') {
            return NextResponse.json({ message: 'Missing or invalid is_featured parameter' }, { status: 400 })
        }

        const token = await getAuthToken(request)
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const res = await fetchBackend(`/admin/projects/${id}/featured`, token, {
            method: 'PATCH',
            body: JSON.stringify({ is_featured, featured_until }),
        })
        const data = await parseJsonResponse(res)

        revalidatePath('/')
        revalidatePath('/projects')
        revalidatePath(`/projects/${slug}`)
        revalidatePath(`/dashboard/admin/projects/${slug}`)
        revalidatePath(`/dashboard/trader/projects/${slug}`)
        revalidatePath(`/dashboard/trader/projects`)
        revalidatePath('/api/v1/projects')
        revalidatePath('/api/v1/trader/projects')
        revalidatePath(`/api/v1/projects/${slug}`)
        revalidateTag('projects')
        revalidateTag(`project-${slug}`)

        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update project featured status'
        return NextResponse.json({ message }, { status: 502 })
    }
}
