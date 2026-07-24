import { useEffect } from 'react'
import {SiteSettings} from '@/types'

interface DynamicFaviconProps {
  settings?: SiteSettings
}

export function DynamicFavicon({ settings }: DynamicFaviconProps) {
  const logo = settings?.logo as string | undefined

  useEffect(() => {
    if (!logo) return
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
      || Object.assign(document.createElement('link'), { rel: 'icon' })
    link.href = logo
    if (!link.parentNode) document.head.appendChild(link)
  }, [logo])

  return null
}
