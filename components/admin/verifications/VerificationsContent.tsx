'use client'

import { useState } from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink, Loader2 } from 'lucide-react'
import { useAdminVerifications, useReviewAdminVerification } from '@/hooks/use-admin'
import VerificationsSkeleton from '@/components/skeleton/verification/VerificationsSkeleton'
import { Pagination } from '@/components/ui/pagination'
import { getStatusLabel, getStatusColor } from '@/lib/utils'
import type { VerificationApplication, PaginatedMeta } from '@/types'

export default function VerificationContent({ initialData }: { initialData: { applications: VerificationApplication[], meta: PaginatedMeta } }) {
    const router = useRouter()
    const [page, setPage] = useState(1)
    const { data, isLoading } = useAdminVerifications(initialData, page)
    const { mutate: reviewApp, isPending } = useReviewAdminVerification()
    const [reviewingId, setReviewingId] = useState<number | null>(null)
    const [notes, setNotes] = useState('')
    const [action, setAction] = useState<'approve' | 'reject' | 're_approve_requested'>('approve')

    const handleReview = (app: VerificationApplication) => {
        reviewApp(
            { id: app.id, action, admin_notes: notes || undefined },
            { onSettled: () => { setReviewingId(null); setNotes(''); router.refresh() } }
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="mt-4 sm:mt-0 text-xl sm:text-2xl font-bold text-gray-900 mb-6">طلبات التوثيق</h1>

            {isLoading ? (
                <VerificationsSkeleton />
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {data?.applications.map((app) => (
                            <div
                                key={app.id}
                                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                            >
                                <div>
                                    {/* Header: Project Name & Status */}
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-base text-slate-900 tracking-tight">
                                                {app.project?.name || "مشروع بدون اسم"}
                                            </h3>
                                            <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                                <span>بواسطة: {app.user?.name}</span>
                                                <span className="text-slate-300">•</span>
                                                <span>{new Date(app.created_at).toLocaleDateString('ar-SY')}</span>
                                            </p>
                                        </div>
                                        <span className={`text-xs px-2.5 py-1 rounded-lg font-medium shrink-0 shadow-sm ${getStatusColor(app.status)}`}>
                                            {getStatusLabel(app.status)}
                                        </span>
                                    </div>

                                    {/* View Details Link */}
                                    <Link
                                        href={`/dashboard/admin/verifications/${app.id}`}
                                        className="inline-flex items-center text-xs font-medium text-primary hover:underline gap-1 mb-4"
                                    >
                                        عرض التفاصيل الكاملة ←
                                    </Link>

                                    {/* Verification Reason Statement */}
                                    <div className="bg-slate-50/70 rounded-xl p-3.5 mb-4 border border-slate-100">
                                        <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">سبب طلب التوثيق:</span>
                                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                                            {app.reason_for_verification}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Actions / Interactive Elements */}
                                <div className="border-t border-slate-100 flex items-center justify-between gap-4">
                                    {/* Attached Files Links */}
                                    <div className="flex items-center gap-3">
                                        <a
                                            href={app.identity_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-medium text-slate-500 hover:text-primary flex items-center gap-1 bg-slate-100 hover:bg-primary/5 px-2.5 py-1.5 rounded-lg transition-colors"
                                        >
                                            <ExternalLink className="w-3 h-3 text-slate-400" />
                                            ملف الهوية
                                        </a>
                                        <a
                                            href={app.ownership_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-medium text-slate-500 hover:text-primary flex items-center gap-1 bg-slate-100 hover:bg-primary/5 px-2.5 py-1.5 rounded-lg transition-colors"
                                        >
                                            <ExternalLink className="w-3 h-3 text-slate-400" />
                                            ملف الملكية
                                        </a>
                                    </div>

                                    {/* Admin Actions Panel */}
                                    <div>
                                        {app.status === 'pending' || app.status === 're_approve_requested' ? (
                                            reviewingId === app.id ? (
                                                <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200 shadow-xl z-10 flex flex-col gap-2 m-1">
                                                    <label className="text-xs font-semibold text-slate-500">اتخاذ إجراء بشأن الطلب</label>
                                                    <select
                                                        value={action}
                                                        onChange={(e) => setAction(e.target.value as typeof action)}
                                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 outline-none focus:border-primary focus:bg-white transition-all font-medium text-slate-700"
                                                    >
                                                        <option value="approve">🟢 موافقة على الطلب</option>
                                                        <option value="reject">🔴 رفض الطلب</option>
                                                        <option value="re_approve_requested">🟡 طلب إعادة تقديم</option>
                                                    </select>
                                                    <textarea
                                                        value={notes}
                                                        onChange={(e) => setNotes(e.target.value)}
                                                        placeholder="اكتب ملاحظات الإدارة هنا (اختياري)..."
                                                        rows={2}
                                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary resize-none placeholder:text-slate-400 text-slate-600"
                                                    />
                                                    <div className="flex gap-2 mt-1">
                                                        <button
                                                            onClick={() => handleReview(app)}
                                                            disabled={isPending}
                                                            className="flex-1 bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-70 flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                                                        >
                                                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                                            تأكيد القرار
                                                        </button>
                                                        <button
                                                            onClick={() => setReviewingId(null)}
                                                            className="px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                                        >
                                                            إلغاء
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setReviewingId(app.id)}
                                                    className="text-xs font-semibold text-primary bg-primary/5 border border-primary/20 px-4 py-2 rounded-xl hover:bg-accent hover:text-accent-foreground hover:border-primary transition-all shadow-sm shrink-0"
                                                >
                                                    مراجعة الطلب
                                                </button>
                                            )

                                        ) : null}
                                    </div>
                                </div>
                                {app.admin_notes && (
                                    <div className="mt-4 text-right max-w-[400px]">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase">ملاحظة المسؤول:</span>
                                        <p className="text-xs text-slate-500 truncate" title={app.admin_notes}>{app.admin_notes}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {data && <Pagination currentPage={data.meta.current_page} totalPages={data.meta.last_page} onPageChange={setPage} />}
        </motion.div>
    )
}
