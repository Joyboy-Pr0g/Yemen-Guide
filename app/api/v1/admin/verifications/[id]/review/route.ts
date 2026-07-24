import { NextResponse, NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { fetchBackend, getAuthToken, parseJsonResponse } from '@/lib/api-proxy'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        if (!id) {
            return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 })
        }
        const { action, admin_notes } = await request.json()
        if (!action || !['approve', 'reject', 're_approve_requested'].includes(action)) {
            return NextResponse.json({ message: 'Missing action parameter' }, { status: 400 })
        }
        if((action === 're_approve_requested' || action === 'reject') && !admin_notes) {
            return NextResponse.json({ message: 'Missing admin_notes parameter' }, { status: 400 })
        }
        const token = await getAuthToken(request)
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }
        const res = await fetchBackend(`/admin/verifications/${id}/review`, token, { method: 'PATCH', body: JSON.stringify({ action, admin_notes }) })
        const data = await parseJsonResponse(res)
        revalidatePath(`/dashboard/admin/verifications/${id}`)
        revalidatePath(`/dashboard/admin/verifications`)
        revalidatePath(`/api/v1/trader/verifications/`)
        revalidatePath(`/dashboard/trader/verifications/`)
        revalidatePath(`/api/v1/trader/verifications/${id}`)
        revalidateTag('verifications')
        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to review verification'
        return NextResponse.json({ message }, { status: 502 })
    }
}