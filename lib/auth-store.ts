'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  _hasHydrated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User) => void
  setHasHydrated: (val: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      login: (token, user) => {
        localStorage.setItem('auth_token', token)
        document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
        set({ token, user, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        document.cookie = 'auth_token=; Max-Age=0; path=/'
        set({ token: null, user: null, isAuthenticated: false })
      },

      setUser: (user) => set({ user }),
      setHasHydrated: (val) => set({ _hasHydrated: val }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
