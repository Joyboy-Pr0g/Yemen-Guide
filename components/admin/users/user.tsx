'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Shield, ShieldOff, Store, Eye, User } from 'lucide-react'
import { useBlockUser, useUnblockUser } from '@/hooks/use-admin'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { getStatusLabel, getStatusColor } from '@/lib/utils'
import type { Project, User as UserType } from '@/types'

export default function UserDetailPageContent({ user, projects }: { user: UserType, projects: Project[] }) {
    const { mutate: blockUser, isPending: blocking } = useBlockUser()
    const { mutate: unblockUser, isPending: unblocking } = useUnblockUser()
    const [confirmBlock, setConfirmBlock] = useState(false)
    const router = useRouter()


    const handleConfirmBlock = () => {
        if (!user) return
        const fn = user.is_blocked ? unblockUser : blockUser
        fn(user.id, {
            onSettled: () => {
                setConfirmBlock(false)
                router.refresh()
            }
        })
    }

    if (!user) return <div className="text-center py-16 text-gray-400">المستخدم غير موجود</div>

    const roleLabels: Record<string, string> = { admin: 'مشرف', trader: 'تاجر', visitor: 'زائر' }
    const roleColors: Record<string, string> = { admin: 'bg-accent/15 text-accent-dark', trader: 'bg-primary/10 text-primary', visitor: 'bg-gray-100 text-gray-600' }

    return (
        <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <Link href="/dashboard/admin/users" className="hover:text-primary transition-colors">
                    المستخدمون
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-gray-700 font-medium">{user.name}</span>
            </div>

            {/* Main User Card Architecture */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100">
                {/* Top Banner Accent (adds premium touch using primary color subtly) */}
                <div className="h-2 bg-gradient-to-r from-primary/40 to-primary" />

                <div className="p-6 sm:p-8">
                    {/* Header Section: Identity & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            {/* High-fidelity Avatar */}
                            <div className="w-16 h-16 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                                <span className="text-primary font-bold text-2xl">{user.name.charAt(0)}</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 tracking-tight">{user.name}</h1>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium shadow-sm ${roleColors[user.role] || 'bg-gray-100 text-gray-600'}`}>
                                        {roleLabels[user.role] || user.role}
                                    </span>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium shadow-sm ${user.is_blocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                        {user.is_blocked ? 'محظور' : 'نشط'}
                                    </span>
                                    {user.has_google && (
                                        <span className="text-xs px-2.5 py-1 rounded-full font-medium shadow-sm bg-blue-100 text-blue-700">
                                            Google
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons Container */}
                        {user.role !== 'admin' && (
                            <div className="shrink-0">
                                <button
                                    onClick={() => setConfirmBlock(true)}
                                    className={`w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm ${user.is_blocked
                                            ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 active:scale-[0.98]'
                                            : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 active:scale-[0.98]'
                                        }`}
                                >
                                    {user.is_blocked ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                    {user.is_blocked ? 'رفع الحظر' : 'حظر المستخدم'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Structured Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-gray-400 block">البريد الإلكتروني</span>
                            <div className="text-sm font-medium text-gray-800 bg-gray-50/50 p-3 rounded-xl border border-gray-100 break-all" dir="ltr">
                                {user.email}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs font-medium text-gray-400 block">تاريخ الانضمام</span>
                            <div className="text-sm font-medium text-gray-800 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                {new Date(user.created_at).toLocaleDateString('ar-SY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Section (for traders) */}
            {user.role === 'trader' && (
                <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                        <h2 className="font-bold text-gray-800 text-base flex items-center gap-2.5">
                            <Store className="w-5 h-5 text-primary" />
                            مشاريع التاجر
                        </h2>
                        <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-md font-bold">
                            {projects?.length || 0} مشاريع
                        </span>
                    </div>

                    {projects && projects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {projects.map((p) => (
                                <div key={p.id} className="flex items-center justify-between p-3.5 bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors group">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">{p.name}</p>
                                        <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(p.status)}`}>
                                            {getStatusLabel(p.status)}
                                        </span>
                                    </div>
                                    <Link
                                        href={`/projects/${p.slug}`}
                                        target="_blank"
                                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-6">لا توجد مشاريع مسجلة لهذا التاجر حالياً.</p>
                    )}
                </div>
            )}

            {/* Modal Window */}
            <ConfirmModal
                open={confirmBlock}
                title={user.is_blocked ? 'رفع الحظر' : 'حظر المستخدم'}
                message={`هل تريد ${user.is_blocked ? 'رفع الحظر عن' : 'حظر'} ${user.name}؟`}
                confirmLabel={user.is_blocked ? 'رفع الحظر' : 'حظر'}
                variant={user.is_blocked ? 'warning' : 'danger'}
                loading={blocking || unblocking}
                onConfirm={handleConfirmBlock}
                onCancel={() => setConfirmBlock(false)}
            />
        </div>
    )
}
