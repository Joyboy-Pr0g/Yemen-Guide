---
name: project-yemenguide
description: YemenGuide Frontend — Next.js 14 Arabic business directory, architecture, known issues, recent changes
metadata:
  type: project
---

# YemenGuide Frontend

Next.js 14 Arabic business directory. BFF (Backend-For-Frontend) pattern: Next.js routes proxy to Laravel backend.

**Why:** Business directory for Yemen with traders, visitors, and admin roles.
**How to apply:** When suggesting code changes, follow the existing BFF proxy pattern (api-proxy.ts, getAuthToken, fetchBackend, parseJsonResponse).

## Architecture

- `app/api/v1/...` — BFF proxy routes that add auth token and forward to Laravel backend (`NEXT_PUBLIC_API_URL`)
- `lib/...api.ts` — client-side fetch helpers calling BFF (`NEXT_PUBLIC_BBF_API_URL`)
- `hooks/use-*.ts` — React Query hooks wrapping the client-side API functions
- `components/` — UI components (shared `/projects/`, role-scoped `/admin/`, `/trader/`)
- `types/index.ts` — shared TypeScript interfaces

## Key recent changes (June 2026)

### Project approval workflow
- Added `admin_approval_status: 'pending' | 'approved' | 'rejected'` and `admin_message` to `Project` type
- Removed `hidden_by_admin` status (previously `ProjectStatus` was `public | draft | hidden_by_admin`)
- Admin approve/reject routes: `PATCH /admin/projects/{id}/approve` and `PATCH /admin/projects/{id}/reject`
- Admin projects table: shows ApprovalBadge column, Approve/Reject buttons, RejectModal with reason textarea
- Trader project list: shows ApprovalBadge + admin_message per project; shows "سيُرسل للمراجعة" banner
- ProjectFilterBar: added `can_select_approval_status` prop for admin filtering

### OTP email verification
- Register flow: after success → shows OTP screen (6-digit input + resend) instead of redirecting
- `useRegister` now accepts `onRegisterSuccess?: (email: string) => void` callback
- New hooks: `useSendOtp`, `useVerifyOtp`, `useForgotPassword`
- New BFF routes: `/api/v1/auth/send-otp`, `/api/v1/auth/verify-otp`, `/api/v1/auth/forgot-password`
- New page: `app/(public)/auth/forgot-password/page.tsx`
- Login page now shows forgot password link

## Roles

- `admin` → `/dashboard/admin/...`
- `trader` → `/dashboard/trader/...`
- `visitor` → public site

## Stack

- Next.js 14 App Router, React Query (TanStack), react-hook-form + zod, Tailwind, Framer Motion
- Auth via httpOnly cookie `auth_token`
- Laravel backend at `NEXT_PUBLIC_API_URL`
