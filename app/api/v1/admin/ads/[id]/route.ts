import { NextResponse, NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = await getAuthToken(request)
        const { id } = await params
        if (!id) {
            return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 })
        }
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()

        const res = await fetchBackend(`/admin/ads/${id}`, token, {
            method: 'PUT',
            body: formData,
        })

        revalidatePath('/')
        revalidatePath('/projects')
        revalidatePath('/api/v1/ads')
        revalidateTag('ads')

        const responseData = await parseJsonResponse(res)
        return NextResponse.json(responseData, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update ad'
        return NextResponse.json({ message }, { status: 502 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        if (!id) {
            return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 })
        }
        const token = await getAuthToken(request)
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const res = await fetchBackend(`/admin/ads/${id}`, token, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })

        revalidatePath('/')
        revalidatePath('/projects')
        revalidatePath('/api/v1/ads')
        revalidateTag('ads')

        const responseData = await parseJsonResponse(res)
        return NextResponse.json(responseData, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete ad'
        return NextResponse.json({ message }, { status: 500 })
    }
}
