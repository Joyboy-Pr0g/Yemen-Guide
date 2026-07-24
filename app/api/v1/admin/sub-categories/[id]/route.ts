import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy' 
import { revalidatePath, revalidateTag } from 'next/cache'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        if (!id) {
            return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 })
        }
        const token = await getAuthToken(request)
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()

            const res = await fetchBackend(`/admin/sub-categories/${id}`, token, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
        const responseData = await parseJsonResponse(res)
        revalidateCategories()
        return NextResponse.json(responseData, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create project'
        return NextResponse.json({ message }, { status: 502 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        if (!id) {
            return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 })
        }
        const token = await getAuthToken(request)
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }
        const res = await fetchBackend(`/admin/sub-categories/${id}`, token, {
            method: 'DELETE',
        })
        const responseData = await parseJsonResponse(res)
        revalidateCategories()
        return NextResponse.json(responseData, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete category'
        return NextResponse.json({ message }, { status: 502 })
    }
}

function revalidateCategories() {
    revalidatePath('/')
    revalidatePath('/projects')
    revalidatePath('/api/v1/categories')
    revalidateTag('categories')
}