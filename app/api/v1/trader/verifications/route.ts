import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = new URLSearchParams()
    params.set('page', searchParams.get('page') || '1')

    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const res = await fetchBackend(`/trader/verifications?${params.toString()}`, token)
    const responseData = await parseJsonResponse(res)

    return NextResponse.json(responseData, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch verifications'
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

    const res = await fetchBackend(`/trader/verifications`, token, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    const responseData = await parseJsonResponse(res)

    revalidatePath('/api/v1/admin/verifications')
    revalidateTag('verifications')

    return NextResponse.json(responseData, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create project'
    return NextResponse.json({ message }, { status: 502 })
  }
}
