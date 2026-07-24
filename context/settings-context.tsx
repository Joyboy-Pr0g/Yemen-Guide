'use client'

import { createContext, use, type ReactNode } from 'react'
import type { SiteSettings } from '@/types'

export const SettingsContext = createContext<Promise<SiteSettings> | null>(null)

export function SettingsProvider({
  children,
  promiseSettings,
}: {
  children: ReactNode
  promiseSettings: Promise<SiteSettings>
}) {
  return (
    <SettingsContext.Provider value={promiseSettings}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const settingsPromise = use(SettingsContext)
  if (!settingsPromise) return null
  return use(settingsPromise)
}