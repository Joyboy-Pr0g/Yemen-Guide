import type { User } from '@/types'

/** Email/password users must have verified email; Google sign-in is treated as verified. */
export function isEmailVerified(user: Pick<User, 'email_verified_at' | 'has_google'> | null | undefined): boolean {
  if (!user) return false
  if (user.has_google) return true
  return Boolean(user.email_verified_at)
}

export function canUseAuthenticatedNav(user: User | null | undefined): boolean {
  return !!user && isEmailVerified(user)
}
