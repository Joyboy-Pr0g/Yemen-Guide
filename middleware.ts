import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
    USER_ROLE_COOKIE,
    dashboardPathForRole,
    setUserRoleCookie,
} from '@/lib/auth-cookies'

const TRADER_ROUTES = ['/dashboard/trader']
const ADMIN_ROUTES = ['/dashboard/admin']
const AUTH_ROUTES = ['/me']

function loginRedirect(request: NextRequest, pathname: string) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
}

async function fetchUserRole(request: NextRequest, token: string): Promise<string | null> {
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
        const data = (await res.json()) as { user?: { role?: string } }
        return data.user?.role ?? null
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
    const isProtectedRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))

    if ((isTraderRoute || isAdminRoute || isProtectedRoute) && !token) {
        return loginRedirect(request, pathname)
    }

    if (!token || (!isAdminRoute && !isTraderRoute)) {
        return NextResponse.next()
    }

    const hadRoleCookie = Boolean(request.cookies.get(USER_ROLE_COOKIE)?.value?.trim())
    let role = request.cookies.get(USER_ROLE_COOKIE)?.value?.trim()

    if (!role) {
        role = (await fetchUserRole(request, token)) ?? undefined
    }

    if (!role) {
        return loginRedirect(request, pathname)
    }

    if (isAdminRoute && role !== 'admin') {
        return NextResponse.redirect(new URL(dashboardPathForRole(role), request.url))
    }

    if (isTraderRoute && role !== 'trader') {
        return NextResponse.redirect(new URL(dashboardPathForRole(role), request.url))
    }

    if (!hadRoleCookie && role) {
        const response = NextResponse.next()
        setUserRoleCookie(response, role)
        return response
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
