import { NextResponse, NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy'
import { resolveSiteLogoUrl } from '@/lib/utils'

export async function POST(request: NextRequest) {
    try {
        const token = await getAuthToken(request)
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()

        const res = await fetchBackend('/admin/settings/logo', token, {
            method: 'POST',
            body: formData,
        })
        const responseData = await parseJsonResponse(res) as { message?: string; logo?: string }

        if (responseData.logo) {
            responseData.logo = resolveSiteLogoUrl(responseData.logo)
        }

        revalidatePath('/')
        revalidatePath('/api/v1/settings')
        revalidateTag('settings')

        return NextResponse.json(responseData, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to upload logo'
        return NextResponse.json({ message }, { status: 502 })
    }
}
