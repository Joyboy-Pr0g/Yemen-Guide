import { NextResponse, NextRequest } from 'next/server'
import { revalidatePath,revalidateTag } from 'next/cache'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy'

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const res = await fetchBackend(`/admin/categories`, token)
    const responseData = await parseJsonResponse(res)
    return NextResponse.json(responseData, { status: res.status })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch categories',
    }, {
      status: 500
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const res = await fetchBackend(`/admin/categories`, token, {
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
    const message = error instanceof Error ? error.message : 'Failed to create project'
    return NextResponse.json({ message }, { status: 502 })
  }
}
