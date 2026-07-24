'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, ShieldOff, Search, User, Plus, UserPlus, Mail, EyeOff, Eye, X, ShieldCheck, Loader2, Pencil } from 'lucide-react'
import { useAdminUsers, useBlockUser, useUnblockUser, useCreateUser, useUpdateUser } from '@/hooks/use-admin'
import { useDebounce } from '@/hooks/use-debounce'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination } from '@/components/ui/pagination'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import type { User as UserType, PaginatedMeta, Role } from '@/types'

const roleLabels: Record<string, string> = { admin: 'مشرف', trader: 'تاجر', visitor: 'زائر' }
const roleColors: Record<string, string> = { admin: 'bg-accent/15 text-accent-dark', trader: 'bg-primary/10 text-primary', visitor: 'bg-gray-100 text-gray-600' }
const avatarColors: Record<string, string> = { admin: 'bg-accent/15 text-accent', trader: 'bg-primary/10 text-primary', visitor: 'bg-gray-100 text-gray-600' }

type UserFormPayload = {
    name: string
    email: string
    role: string
    password?: string
    password_confirmation?: string
}

type UserFormState =
    | { open: false; mode: 'create' | 'edit'; user?: undefined }
    | { open: true; mode: 'create'; user?: undefined }
    | { open: true; mode: 'edit'; user: UserType }

export function UsersPageContent({ initialData }: { initialData: { users: UserType[], meta: PaginatedMeta } }) {
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [userForm, setUserForm] = useState<UserFormState>({ open: false, mode: 'create' })
    const { mutate: createUser, isPending: creating } = useCreateUser()
    const { mutate: updateUser, isPending: updating } = useUpdateUser()
    const debouncedSearch = useDebounce(search, 300)
    const { data, isFetching } = useAdminUsers(page, debouncedSearch.trim(), roleFilter, initialData)
    const { mutate: blockUser, isPending: blocking } = useBlockUser()
    const { mutate: unblockUser, isPending: unblocking } = useUnblockUser()
    const [confirmUser, setConfirmUser] = useState<UserType | null>(null)
    const [actingId, setActingId] = useState<number | null>(null)

    const handleBlock = (user: UserType) => {
        setConfirmUser(user)
    }

    const handleConfirm = () => {
        if (!confirmUser) return
        setActingId(confirmUser.id)
        const fn = confirmUser.is_blocked ? unblockUser : blockUser
        fn(confirmUser.id, {
            onSettled: () => {
                setActingId(null); setConfirmUser(null);
                router.refresh()
            }
        })
    }

    const handleCreateUser = (data: UserFormPayload) => {
        createUser(
            {
                name: data.name,
                email: data.email,
                role: data.role,
                password: data.password!,
                password_confirmation: data.password_confirmation!,
            },
            {
                onSettled: () => {
                    setUserForm({ open: false, mode: 'create' })
                    router.refresh()
                },
            },
        )
    }

    const handleUpdateUser = (data: UserFormPayload) => {
        if (userForm.mode !== 'edit' || !userForm.user) return

        updateUser(
            { id: userForm.user.id, ...data },
            {
                onSettled: () => {
                    setUserForm({ open: false, mode: 'create' })
                    router.refresh()
                },
            },
        )
    }

    const openCreateForm = () => setUserForm({ open: true, mode: 'create' })
    const openEditForm = (user: UserType) => setUserForm({ open: true, mode: 'edit', user })
    const closeUserForm = () => setUserForm({ open: false, mode: 'create' })

    useEffect(() => {
        setPage(1)
    }, [debouncedSearch, roleFilter])

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="mt-4 sm:mt-0 text-xl sm:text-2xl font-bold text-gray-900">المستخدمون</h1>
                {data && <p className="text-sm text-gray-400">{data.meta.total} مستخدم</p>}
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="البحث بالاسم أو البريد..."
                        className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-2.5 text-sm outline-none focus:border-primary"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary bg-white"
                >
                    <option value="">كل الأدوار</option>
                    <option value="trader">تاجر</option>
                    <option value="visitor">زائر</option>
                    <option value="admin">مشرف</option>
                </select>
                <button
                    disabled={creating}
                    className='flex items-center gap-2 bg-primary text-white px-4 py-2.5 
                    rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors'
                    onClick={openCreateForm}                >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    إضافة مستخدم
                </button>
            </div>

            <div className="xl:hidden space-y-3">
                {isFetching
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-card p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-11 h-11 rounded-full shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-44" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-14 rounded-full" />
                                <Skeleton className="h-6 w-14 rounded-full" />
                            </div>
                            <div className="flex gap-2 pt-1">
                                <Skeleton className="h-9 flex-1 rounded-xl" />
                                <Skeleton className="h-9 flex-1 rounded-xl" />
                            </div>
                        </div>
                    ))
                    :
                    <div className="space-y-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {data?.users.map((user) => (
                            <article
                                key={user.id}
                                className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100/80"
                            >
                                <div className="h-1 bg-gradient-to-l from-primary/30 via-primary/10 to-transparent" />

                                <div className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${avatarColors[user.role] || 'bg-gray-100 text-gray-600'}`}>
                                            {user.name.charAt(0)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h2 className="text-base font-bold text-gray-900 truncate">{user.name}</h2>
                                                <span className={`shrink-0 text-[11px] px-2 py-0.5 rounded-full font-medium ${roleColors[user.role] || 'bg-gray-100 text-gray-600'}`}>
                                                    {roleLabels[user.role] || user.role}
                                                </span>
                                            </div>
                                            <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 truncate" dir="ltr">
                                                <Mail className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                                                <span className="truncate">{user.email}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-3">
                                        <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium ${user.is_blocked ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                                            {user.is_blocked ? <ShieldOff className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                                            {user.is_blocked ? 'محظور' : 'نشط'}
                                        </span>
                                        {user.has_google && (
                                            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium bg-blue-50 text-blue-700">
                                                Google
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                                        <button
                                            type="button"
                                            onClick={() => openEditForm(user)}
                                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl bg-primary/8 text-primary hover:bg-primary/15 transition-colors"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                            تعديل
                                        </button>
                                        <Link                                            href={`/dashboard/admin/users/${user.id}`}
                                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            <User className="w-3.5 h-3.5" />
                                            تفاصيل
                                        </Link>
                                        {user.role !== 'admin' && (
                                            <button
                                                type="button"
                                                onClick={() => handleBlock(user)}
                                                disabled={actingId === user.id}
                                                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors disabled:opacity-50 ${user.is_blocked ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                            >
                                                {actingId === user.id ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : user.is_blocked ? (
                                                    <ShieldOff className="w-3.5 h-3.5" />
                                                ) : (
                                                    <Shield className="w-3.5 h-3.5" />
                                                )}
                                                {user.is_blocked ? 'رفع الحظر' : 'حظر'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>}

                {!isFetching && data?.users.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-card p-10 text-center">
                        <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-600">لا يوجد مستخدمون</p>
                        <p className="text-xs text-gray-400 mt-1">جرّب تغيير البحث أو الفلتر</p>
                    </div>
                )}
            </div>

            <div className="hidden xl:block bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-50 bg-gray-50/50">
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">الاسم</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">البريد</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">الدور</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">الحالة</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">الدخول</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isFetching
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="border-b border-gray-50">
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-8 w-24 rounded-lg" /></td>
                                    </tr>
                                ))
                                : data?.users.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                                        <td className="px-4 py-3 text-gray-500" dir="ltr">{user.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user.role] || 'bg-gray-100 text-gray-600'}`}>
                                                {roleLabels[user.role] || user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.is_blocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                                {user.is_blocked ? 'محظور' : 'نشط'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.has_google ? (
                                                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                                                    Google
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400">بريد</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditForm(user)}
                                                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-primary/8 text-primary hover:bg-primary/15 transition-colors"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                    تعديل
                                                </button>
                                                <Link                                                    href={`/dashboard/admin/users/${user.id}`}
                                                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                                                >
                                                    <User className="w-3.5 h-3.5" />
                                                    تفاصيل
                                                </Link>
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleBlock(user)}
                                                        disabled={actingId === user.id}
                                                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${user.is_blocked ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                                    >
                                                        {user.is_blocked ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                                                        {user.is_blocked ? 'رفع الحظر' : 'حظر'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {data && <Pagination currentPage={data.meta.current_page} totalPages={data.meta.last_page} onPageChange={setPage} />}

            <ConfirmModal
                open={!!confirmUser}
                title={confirmUser?.is_blocked ? 'رفع الحظر' : 'حظر المستخدم'}
                message={`هل تريد ${confirmUser?.is_blocked ? 'رفع الحظر عن' : 'حظر'} ${confirmUser?.name}؟`}
                confirmLabel={confirmUser?.is_blocked ? 'رفع الحظر' : 'حظر'}
                variant={confirmUser?.is_blocked ? 'warning' : 'danger'}
                loading={blocking || unblocking}
                onConfirm={handleConfirm}
                onCancel={() => setConfirmUser(null)}
            />

            <UserFormModal
                open={userForm.open}
                mode={userForm.mode}
                user={userForm.mode === 'edit' ? userForm.user : undefined}
                onClose={closeUserForm}
                onSubmit={userForm.mode === 'edit' ? handleUpdateUser : handleCreateUser}
                loading={creating || updating}
            />        </div>
    )
}

function UserFormModal({
    open,
    mode,
    user,
    onClose,
    onSubmit,
    loading,
}: {
    open: boolean
    mode: 'create' | 'edit'
    user?: UserType
    onClose: () => void
    onSubmit: (data: UserFormPayload) => void
    loading: boolean
}) {
    const isEdit = mode === 'edit'
    const isGoogleUser = isEdit && !!user?.has_google
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'visitor' as Role,
        password: '',
        password_confirmation: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formError, setFormError] = useState('')

    useEffect(() => {
        if (!open) return

        if (isEdit && user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                password: '',
                password_confirmation: '',
            })
        } else {
            setFormData({
                name: '',
                email: '',
                role: 'visitor',
                password: '',
                password_confirmation: '',
            })
        }

        setFormError('')
        setShowPassword(false)
        setShowConfirmPassword(false)
    }, [open, isEdit, user])

    if (!open) return null

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormError('')

        if (!isEdit && !formData.password) {
            setFormError('كلمة المرور مطلوبة.')
            return
        }

        if (!isGoogleUser && formData.password && formData.password.length < 8) {
            setFormError('كلمة المرور يجب أن تكون 8 أحرف على الأقل.')
            return
        }

        if (!isGoogleUser && formData.password !== formData.password_confirmation) {
            setFormError('تأكيد كلمة المرور غير متطابق.')
            return
        }

        const payload: UserFormPayload = {
            name: formData.name,
            email: formData.email,
            role: formData.role,
        }

        if (!isGoogleUser && formData.password) {
            payload.password = formData.password
            payload.password_confirmation = formData.password_confirmation
        }

        onSubmit(payload)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" dir="rtl">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                <div className="h-2 bg-gradient-to-r from-primary/40 to-primary" />

                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            {isEdit ? <Pencil className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">
                                {isEdit ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {isEdit ? 'قم بتحديث بيانات الحساب' : 'قم بملء البيانات لإنشاء حساب جديد بالنظام'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 block">الاسم الكامل</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 pointer-events-none">
                                <User className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                required
                                placeholder="جون دو"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full text-sm bg-gray-50/50 text-gray-800 pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 block">البريد الإلكتروني</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 pointer-events-none">
                                <Mail className="w-4 h-4" />
                            </span>
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                dir="ltr"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full text-sm bg-gray-50/50 text-gray-800 pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none text-right"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 block">صلاحية الحساب (الدور)</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 pointer-events-none">
                                <ShieldCheck className="w-4 h-4" />
                            </span>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                                disabled={isEdit && user?.role === 'admin'}
                                className="w-full text-sm bg-gray-50/50 text-gray-800 pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <option value="visitor">زائر (Visitor)</option>
                                <option value="trader">تاجر (Trader)</option>
                                <option value="admin">مشرف (Admin)</option>
                            </select>
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none text-xs">
                                🔽
                            </span>
                        </div>
                        {isEdit && user?.role === 'admin' && (
                            <p className="text-[11px] text-gray-400">لا يمكن تغيير دور المشرف.</p>
                        )}
                    </div>

                    {isGoogleUser ? (
                        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                            <p className="text-sm font-semibold text-blue-800">حساب Google</p>
                            <p className="text-xs text-blue-700 mt-1">
                                لا يمكن تعيين أو تعديل كلمة المرور لهذا المستخدم لأنه يسجّل الدخول عبر Google.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 block">
                                    {isEdit ? 'كلمة المرور الجديدة (اختياري)' : 'كلمة المرور'}
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required={!isEdit}
                                        placeholder="••••••••"
                                        dir="ltr"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full text-sm bg-gray-50/50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none text-right"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 block">تأكيد كلمة المرور</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 hover:text-primary transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required={!isEdit || !!formData.password}
                                        placeholder="••••••••"
                                        dir="ltr"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                        className="w-full text-sm bg-gray-50/50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none text-right"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {formError && (
                        <p className="text-xs text-red-600 font-medium">{formError}</p>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 disabled:bg-primary/50 shadow-sm rounded-xl transition-all active:scale-[0.98] flex items-center gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : isEdit ? (
                                <Pencil className="w-4 h-4" />
                            ) : (
                                <UserPlus className="w-4 h-4" />
                            )}
                            {isEdit ? 'حفظ التعديلات' : 'إنشاء الحساب'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}