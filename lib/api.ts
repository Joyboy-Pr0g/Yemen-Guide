const BBF_API_URL = process.env.NEXT_PUBLIC_BBF_API_URL || 'http://localhost:3000/api/v1'

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

// Helper function to upload data to the API
export async function bbfUpload<T>(path: string, formData: FormData, method = 'POST'): Promise<T> {
  const res = await fetch(`${BBF_API_URL}${path}`, {
    credentials: 'include',
    method,
    body: formData,
  })

  const contentType = res.headers.get('content-type') ?? ''
  const text = await res.text()

  if (!contentType.includes('application/json')) {
    const uploadLimitHint = text.includes('Content-Length') || text.includes('upload_max_filesize') || text.includes('POST Content-Length')
      ? 'حجم الفيديو يتجاوز حد الرفع على الخادم (8MB افتراضياً). أعد تشغيل Laravel باستخدام serve.bat أو زِد upload_max_filesize في php.ini.'
      : `استجابة غير متوقعة من الخادم (${res.status})`
    throw new Error(uploadLimitHint)
  }

  let data: T & { message?: string; errors?: Record<string, string[]> }
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('تعذّر قراءة استجابة الخادم. تحقق من حد رفع الملفات في PHP.')
  }

  if (!res.ok) {
    const apiError = new Error(data?.message || `API Error: ${res.status}`) as any
    apiError.errors = data?.errors
    throw apiError
  }

  return data
}