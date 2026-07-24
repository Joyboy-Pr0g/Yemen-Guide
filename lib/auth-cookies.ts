import type { NextResponse } from 'next/server'

export const USER_ROLE_COOKIE = 'user_role'

const isProduction = process.env.NODE_ENV === 'production'

export const authTokenCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
}

export const userRoleCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
}

export function setAuthCookies(response: NextResponse, token: string, role: string) {
    response.cookies.set('auth_token', token, authTokenCookieOptions)
    response.cookies.set(USER_ROLE_COOKIE, role, userRoleCookieOptions)
}

export function setUserRoleCookie(response: NextResponse, role: string) {
    response.cookies.set(USER_ROLE_COOKIE, role, userRoleCookieOptions)
}

export function clearAuthCookies(response: NextResponse) {
    response.cookies.set('auth_token', '', { path: '/', maxAge: 0 })
    response.cookies.set(USER_ROLE_COOKIE, '', { path: '/', maxAge: 0 })
}

export function dashboardPathForRole(role: string | null | undefined): string {
    if (role === 'admin') return '/dashboard/admin'
    if (role === 'trader') return '/dashboard/trader'
    return '/me/favorites'
}
