import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { normalizeYemenPhone } from './yemen-phone'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizePhoneForWhatsApp(phone: string): string {
  const normalized = normalizeYemenPhone(phone)
  if (normalized) {
    return normalized.replace(/\s+/g, '')
  }

  let fallback = phone.trim()
  if (fallback.startsWith('0')) {
    fallback = '+967' + fallback.slice(1)
  }
  return fallback.replace(/\s+/g, '').replace(/[^+\d]/g, '')
}

export function getWhatsAppUrl(phone: string, message?: string): string {
  const normalized = normalizePhoneForWhatsApp(phone)
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${normalized}${encodedMessage}`
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '/placeholder.webp'
  if (path.startsWith('http')) return path
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:8000/storage'
  return `${storageUrl}/${path}`
}

export const DEFAULT_SITE_LOGO = '/wayn-logo.jpeg'

/** Facebook / browser profile icon (square logo) */
export const SOCIAL_PROFILE_IMAGE = encodeURI('/facebook profile img.jpg')

/** Link preview image for Open Graph & Twitter shares */
export const SOCIAL_SHARE_IMAGE = '/wayn-sharer.jpg'

/** Facebook page cover banner */
export const SOCIAL_COVER_IMAGE = encodeURI('/wayn facebook cover.jpg')

/** Rewrite Laravel site-logo proxy URL to the Next.js BFF endpoint (same origin). */
export function resolveSiteLogoUrl(logo?: string | null): string {
  if (!logo) return DEFAULT_SITE_LOGO
  if (logo.includes('/settings/logo')) {
    const base = (process.env.NEXT_PUBLIC_BBF_API_URL || 'http://localhost:3000/api/v1').replace(/\/$/, '')
    return `${base}/settings/logo`
  }
  return logo
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    public: 'منشور',
    draft: 'مسودة',
    pending: 'قيد المراجعة',
    approved: 'موافق عليه',
    rejected: 'مرفوض',
    re_approve_requested: 'طلب إعادة مراجعة',
    reviewed: 'تمت المراجعة',
    dismissed: 'مغلق',
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    public: 'bg-green-100 text-green-700',
    draft: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
    re_approve_requested: 'bg-blue-100 text-blue-700',
    reviewed: 'bg-green-100 text-green-700',
    dismissed: 'bg-gray-100 text-gray-600',
  }
  return colors[status] || 'bg-gray-100 text-gray-600'
}

export function getReportTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    sensitive_content: 'محتوى حساس',
    inappropriate_image: 'صورة غير مناسبة',
    wrong_content: 'محتوى خاطئ',
    different_entity: 'يتبع لجهة أو كيان مختلف',
  }
  return labels[type] || type
}

export function useDebounce<T>(value: T, delay: number): T {
  return value
}
