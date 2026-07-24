import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy'

type RouteContext = { params: Promise<{ slug: string }> }

export async function POST(request: NextRequest, { params }: RouteContext) {
    try {
        const { slug } = await params
        if (!slug) {
            return NextResponse.json({ message: 'Slug is required' }, { status: 400 })
        }
        const token = await getAuthToken(request)
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        const res = await fetchBackend(`/projects/${slug}/report`, token, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })
        const responseData = await parseJsonResponse(res)

        return NextResponse.json(responseData, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create project'
        return NextResponse.json({ message }, { status: 502 })
    }
}