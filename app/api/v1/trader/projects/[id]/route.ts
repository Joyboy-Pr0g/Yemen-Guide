import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy'
import { revalidatePath, revalidateTag } from 'next/cache'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 })
    }
    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const res = await fetchBackend(`/trader/projects/${id}`, token)
    const responseData = await parseJsonResponse(res)
    return NextResponse.json(responseData, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch project'
    return NextResponse.json({ message }, { status: 502 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 })
    }

    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()

    const res = await fetchBackend(`/trader/projects/${id}`, token, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    const responseData = await parseJsonResponse(res)

    revalidateTraderProjects()

    return NextResponse.json(responseData, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update project'
    return NextResponse.json({ message }, { status: 502 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 })
    }

    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const res = await fetchBackend(`/trader/projects/${id}`, token, { method: 'DELETE' })
    const responseData = await parseJsonResponse(res)

    revalidateTraderProjects()

    return NextResponse.json(responseData, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete project'
    return NextResponse.json({ message }, { status: 502 })
  }
}

function revalidateTraderProjects() {
  revalidatePath('/')
  revalidatePath('/projects')
  revalidatePath('/dashboard/trader/')
  revalidatePath('/dashboard/admin/projects')
  revalidatePath('/api/v1/admin/projects')
  revalidatePath('/api/v1/trader/projects')
  revalidateTag('trader-projects')
  revalidatePath('/api/v1/trader/dashboard')
  revalidatePath('/api/v1/projects')
  revalidateTag('projects')
  revalidateTag('trader-dashboard')
  revalidatePath('/dashboard/admin/projects/pending')
  revalidateTag('admin-projects-pending')
}