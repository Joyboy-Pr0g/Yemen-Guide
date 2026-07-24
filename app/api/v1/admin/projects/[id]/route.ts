import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params
        if (!id) {
            return NextResponse.json(
                { status: 'error', message: 'Missing slug parameter' },
                { status: 400 },
            )
        }

        const token = await getAuthToken(req)
        if (!token) {
            return NextResponse.json(
                { status: 'error', message: 'Unauthorized' },
                { status: 401 },
            )
        }


        const res = await fetchBackend(`/admin/projects/${id}`, token)
        const data = await parseJsonResponse(res)

        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch project'
        return NextResponse.json(
            { status: 'error', message },
            { status: 502 },
        )
    }
}

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

        const res = await fetchBackend(`/admin/projects/${id}`, token, { method: 'DELETE' })
        const data = await parseJsonResponse(res)

        if (res.ok) {
            revalidateProjectCaches()
        }

        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete project'
        return NextResponse.json({ message }, { status: 502 })
    }
}

function revalidateProjectCaches() {
    revalidatePath('/')
    revalidatePath('/projects')
    revalidatePath('/api/v1/projects')
    revalidatePath('/api/v1/admin/projects/audit')
    revalidateTag('projects')
}
