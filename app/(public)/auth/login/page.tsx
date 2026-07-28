'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Mail, Lock, Loader2, EyeOff, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SiteLogo } from '@/components/ui/site-logo'
import { ImageCaptcha } from '@/components/ui/image-captcha'
import { EmailVerificationForm } from '@/components/auth/email-verification-form'
import { useLogin, useResendLoginVerification, useVerifyEmailAndLogin } from '@/hooks/use-auth'
import { useSearchParams } from 'next/navigation'
import { useSettings } from '@/context/settings-context'
import { googleLoginApi } from '@/lib/auth'

const schema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(8, 'كلمة المرور 8 أحرف على الأقل'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  )
}

function LoginPageFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
}

function LoginPageContent() {
  const settings = useSettings()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || undefined
  const [loginVerification, setLoginVerification] = useState<{
    email: string
    password: string
  } | null>(null)
  const [otpValue, setOtpValue] = useState('')
  const { mutate: login, isPending } = useLogin(redirectTo, {
    onEmailVerificationRequired: ({ email, password }) => {
      setLoginVerification({ email, password })
      setOtpValue('')
    },
  })
  const { mutate: resendLoginVerification, isPending: isSendingOtp } = useResendLoginVerification()
  const { mutate: verifyEmailAndLogin, isPending: isVerifyingOtp } = useVerifyEmailAndLogin(redirectTo)
  const [captchaPassed, setCaptchaPassed] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaKey, setCaptchaKey] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [isGooglePending, setIsGooglePending] = useState(false)

  const resetCaptcha = () => {
    setCaptchaPassed(false)
    setCaptchaToken(null)
    setCaptchaKey((key) => key + 1)
  }

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const password = watch('password')

  const onSubmit = (data: FormData) => {
    if (!captchaPassed || !captchaToken) return
    login(
      { ...data, turnstile_token: captchaToken },
      { onError: resetCaptcha },
    )
  }

  const handleGoogleLogin = async () => {
    setIsGooglePending(true)
    try {
      const url = await googleLoginApi()
      window.location.href = url
    } catch {
      setIsGooglePending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <SiteLogo size={40} logo={settings?.logo} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">أهلاً بعودتك</h1>
          <p className="text-gray-400 text-sm mt-1">سجّل الدخول إلى دُّلني-اليمن</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
          <button
            onClick={handleGoogleLogin}
            type="button"
            disabled={isGooglePending}
            className="w-full flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-5 disabled:opacity-70"
          >
            {isGooglePending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            المتابعة مع Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <hr className="flex-1 border-gray-100" />
            <span className="text-xs text-gray-400">أو</span>
            <hr className="flex-1 border-gray-100" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute top-1/2 right-3 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  {...register('email')}
                  type="email"
                  className="w-full border border-gray-200 rounded-xl px-4 pe-9 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="name@example.com"
                  dir="ltr"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute top-1/2 end-3 -translate-y-1/2 w-4 h-4 text-gray-300" />
                {password && password.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 end-9 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-primary" /> : <Eye className="w-4 h-4 text-primary" />}
                  </button>
                )}
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full border border-gray-200 rounded-xl px-4 pe-9 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="••••••••"
                  dir="rtl"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <ImageCaptcha
              key={captchaKey}
              onVerified={setCaptchaPassed}
              onTokenChange={setCaptchaToken}
            />

            <button
              type="submit"
              disabled={isPending || !captchaPassed}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              تسجيل الدخول
            </button>
          </form>

          <div className="mt-5 space-y-2 text-center">
            <p className="text-sm text-gray-500">
              نسيت كلمة المرور؟{' '}
              <Link href="/auth/forgot-password" className="text-primary font-semibold hover:underline">
                استعادة كلمة المرور
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              ليس لديك حساب؟{' '}
              <Link href="/auth/register" className="text-primary font-semibold hover:underline">
                إنشاء حساب
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {loginVerification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={() => setLoginVerification(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-card p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <EmailVerificationForm
                variant="modal"
                email={loginVerification.email}
                logo={settings?.logo}
                otpValue={otpValue}
                onOtpChange={setOtpValue}
                onVerify={() =>
                  verifyEmailAndLogin({
                    email: loginVerification.email,
                    password: loginVerification.password,
                    otp: otpValue,
                  })
                }
                onResend={() =>
                  resendLoginVerification({
                    email: loginVerification.email,
                    password: loginVerification.password,
                  })
                }
                isVerifying={isVerifyingOtp}
                isSendingOtp={isSendingOtp}
                title="تحقق من بريدك لتسجيل الدخول"
              />
              <button
                type="button"
                className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setLoginVerification(null)}
              >
                إلغاء
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
