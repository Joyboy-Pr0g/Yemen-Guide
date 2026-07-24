'use client'

import { useEffect } from 'react'

const BBF_API_URL = process.env.NEXT_PUBLIC_BBF_API_URL || 'http://localhost:3000/api/v1'

function getDeviceId(): string {
  let id = localStorage.getItem('device_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('device_id', id)
  }
  return id
}

export default function ViewPing({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return

    const deviceId = getDeviceId()
    fetch(`${BBF_API_URL}/projects/${slug}`, {
      credentials: 'include',
      headers: { Accept: 'application/json', 'X-Device-Id': deviceId },
    }).catch(() => {})
  }, [slug])

  return null
}
