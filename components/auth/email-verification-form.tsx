'use client'

import { Loader2, RotateCcw, ShieldCheck } from 'lucide-react'
import { SiteLogo } from '@/components/ui/site-logo'

type EmailVerificationFormProps = {
  email: string
  logo?: string
  otpValue: string
  onOtpChange: (value: string) => void
  onVerify: () => void
  onResend: () => void
  isVerifying: boolean
  isSendingOtp: boolean
  /** Full-page layout (register). Omit for modal use. */
  variant?: 'page' | 'modal'
  title?: string
  footer?: React.ReactNode
}

export function EmailVerificationForm({
  email,
  logo,
  otpValue,
  onOtpChange,
  onVerify,
  onResend,
  isVerifying,
  isSendingOtp,
  variant = 'page',
  title = 'تحقق من بريدك',
  footer,
}: EmailVerificationFormProps) {
  const form = (
    <div className="space-y-5">
      {variant === 'page' && (
        <div className="text-center mb-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>
          <p className="text-gray-400 text-sm mt-2">أرسلنا رمز التحقق إلى</p>
          <p className="text-gray-700 text-sm font-medium" dir="ltr">{email}</p>
        </div>
      )}

      {variant === 'modal' && (
        <div className="text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="text-gray-500 text-sm mt-1">أرسلنا رمز التحقق إلى</p>
          <p className="text-gray-800 text-sm font-medium mt-0.5" dir="ltr">{email}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">رمز التحقق</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otpValue}
          onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-xl font-bold tracking-widest outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          placeholder="• • • • • •"
          dir="ltr"
          autoFocus={variant === 'modal'}
        />
      </div>

      <button
        type="button"
        disabled={isVerifying || otpValue.length !== 6}
        onClick={onVerify}
        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isVerifying && <Loader2 className="w-4 h-4 animate-spin" />}
        تحقق من الرمز
      </button>

      <button
        type="button"
        disabled={isSendingOtp}
        onClick={onResend}
        className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
      >
        {isSendingOtp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
        إعادة إرسال الرمز
      </button>

      {footer}
    </div>
  )

  if (variant === 'page') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-3">
              <SiteLogo size={40} logo={logo} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">{form}</div>
        </div>
      </div>
    )
  }

  return form
}
