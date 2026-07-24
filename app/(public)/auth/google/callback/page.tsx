'use client'

import { Suspense, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { googleCallbackApi } from '@/lib/auth'
import { useAuthContext } from '@/context/auth-context'
import type { User } from '@/types'

function redirectAfterLogin(router: ReturnType<typeof useRouter>, user: User, redirectTo?: string | null) {
  if (redirectTo) {
    router.replace(redirectTo)
  } else if (user.role === 'admin') {
    router.push('/dashboard/admin')
  } else if (user.role === 'trader') {
    router.push('/dashboard/trader')
  } else {
    router.push('/')
  }
}

function CallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setUser } = useAuthContext()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const query = searchParams.toString()
    if (!query) {
      router.push('/auth/login')
      return
    }

    const redirectTo = searchParams.get('redirect') || undefined

    googleCallbackApi(query)
      .then((result) => {
        if ('needs_role' in result && result.needs_role) {
          const params = new URLSearchParams({
            signup_token: result.signup_token,
            email: result.email,
            name: result.name,
          })
          if (redirectTo) params.set('redirect', redirectTo)
          router.replace(`/auth/google/complete?${params.toString()}`)
          return
        }

        toast.success(result.message)
        setUser(result.user)
        redirectAfterLogin(router, result.user, redirectTo)
      })
      .catch(() => {
        toast.error('فشل تسجيل الدخول عبر Google')
        router.push('/auth/login')
      })
  }, [searchParams, router, setUser])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">جارٍ تسجيل الدخول عبر Google...</p>
      </div>
    </div>
  )
}

export default function GoogleCallbackPage() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  )
}
