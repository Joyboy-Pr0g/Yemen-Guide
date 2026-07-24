import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = new URLSearchParams()
    params.set('page', searchParams.get('page') || '1')

    const optionalKeys = [
      'search',
      'status',
      'admin_approval_status',
      'featured',
      'city_id',
      'neighborhood_id',
      'sub_category_id',
      'category_id',
      'verified',
    ] as const

    for (const key of optionalKeys) {
      const value = searchParams.get(key)
      if (value) params.set(key, value)
    }

    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const res = await fetchBackend(`/trader/projects?${params.toString()}`, token)
    const responseData = await parseJsonResponse(res)

    return NextResponse.json(responseData, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch projects'
    return NextResponse.json({ message }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()

    const res = await fetchBackend(`/trader/projects`, token, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    const responseData = await parseJsonResponse(res)

    revalidatePath('/')
    revalidatePath('/projects')
    revalidatePath('/dashboard/admin/projects')
    revalidatePath('/dashboard/admin/projects/pending')
    revalidatePath('/api/v1/admin/projects')  
    revalidatePath('/api/v1/trader/projects')
    revalidateTag('trader-projects')
    revalidatePath('/api/v1/projects')
    revalidateTag('projects')
    revalidatePath('/api/v1/trader/dashboard')
    revalidatePath('/dashboard/trader/')
    revalidateTag('trader-dashboard')
    revalidateTag('admin-projects-pending')

    return NextResponse.json(responseData, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create project'
    return NextResponse.json({ message }, { status: 502 })
  }
}
