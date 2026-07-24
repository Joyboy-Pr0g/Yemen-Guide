'use client'

import { Turnstile } from '@marsidev/react-turnstile'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

interface ImageCaptchaProps {
  onVerified: (ok: boolean) => void
  onTokenChange?: (token: string | null) => void
}

export function ImageCaptcha({ onVerified, onTokenChange }: ImageCaptchaProps) {
  if (!SITE_KEY) {
    return (
      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-center">
        مفتاح Cloudflare Turnstile غير مُعرَّف. أضف NEXT_PUBLIC_TURNSTILE_SITE_KEY إلى ملف .env
      </p>
    )
  }

  const handleReset = () => {
    onVerified(false)
    onTokenChange?.(null)
  }

  return (
    <div className="flex justify-center">
      <Turnstile
        siteKey={SITE_KEY}
        options={{ theme: 'light', size: 'normal', refreshExpired: 'auto' }}
        onSuccess={(token) => {
          onVerified(true)
          onTokenChange?.(token)
        }}
        onExpire={handleReset}
        onError={handleReset}
      />
    </div>
  )
}
