import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getAuthToken(request)
    const { id } = await params
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const res = await fetchBackend(`/admin/visuals/${id}`, token, {
      method: 'PUT',
      body: formData,
    })
    const responseData = await parseJsonResponse(res)
    return NextResponse.json(responseData, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update visual'
    return NextResponse.json({ message }, { status: 502 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getAuthToken(request)
    const { id } = await params
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const res = await fetchBackend(`/admin/visuals/${id}`, token, {
      method: 'DELETE',
    })
    const responseData = await parseJsonResponse(res)
    return NextResponse.json(responseData, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete visual'
    return NextResponse.json({ message }, { status: 500 })
  }
}
