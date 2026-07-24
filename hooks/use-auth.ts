'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { loginApi, registerApi, logoutApi, sendOtpApi, verifyOtpApi, forgotPasswordApi } from '@/lib/auth'
import { updateTraderProfile, updateTraderPassword } from '@/lib/trader/trader-api'
import { useAuthContext } from '@/context/auth-context'
import type { LoginData, RegisterData } from '@/types'

export function useLogin(redirectTo?: string) {
  const router = useRouter()
  const { setUser } = useAuthContext()

  return useMutation({
    mutationFn: (data: LoginData) => loginApi(data),
    onSuccess: ({ user, message }) => {
      toast.success(message)
      setUser(user)
      if (user) {
        if (redirectTo) {
          router.replace(redirectTo)
        } else if (user.role === 'admin') {
          router.push('/dashboard/admin')
        } else if (user.role === 'trader') {
          router.push('/dashboard/trader')
        } else {
          router.push('/')
        }
      } else {
        router.push('/auth/login')
      }
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ أثناء تسجيل الدخول')
    }
  })
}

export function useRegister(onRegisterSuccess?: (email: string) => void) {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: RegisterData) => registerApi(data),
    onSuccess: ({ message }, variables) => {
      toast.success(message)
      if (onRegisterSuccess) {
        onRegisterSuccess(variables.email)
      } else {
        router.push('/')
      }
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ أثناء التسجيل')
    }
  })
}

export function useSendOtp() {
  return useMutation({
    mutationFn: sendOtpApi,
    onSuccess: ({ message }) => {
      toast.success(message)
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال الرمز')
    }
  })
}

export function useVerifyOtp(onSuccess?: () => void) {
  const router = useRouter()

  return useMutation({
    mutationFn: (otp: string) => verifyOtpApi(otp),
    onSuccess: ({ message }) => {
      toast.success(message)
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/')
      }
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'الرمز غير صحيح أو منتهي الصلاحية')
    }
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPasswordApi(email),
    onSuccess: ({ message }) => {
      toast.success(message)
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ، تحقق من البريد الإلكتروني')
    }
  })
}

export function useLogout() {
  const router = useRouter()
  const { setUser } = useAuthContext()

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      setUser(null)
      router.push('/auth/login')
    },
  })
}

export function useCurrentUser() {
  const { user } = useAuthContext()

  return {
    data: user ?? undefined,
    isLoading: false,
    isError: false,
    isFetching: false,
  }
}

export function useUpdateProfile() {
  const { setUser } = useAuthContext()

  return useMutation({
    mutationFn: (data: { name: string }) => updateTraderProfile(data),
    onSuccess: ({ message, user }) => {
      toast.success(message)
      setUser(user)
    },
    onError: (error: unknown & { errors?: Record<string, string[]> }) => {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث الملف الشخصي')
      if (error.errors) {
        Object.values(error.errors).flat().forEach((msg) => toast.error(msg))
      }
    },
  })
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (data: { current_password: string; password: string; password_confirmation: string }) =>
      updateTraderPassword(data),
    onSuccess: ({ message }) => {
      toast.success(message)
    },
    onError: (error: unknown & { errors?: Record<string, string[]> }) => {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ أثناء تغيير كلمة المرور')
      if (error.errors) {
        Object.values(error.errors).flat().forEach((msg) => toast.error(msg))
      }
    },
  })
}
