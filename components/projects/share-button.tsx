'use client'

import { Share2, Check } from 'lucide-react'
import { useState } from 'react'

export default function ShareButton({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: name, url: window.location.href })
      } catch {}
    } else {
      await navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
      {copied ? 'تم النسخ' : 'مشاركة'}
    </button>
  )
}
