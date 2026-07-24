import { fetchBackend, getAuthToken, parseJsonResponse } from '@/lib/api-proxy'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse, NextRequest } from 'next/server'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        if (!id) {
            return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 })
        }
        const { status, slug } = await request.json()
        if (!status) {
            return NextResponse.json({ message: 'Missing status parameter' }, { status: 400 })
        }
        const token = await getAuthToken(request)
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const res = await fetchBackend(`/trader/projects/${id}/status`, token, { method: 'PATCH', body: JSON.stringify({ status }) })
        const data = await parseJsonResponse(res)

        revalidatePath('/')
        revalidatePath('/projects')
        revalidatePath(`/projects/${slug}`)
        revalidatePath(`/dashboard/trader/`)
        revalidatePath(`/dashboard/admin/projects/${slug}`)
        revalidatePath(`/dashboard/trader/projects/${slug}`)
        revalidatePath(`/dashboard/admin/projects`)
        revalidatePath('/api/v1/projects')
        revalidatePath('/api/v1/trader/projects')
        revalidatePath('/api/v1/admin/projects')
        revalidatePath(`/api/v1/projects/${slug}`)
        revalidatePath('/api/v1/trader/dashboard')
        revalidateTag('trader-projects')
        revalidateTag('trader-dashboard')
        revalidateTag('projects')
        revalidateTag(`project-${slug}`)

        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update project status'
        return NextResponse.json({ message }, { status: 502 })
    }
}