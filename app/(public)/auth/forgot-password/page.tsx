'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Mail, Loader2, CheckCircle } from 'lucide-react'
import { useForgotPassword } from '@/hooks/use-auth'
import { SiteLogo } from '@/components/ui/site-logo'
import { useSettings } from '@/context/settings-context'

export default function ForgotPasswordPage() {
  const settings = useSettings()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const { mutate: forgotPassword, isPending } = useForgotPassword()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    forgotPassword(email, {
      onSuccess: () => setSent(true),
    })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <SiteLogo size={40} logo={settings?.logo} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">نسيت كلمة المرور؟</h1>
          <p className="text-gray-400 text-sm mt-1">سنرسل إليك كلمة مرور جديدة على بريدك</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
          {sent ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-800 font-semibold">تم إرسال كلمة مرور جديدة</p>
              <p className="text-gray-400 text-sm">تحقق من بريدك الإلكتروني وسجّل الدخول بالكلمة الجديدة</p>
              <Link
                href="/auth/login"
                className="inline-block mt-2 w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors text-center"
              >
                تسجيل الدخول
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute top-1/2 end-3 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 pe-9 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="name@example.com"
                    dir="ltr"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending || !email.trim()}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                إرسال كلمة مرور جديدة
              </button>
            </form>
          )}

          {!sent && (
            <p className="text-center text-sm text-gray-500 mt-5">
              تذكّرت كلمة مرورك؟{' '}
              <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
