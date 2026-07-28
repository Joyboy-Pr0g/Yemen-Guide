'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRegister, useSendOtp, useVerifyOtp, useLogout } from '@/hooks/use-auth'
import { EmailVerificationForm } from '@/components/auth/email-verification-form'
import { SiteLogo } from '@/components/ui/site-logo'
import { ImageCaptcha } from '@/components/ui/image-captcha'
import { useSettings } from '@/context/settings-context'
import { useRouter } from 'next/navigation'
import { googleLoginApi } from '@/lib/auth'
import { toast } from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(255),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(8, 'كلمة المرور 8 أحرف على الأقل'),
  password_confirmation: z.string(),
  role: z.enum(['visitor', 'trader']),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['password_confirmation'],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const settings = useSettings()
  const router = useRouter()
  const [captchaPassed, setCaptchaPassed] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaKey, setCaptchaKey] = useState(0)
  const [otpEmail, setOtpEmail] = useState<string | null>(null)
  const [otpValue, setOtpValue] = useState('')
  const [showGoogleConfirm, setShowGoogleConfirm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [isGoogleLoginPending, setIsGoogleLoginPending] = useState(false)

  const { mutate: register, isPending } = useRegister((email) => setOtpEmail(email))
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp()
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp(() => router.push('/'))
  const { mutate: logout } = useLogout({ redirectTo: '/' })

  const { register: reg, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'visitor' },
  })

  const password = watch('password')
  const passwordConfirmation = watch('password_confirmation')

  const role = watch('role')

  const handleGoogleLogin = async () => {
    setIsGoogleLoginPending(true)
    try {
      const url = await googleLoginApi(role)
      window.location.href = url
    } catch {
      toast.error('حدث خطأ ما أثناء تسجيل الدخول بواسطة Google', {
        duration: 5000,
        position: 'top-center',
      })
    } finally {
      setIsGoogleLoginPending(false)
    }
  }

  const onSubmit = (data: FormData) => {
    if (!captchaPassed || !captchaToken) return
    register(
      { ...data, turnstile_token: captchaToken },
      {
        onError: () => {
          setCaptchaPassed(false)
          setCaptchaToken(null)
          setCaptchaKey((key) => key + 1)
        },
      },
    )
  }

  if (otpEmail) {
    return (
      <EmailVerificationForm
        email={otpEmail}
        logo={settings?.logo}
        otpValue={otpValue}
        onOtpChange={setOtpValue}
        onVerify={() => verifyOtp(otpValue)}
        onResend={() => sendOtp()}
        isVerifying={isVerifying}
        isSendingOtp={isSendingOtp}
        footer={
          <p className="text-center text-xs text-gray-400">
            يمكنك{' '}
            <button
              type="button"
              onClick={() => logout()}
              className="text-primary hover:underline font-medium"
            >
              تخطي هذه الخطوة
            </button>
            {' '}والتحقق لاحقاً عند تسجيل الدخول
          </p>
        }
      />
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <SiteLogo size={40} logo={settings?.logo} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">إنشاء حساب جديد</h1>
          <p className="text-gray-400 text-sm mt-1">انضم إلى دُّلني-اليمن اليوم</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
          <button
            onClick={() => setShowGoogleConfirm(true)}
            type="button"
            className="w-full flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-5"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            المتابعة مع Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <hr className="flex-1 border-gray-100" />
            <span className="text-xs text-gray-400">أو</span>
            <hr className="flex-1 border-gray-100" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              {(['visitor', 'trader'] as const).map((r) => (
                <label
                  key={r}
                  className={`relative flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${role === r ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <input type="radio" {...reg('role')} value={r} className="sr-only" />
                  <span className="text-sm font-semibold text-gray-800">
                    {r === 'visitor' ? 'زائر' : 'صاحب نشاط تجاري'}
                  </span>
                  <span className="text-xs text-gray-400 mt-0.5">
                    {r === 'visitor' ? 'تصفح وتقييم' : 'إدارة نشاطك'}
                  </span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute top-1/2 end-3 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  {...reg('name')}
                  className="w-full border border-gray-200 rounded-xl px-4 pe-9 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="أحمد محمد"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute top-1/2 start-3 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  {...reg('email')}
                  type="email"
                  className="w-full border border-gray-200 rounded-xl px-4 pe-9 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
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
                  {...reg('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full border border-gray-200 rounded-xl px-4 pe-9 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">تأكيد كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute top-1/2 end-3 -translate-y-1/2 w-4 h-4 text-gray-300" />
                {passwordConfirmation && passwordConfirmation.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                    className="absolute top-1/2 end-9 -translate-y-1/2"
                  >
                    {showPasswordConfirmation ? <EyeOff className="w-4 h-4 text-primary" /> : <Eye className="w-4 h-4 text-primary" />}
                  </button>
                )}
                <input
                  {...reg('password_confirmation')}
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  className="w-full border border-gray-200 rounded-xl px-4 pe-9 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="••••••••"
                />
              </div>
              {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</p>}
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
              إنشاء الحساب
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            لديك حساب بالفعل؟{' '}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showGoogleConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={() => setShowGoogleConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-card p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-2">تأكيد نوع الحساب</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                سيتم المتابعة إلى Google. إذا لم يكن لديك حساب مسبقاً، سيتم إنشاؤه كـ{' '}
                <span className="font-semibold text-primary">
                  {role === 'trader' ? 'صاحب نشاط تجاري' : 'زائر'}
                </span>
                . أما إذا كان لديك حساب بالفعل، فسيتم تسجيل دخولك مباشرة بدون تغيير نوع حسابك.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isGoogleLoginPending}
                  onClick={() => setShowGoogleConfirm(false)}
                  className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm 
                  font-medium text-gray-600 hover:bg-gray-50 transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoginPending}
                  className="flex-1 flex items-center justify-center bg-primary text-white rounded-xl py-2.5 text-sm font-semibold
                  disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-accent/90 transition-colors"
                >
                  {isGoogleLoginPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'متابعة'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
