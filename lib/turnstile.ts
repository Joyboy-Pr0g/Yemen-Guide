type TurnstileVerifyResponse = {
  success: boolean
  'error-codes'?: string[]
}

export type TurnstileVerifyResult = {
  success: boolean
  errorCodes: string[]
  skipped: boolean
}

const TEST_SECRET_KEY = '1x0000000000000000000000000000000AA'

export function shouldSkipTurnstileVerify(): boolean {
  return process.env.TURNSTILE_SKIP_VERIFY === 'true'
}

function isLoopbackIp(ip: string): boolean {
  if (ip === '::1' || ip === '127.0.0.1') return true
  if (ip.startsWith('192.168.') || ip.startsWith('10.')) return true

  const match = /^172\.(\d+)\./.exec(ip)
  if (match) {
    const second = Number(match[1])
    return second >= 16 && second <= 31
  }

  return false
}

export function resolveTurnstileClientIp(
  forwardedFor: string | null,
  realIp: string | null,
): string | null {
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp?.trim() || null
  if (!ip || isLoopbackIp(ip)) {
    return null
  }
  return ip
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string | null,
): Promise<boolean> {
  const result = await verifyTurnstileTokenDetailed(token, remoteIp)
  return result.success
}

export async function verifyTurnstileTokenDetailed(
  token: string,
  remoteIp?: string | null,
): Promise<TurnstileVerifyResult> {
  if (shouldSkipTurnstileVerify()) {
    return { success: true, errorCodes: [], skipped: true }
  }

  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    throw new Error('TURNSTILE_SECRET_KEY is not configured')
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  })

  if (remoteIp) {
    body.set('remoteip', remoteIp)
  }

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    return { success: false, errorCodes: ['siteverify-http-error'], skipped: false }
  }

  const data = (await res.json()) as TurnstileVerifyResponse
  const errorCodes = data['error-codes'] ?? []

  if (process.env.NODE_ENV === 'development' && errorCodes.length > 0) {
    console.error('[turnstile] verification failed:', errorCodes.join(', '))
  }

  return {
    success: data.success === true,
    errorCodes,
    skipped: false,
  }
}

export function turnstileFailureMessage(errorCodes: string[]): string {
  if (errorCodes.includes('hostname-mismatch')) {
    return process.env.NODE_ENV === 'development'
      ? 'فشل التحقق: أضف localhost إلى نطاقات Turnstile في Cloudflare، أو عيّن TURNSTILE_SKIP_VERIFY=true في .env للتطوير المحلي.'
      : 'فشل التحقق من الأمان. حاول مجدداً.'
  }

  if (errorCodes.includes('timeout-or-duplicate')) {
    return 'انتهت صلاحية التحقق. أكمل التحقق من الأمان مرة أخرى ثم حاول تسجيل الدخول.'
  }

  if (errorCodes.includes('invalid-input-secret')) {
    return 'خدمة التحقق غير مهيأة بشكل صحيح.'
  }

  return 'فشل التحقق من الأمان. حاول مجدداً.'
}

export function isTurnstileTestSecret(secret = process.env.TURNSTILE_SECRET_KEY): boolean {
  return secret === TEST_SECRET_KEY
}
