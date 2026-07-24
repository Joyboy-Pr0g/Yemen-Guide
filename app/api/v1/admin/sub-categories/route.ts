import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
    try {
        const token = await getAuthToken(request)
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()

        const res = await fetchBackend(`/admin/sub-categories`, token, {
            method: 'POST',
            body: JSON.stringify(data),
        })
        const responseData = await parseJsonResponse(res)
        revalidatePath('/')
        revalidatePath('/projects')
        revalidatePath('/api/v1/categories')
        revalidateTag('categories')

        return NextResponse.json(responseData, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create sub category'
        return NextResponse.json({ message }, { status: 502 })
    }
}
