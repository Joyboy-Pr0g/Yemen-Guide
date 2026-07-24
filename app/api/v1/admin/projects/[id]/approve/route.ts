import { fetchBackend, getAuthToken, parseJsonResponse } from '@/lib/api-proxy'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse, NextRequest } from 'next/server'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        if (!id) {
            return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 })
        }
        const body = await request.json().catch(() => ({}))
        const slug = body?.slug ?? ''

        const token = await getAuthToken(request)
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const res = await fetchBackend(`/admin/projects/${id}/approve`, token, { method: 'PATCH' })
        const data = await parseJsonResponse(res)

        revalidatePath('/')
        revalidatePath('/projects')
        if (slug) {
            revalidatePath(`/projects/${slug}`)
            revalidatePath(`/dashboard/admin/projects/${slug}`)
            revalidatePath(`/dashboard/trader/projects/${slug}`)
            revalidateTag(`project-${slug}`)
        }
        revalidatePath('/api/v1/projects')
        revalidatePath('/api/v1/trader/projects')
        revalidateTag('projects')

        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to approve project'
        return NextResponse.json({ message }, { status: 502 })
    }
}
