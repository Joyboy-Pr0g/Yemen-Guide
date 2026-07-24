'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@/types'

interface AuthContextValue {
  user: User | null
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode
  initialUser: User | null
}) {
  const [user, setUser] = useState<User | null>(initialUser)

  useEffect(() => {
    setUser(initialUser)
  }, [initialUser])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}
