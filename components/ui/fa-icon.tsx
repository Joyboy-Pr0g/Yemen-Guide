'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { IconName } from '@fortawesome/fontawesome-svg-core'
import { Grid3X3 } from 'lucide-react'
import { cn } from '@/lib/utils'

// FA5 → FA6 renamed icons (keys are FA5 kebab names without fa- prefix)
const FA5_TO_FA6: Record<string, string> = {
  'shopping-basket': 'basket-shopping',
  'home': 'house',
  'coffee': 'mug-hot',
  'hamburger': 'burger',
  'birthday-cake': 'cake-candles',
  'heartbeat': 'heart-pulse',
  'phone-alt': 'phone',
  'map-marker': 'location-dot',
  'map-marker-alt': 'location-dot',
  'cog': 'gear',
  'cogs': 'gears',
  'times': 'xmark',
  'search': 'magnifying-glass',
  'info-circle': 'circle-info',
  'check-circle': 'circle-check',
  'times-circle': 'circle-xmark',
  'exclamation-circle': 'circle-exclamation',
  'question-circle': 'circle-question',
  'paint-brush': 'paintbrush',
  'football-ball': 'football',
  'basketball-ball': 'basketball',
  'volleyball-ball': 'volleyball',
  'table-tennis': 'table-tennis-paddle-ball',
  'smile': 'face-smile',
  'frown': 'face-frown',
  'meh': 'face-meh',
  'bar-chart': 'chart-bar',
  'line-chart': 'chart-line',
  'bank': 'building-columns',
  'university': 'building-columns',
  'tint': 'droplet',
  'thermometer-half': 'temperature-half',
  'money-bill-alt': 'money-bill',
  'id-card-alt': 'id-card-clip',
  'cut': 'scissors',
  'file-alt': 'file-lines',
  'user-alt': 'user-large',
  'user-circle': 'circle-user',
  'trash-alt': 'trash-can',
  'edit': 'pen-to-square',
  'calendar-alt': 'calendar-days',
  'map-signs': 'signs-post',
  'shopping-cart': 'cart-shopping',
  'chalkboard-teacher': 'chalkboard-user',
  'tshirt': 'shirt',
  'first-aid': 'kit-medical',
  'band-aid': 'bandage',
  'mobile-alt': 'mobile-screen-button',
  'utensil-spoon': 'spoon',
  'car-alt': 'car-rear',
}

export function resolveIconName(icon: string): string {
  const kebab = icon.replace(/^fa[sbrl]?-/, '')
  return FA5_TO_FA6[kebab] ?? kebab
}

interface FaIconProps {
  icon: string | null | undefined
  className?: string
  fallback?: React.ReactNode
}

export function FaIcon({ icon, className, fallback }: FaIconProps) {
  if (!icon) return fallback ? <>{fallback}</> : null

  const iconName = resolveIconName(icon) as IconName
  const def = findIconDefinition({ prefix: 'fas', iconName })

  if (!def) {
    return fallback ? <>{fallback}</> : <Grid3X3 className={cn('w-5 h-5', className)} />
  }

  return <FontAwesomeIcon icon={def} className={cn(className)} />
}
