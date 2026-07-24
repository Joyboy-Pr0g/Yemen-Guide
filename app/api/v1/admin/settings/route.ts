import { NextResponse, NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy'

export async function GET(request: NextRequest) {
    try {
        const token = await getAuthToken(request)
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const res = await fetchBackend('/admin/settings', token)
        const responseData = await parseJsonResponse(res)

        return NextResponse.json(responseData, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch settings'
        return NextResponse.json({ message }, { status: 502 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const token = await getAuthToken(request)
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        const res = await fetchBackend('/admin/settings', token, {
            method: 'PUT',
            body: JSON.stringify(body),
        })
        const responseData = await parseJsonResponse(res)

        revalidatePath('/')
        revalidatePath('/api/v1/settings')
        revalidateTag('settings')

        return NextResponse.json(responseData, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update settings'
        return NextResponse.json({ message }, { status: 502 })
    }
}
