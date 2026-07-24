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
    const { slug } = await request.json()

    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const res = await fetchBackend(`/me/projects/${id}/favorite`, token, { method: 'POST' })
    const data = await parseJsonResponse(res)

    revalidatePath(`/projects/${slug}`)
    revalidatePath(`/api/v1/projects/${slug}`)
    revalidatePath(`/me/favorites`)
    revalidatePath(`/api/v1/me/projects/favorites`)
    revalidateTag(`project-${slug}`)
    revalidateTag('favorites')
    revalidateTag('projects')
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to toggle favorite'
    return NextResponse.json({ message }, { status: 502 })
  }
}
