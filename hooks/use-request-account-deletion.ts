'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { requestAccountDeletionApi } from '@/lib/auth'
import { useAuthContext } from '@/context/auth-context'

export function useRequestAccountDeletion() {
  const router = useRouter()
  const { setUser } = useAuthContext()

  return useMutation({
    mutationFn: requestAccountDeletionApi,
    onSuccess: ({ message }) => {
      toast.success(message)
      setUser(null)
      router.push('/auth/login')
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'تعذّر إتمام طلب حذف الحساب')
    },
  })
}
