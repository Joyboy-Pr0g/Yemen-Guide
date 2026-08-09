const BBF_API_URL = process.env.NEXT_PUBLIC_BBF_API_URL || 'http://localhost:3000/api/v1'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export function getClientAuthToken(): string | null {
  if (typeof window === 'undefined') return null

  const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/)
  if (match?.[1]) return decodeURIComponent(match[1])

  try {
    return localStorage.getItem('auth_token')
  } catch {
    return null
  }
}

function parseUploadResponse<T>(res: Response, text: string): T {
  const contentType = res.headers.get('content-type') ?? ''

  if (!contentType.includes('application/json')) {
    if (
      res.status === 413
      || text.includes('FUNCTION_PAYLOAD_TOO_LARGE')
      || text.includes('Content-Length')
      || text.includes('upload_max_filesize')
      || text.includes('POST Content-Length')
    ) {
      throw new Error(
        'حجم الفيديو كبير جداً للرفع عبر واجهة الموقع. جرّب مرة أخرى بعد تحديث التطبيق، أو قلّل حجم الملف.'
      )
    }

    throw new Error(`استجابة غير متوقعة من الخادم (${res.status})`)
  }

  let data: T & { message?: string; errors?: Record<string, string[]> }
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('تعذّر قراءة استجابة الخادم. تحقق من حد رفع الملفات في PHP.')
  }

  if (!res.ok) {
    const apiError = new Error(data?.message || `API Error: ${res.status}`) as Error & {
      errors?: Record<string, string[]>
    }
    apiError.errors = data?.errors
    throw apiError
  }

  return data
}

export async function bbfFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options?.headers as Record<string, string> | undefined),
  }

  if (
    options?.body &&
    typeof options.body === 'string' &&
    !headers['Content-Type'] &&
    !headers['content-type']
  ) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${BBF_API_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers,
  })

  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    throw new Error(`Expected JSON (${res.status}), got ${contentType || 'unknown type'}`)
  }

  const data = await res.json()
  if (!res.ok) {
    const apiError = new Error(data?.message || `API Error: ${res.status}`) as any
    apiError.errors = data?.errors
    throw apiError
  }

  return data
}

// Large uploads — bypass Next.js/Vercel proxy (4.5MB limit) and send directly to Laravel.
export async function backendUpload<T>(path: string, formData: FormData, method = 'POST'): Promise<T> {
  const token = getClientAuthToken()
  if (!token) {
    throw new Error('يجب تسجيل الدخول أولاً')
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const text = await res.text()
  return parseUploadResponse<T>(res, text)
}

// Helper function to upload data to the API
export async function bbfUpload<T>(path: string, formData: FormData, method = 'POST'): Promise<T> {
  const res = await fetch(`${BBF_API_URL}${path}`, {
    credentials: 'include',
    method,
    body: formData,
  })

  const text = await res.text()
  return parseUploadResponse<T>(res, text)
}