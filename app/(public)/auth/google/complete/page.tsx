'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { SiteLogo } from '@/components/ui/site-logo'
import { useSettings } from '@/context/settings-context'
import { googleCompleteApi } from '@/lib/auth'
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

function GoogleCompleteContent() {
  const settings = useSettings()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser } = useAuthContext()

  const signupToken = searchParams.get('signup_token') ?? ''
  const email = searchParams.get('email') ?? ''
  const name = searchParams.get('name') ?? ''
  const redirectTo = searchParams.get('redirect')

  const [role, setRole] = useState<'visitor' | 'trader'>('visitor')
  const [isPending, setIsPending] = useState(false)

  const handleComplete = async () => {
    if (!signupToken) {
      toast.error('جلسة التسجيل غير صالحة')
      router.push('/auth/login')
      return
    }

    setIsPending(true)
    try {
      const { user, message } = await googleCompleteApi(signupToken, role)
      toast.success(message)
      setUser(user)
      redirectAfterLogin(router, user, redirectTo)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر إكمال التسجيل')
      router.push('/auth/login')
    } finally {
      setIsPending(false)
    }
  }

  if (!signupToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-gray-600">جلسة التسجيل غير صالحة</p>
          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className="text-primary font-semibold hover:underline"
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <SiteLogo size={40} logo={settings?.logo} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">أكمل إنشاء حسابك</h1>
          <p className="text-gray-400 text-sm mt-1">اختر نوع الحساب للمتابعة عبر Google</p>
          {(name || email) && (
            <p className="text-sm text-gray-600 mt-3" dir="ltr">
              {name}{name && email ? ' · ' : ''}{email}
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: 'visitor' as const, title: 'زائر', desc: 'تصفح وتقييم' },
              { value: 'trader' as const, title: 'صاحب نشاط تجاري', desc: 'إدارة نشاطك' },
            ]).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRole(option.value)}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                  role === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-sm font-semibold text-gray-800">{option.title}</span>
                <span className="text-xs text-gray-400 mt-0.5">{option.desc}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleComplete}
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            إنشاء الحساب والمتابعة
          </button>
        </div>
      </div>
    </div>
  )
}

export default function GoogleCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <GoogleCompleteContent />
    </Suspense>
  )
}
