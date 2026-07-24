'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { createQueryClient } from '@/lib/query-client'
import { DynamicFavicon } from '@/components/ui/dynamic-favicon'
import { AuthProvider } from '@/context/auth-context'
import type { User } from '@/types'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/lib/fa-icons'

export default function Providers({
  children,
  initialUser = null,
}: {
  children: React.ReactNode
  initialUser?: User | null
}) {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialUser={initialUser}>
        <DynamicFavicon />
        {children}
        <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'var(--font-tajawal)',
            direction: 'rtl',
            background: '#1a1a1a',
            color: '#fff',
            borderRadius: '12px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#C5A059', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
        />
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        )}
      </AuthProvider>
    </QueryClientProvider>
  )
}
