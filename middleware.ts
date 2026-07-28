import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
    USER_ROLE_COOKIE,
    dashboardPathForRole,
    setUserRoleCookie,
} from '@/lib/auth-cookies'
import { isEmailVerified } from '@/lib/auth/email-verification'

const TRADER_ROUTES = ['/dashboard/trader']
const ADMIN_ROUTES = ['/dashboard/admin']
const AUTH_ROUTES = ['/me']

function loginRedirect(request: NextRequest, pathname: string, extra?: Record<string, string>) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    if (extra) {
        for (const [key, value] of Object.entries(extra)) {
            redirectUrl.searchParams.set(key, value)
        }
    }
    return NextResponse.redirect(redirectUrl)
}

type MeUser = {
    role?: string
    email_verified_at?: string | null
    has_google?: boolean
}

async function fetchMeUser(request: NextRequest, token: string): Promise<MeUser | null> {
    try {
        const meUrl = new URL('/api/v1/auth/me', request.url)
        const res = await fetch(meUrl.toString(), {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        })
        if (!res.ok) return null
        const data = (await res.json()) as { user?: MeUser }
        return data.user ?? null
    } catch {
        return null
    }
}

export async function middleware(request: NextRequest) {
    const host = request.headers.get('host')
    if (host?.startsWith('www.')) {
        const url = request.nextUrl.clone()
        url.host = host.slice(4)
        return NextResponse.redirect(url, 301)
    }

    const token = request.cookies.get('auth_token')?.value?.trim()
    const { pathname } = request.nextUrl

    const isTraderRoute = TRADER_ROUTES.some((r) => pathname.startsWith(r))
    const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r))
    const isMemberRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))
    const requiresVerifiedSession = isTraderRoute || isAdminRoute || isMemberRoute

    if (!requiresVerifiedSession) {
        return NextResponse.next()
    }

    if (!token) {
        return loginRedirect(request, pathname)
    }

    const meUser = await fetchMeUser(request, token)
    if (!meUser) {
        return loginRedirect(request, pathname)
    }

    if (!isEmailVerified(meUser)) {
        return loginRedirect(request, pathname, { verify_email: '1' })
    }

    const role = meUser.role?.trim()
    if (!role) {
        return loginRedirect(request, pathname)
    }

    if (isAdminRoute && role !== 'admin') {
        return NextResponse.redirect(new URL(dashboardPathForRole(role), request.url))
    }

    if (isTraderRoute && role !== 'trader') {
        return NextResponse.redirect(new URL(dashboardPathForRole(role), request.url))
    }

    const hadRoleCookie = Boolean(request.cookies.get(USER_ROLE_COOKIE)?.value?.trim())
    if (!hadRoleCookie) {
        const response = NextResponse.next()
        setUserRoleCookie(response, role)
        return response
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
