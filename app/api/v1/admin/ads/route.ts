import { NextResponse, NextRequest } from 'next/server'
import { revalidatePath,revalidateTag } from 'next/cache'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy'

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken(request)
    const page = request.nextUrl.searchParams.get('page') || '1'
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const res = await fetchBackend(`/admin/ads`, token)
    const responseData = await parseJsonResponse(res)
    return NextResponse.json(responseData, { status: res.status })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch ads',
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
  
      const formData = await request.formData()
  
      const res = await fetchBackend(`/admin/ads`, token, {
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
      revalidatePath('/api/v1/ads')
      revalidateTag('ads')
  
      return NextResponse.json(responseData, { status: res.status })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create project'
      return NextResponse.json({ message }, { status: 502 })
    }
  }
  