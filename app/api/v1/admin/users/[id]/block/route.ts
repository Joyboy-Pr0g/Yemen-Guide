import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'
import { fetchBackend, getAuthToken, parseJsonResponse } from '@/lib/api-proxy'

async function toggleBlock(request: NextRequest, id: string, action: 'block' | 'unblock') {
  const token = await getAuthToken(request)
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const res = await fetchBackend(`/admin/users/${id}/${action}`, token, { method: 'PATCH' })
  const data = await parseJsonResponse(res)

  revalidatePath(`/dashboard/admin/users/${id}`)
  revalidatePath(`/dashboard/admin/users`)

  return NextResponse.json(data, { status: res.status })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 })
    }

    return await toggleBlock(request, id, 'block')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to block user'
    return NextResponse.json({ message }, { status: 502 })
  }
}
