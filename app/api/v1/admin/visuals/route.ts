import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy'

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const res = await fetchBackend('/admin/visuals', token)
    const responseData = await parseJsonResponse(res)
    return NextResponse.json(responseData, { status: res.status })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch visuals',
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const res = await fetchBackend('/admin/visuals', token, {
      method: 'POST',
      body: formData,
    })
    const responseData = await parseJsonResponse(res)
    return NextResponse.json(responseData, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create visual'
    return NextResponse.json({ message }, { status: 502 })
  }
}
