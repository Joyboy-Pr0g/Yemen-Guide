import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { fetchBackend, getAuthToken, parseJsonResponse } from '@/lib/api-proxy'
import { revalidatePath,revalidateTag } from 'next/cache'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 })
    }
    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { slug } = body
    const res = await fetchBackend(`/me/projects/${id}/rate`, token, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    const data = await parseJsonResponse(res)
    revalidatePath(`/projects/${slug}`)
    revalidatePath(`/api/v1/projects/${slug}`)
    revalidateTag(`project-${slug}`)
    revalidateTag('ratings')
    revalidateTag('projects')
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to rate project'
    return NextResponse.json({ message }, { status: 502 })
  }
}
