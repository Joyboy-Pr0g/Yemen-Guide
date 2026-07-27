'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCurrentUser, useUpdateProfile, useUpdatePassword } from '@/hooks/use-auth'
import { Skeleton } from '@/components/ui/skeleton'
import { DeleteAccountSection, DeleteAccountSectionPending } from '@/components/account/delete-account-section'

const profileSchema = z.object({
    name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
})

const passwordSchema = z.object({
    current_password: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
    password: z.string().min(8, 'كلمة المرور 8 أحرف على الأقل'),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'تأكيد كلمة المرور غير متطابق',
    path: ['password_confirmation'],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

const ROLE_LABELS: Record<string, string> = {
    trader: 'تاجر',
    admin: 'مشرف',
    visitor: 'زائر',
}

export default function ProfileContent() {
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { data: user, isLoading } = useCurrentUser()
    const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile()
    const { mutate: updatePassword, isPending: isUpdatingPassword } = useUpdatePassword()

    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: '' },
    })

    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            current_password: '',
            password: '',
            password_confirmation: '',
        },
    })

    useEffect(() => {
        if (user) {
            profileForm.reset({ name: user.name })
            if (user.has_google) setActiveTab('profile')
        }
    }, [user, profileForm])

    const onProfileSubmit = (data: ProfileFormData) => {
        updateProfile(data)
    }

    const onPasswordSubmit = (data: PasswordFormData) => {
        updatePassword(data, {
            onSuccess: () => passwordForm.reset(),
        })
    }

    const tabs = [
        { id: 'profile' as const, label: 'الملف الشخصي', icon: User },
        ...(!user?.has_google
            ? [{ id: 'password' as const, label: 'كلمة المرور', icon: Lock }]
            : []),
    ]

    if (isLoading) {
        return (
            <div className="flex flex-col items-center space-y-6 w-full max-w-xl mx-auto">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center space-y-6 w-full max-w-xl mx-auto">
            <div className="text-center">
                <h1 className="text-xl font-bold text-gray-900">الملف الشخصي</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                    {user?.has_google ? 'إدارة بيانات حسابك' : 'إدارة بيانات حسابك وكلمة المرور'}
                </p>
            </div>

            {user?.has_google && (
                <div className="w-full rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-center">
                    <p className="text-sm font-semibold text-blue-800">حساب Google</p>
                    <p className="text-xs text-blue-700 mt-1">
                        تم تسجيل الدخول عبر Google، لذلك لا يمكن تغيير كلمة المرور من هنا.
                    </p>
                </div>
            )}

            {tabs.length > 1 && (
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl ">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setActiveTab(id)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex-1 sm:flex-none justify-center',
                            activeTab === id
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-gray-600 hover:text-gray-900',
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </div>
            )}

            {activeTab === 'profile' || user?.has_google ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 w-full">
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم</label>
                            <input
                                {...profileForm.register('name')}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                            {profileForm.formState.errors.name && (
                                <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.name.message}</p>
                            )}
                        </div>

                        <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                            <p className="text-xs text-gray-400 mb-0.5">البريد الإلكتروني</p>
                            <p className="text-sm font-semibold text-gray-800" dir="ltr">{user?.email}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                <p className="text-xs text-gray-400 mb-0.5">الدور</p>
                                <p className="text-sm font-semibold text-gray-800">{ROLE_LABELS[user?.role ?? ''] ?? user?.role}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                <p className="text-xs text-gray-400 mb-0.5">تاريخ التسجيل</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('ar-SY') : '—'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isUpdatingProfile}
                            className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70"
                        >
                            {isUpdatingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                            حفظ التغييرات
                        </button>
                    </form>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 w-full">
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
                        <PasswordField
                            label="كلمة المرور الحالية"
                            show={showCurrentPassword}
                            onToggle={() => setShowCurrentPassword((v) => !v)}
                            error={passwordForm.formState.errors.current_password?.message}
                            registration={passwordForm.register('current_password')}
                        />
                        <PasswordField
                            label="كلمة المرور الجديدة"
                            show={showNewPassword}
                            onToggle={() => setShowNewPassword((v) => !v)}
                            error={passwordForm.formState.errors.password?.message}
                            registration={passwordForm.register('password')}
                        />
                        <PasswordField
                            label="تأكيد كلمة المرور الجديدة"
                            show={showConfirmPassword}
                            onToggle={() => setShowConfirmPassword((v) => !v)}
                            error={passwordForm.formState.errors.password_confirmation?.message}
                            registration={passwordForm.register('password_confirmation')}
                        />

                        <button
                            type="submit"
                            disabled={isUpdatingPassword}
                            className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70"
                        >
                            {isUpdatingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                            تغيير كلمة المرور
                        </button>
                    </form>
                </div>
            )}

            {user?.role !== 'admin' && (
                user?.will_delete_at
                    ? <DeleteAccountSectionPending willDeleteAt={user.will_delete_at} />
                    : <DeleteAccountSection />
            )}
        </div>
    )
}

function PasswordField({
    label,
    show,
    onToggle,
    error,
    registration,
}: {
    label: string
    show: boolean
    onToggle: () => void
    error?: string
    registration: ReturnType<ReturnType<typeof useForm<PasswordFormData>>['register']>
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <div className="relative">
                <input
                    {...registration}
                    type={show ? 'text' : 'password'}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    )
}
