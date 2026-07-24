'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, FileText, Loader2, ExternalLink, Download } from 'lucide-react'
import { useReviewAdminVerification } from '@/hooks/use-admin'
import { getStatusLabel, getStatusColor } from '@/lib/utils'
import type { VerificationApplication } from '@/types'

export default function VerificationDetails({ app }: { app: VerificationApplication }) {
    const { mutate: reviewApp, isPending } = useReviewAdminVerification()
    const [application, setApplication] = useState<VerificationApplication>(app)
    const [action, setAction] = useState<'approve' | 'reject' | 're_approve_requested'>('approve')
    const [notes, setNotes] = useState('')
    const [showReview, setShowReview] = useState(false)
    const [previewFile, setPreviewFile] = useState<string | null>(null)

    const handleReview = () => {
        if (!application) return
        reviewApp(
            { id: application.id, action, admin_notes: notes || undefined },
            {
                onSuccess: (data) => {
                    setShowReview(false)
                    setNotes('')
                    setApplication(data.application)
                }
            }
        )
    }
    const isImage = (url: string) => /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(url)
    if (!application) return <div className="text-center py-16 text-gray-400">الطلب غير موجود</div>

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
        >
            {/* Right Column: Application Details (Spans 2 columns if form is open, full width if closed) */}
            <div className={`order-2 lg:order-none space-y-6 transition-all duration-300 ${showReview ? 'lg:col-span-2' : 'lg:col-span-3'}`}>

                {/* Breadcrumbs */}
                <div className="group flex w-fit px-4 py-2 items-center gap-2 text-sm text-gray-400 mb-2 hover:bg-primary/10 rounded-xl transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary group-hover:pl-1 transition-all" />
                    <Link href="/dashboard/admin/verifications" className="hover:text-primary transition-colors">طلبات التوثيق</Link>
                </div>

                {/* Main Details Card */}
                <div className="bg-white rounded-2xl p-5 shadow-card">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 mb-1">{application.project?.name}</h1>
                            <p className="text-sm text-gray-500">بواسطة: {application.user?.name} — {new Date(application.created_at).toLocaleDateString('ar-SY')}</p>
                            <div className="mt-2">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(application.status)}`}>
                                    {getStatusLabel(application.status)}
                                </span>
                            </div>
                        </div>

                        {(application.status === 'pending' || application.status === 're_approve_requested') && !showReview && (
                            <button
                                onClick={() => setShowReview(true)}
                                className="bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shrink-0"
                            >
                                مراجعة الطلب
                            </button>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-50">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">سبب طلب التوثيق:</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{application.reason_for_verification}</p>
                    </div>

                    {application.admin_notes && (
                        <div className="mt-3 pt-3 border-t border-gray-50">
                            <h3 className="text-sm font-semibold text-gray-700 mb-1">ملاحظات المشرف:</h3>
                            <p className="text-sm text-gray-500">{application.admin_notes}</p>
                        </div>
                    )}
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[{ label: 'ملف الهوية', url: application.identity_file }, { label: 'ملف الملكية', url: application.ownership_file }].map(({ label, url }) => (
                        <div key={label} className="bg-white rounded-2xl p-4 shadow-card">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                {label}
                            </h3>
                            {isImage(url) ? (
                                <div
                                    className="relative rounded-xl overflow-hidden bg-gray-100 cursor-pointer border border-gray-100"
                                    style={{ aspectRatio: '4/3' }}
                                    onClick={() => setPreviewFile(url)}
                                >
                                    <Image src={url} alt={label} fill className="object-contain" sizes="300px" />
                                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                                        <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-full">عرض كامل</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-28 bg-gray-50 rounded-xl border border-gray-100">
                                    <FileText className="w-8 h-8 text-gray-300" />
                                </div>
                            )}
                            <div className="flex gap-2 mt-3">
                                <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-primary border border-primary px-3 py-2 rounded-xl hover:bg-accent hover:text-accent-foreground transition-colors">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    فتح
                                </a>
                                <a href={url} download className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                                    <Download className="w-3.5 h-3.5" />
                                    تحميل
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Left Column: Review Action Card Slot */}
            <AnimatePresence>
                {showReview && (
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
                        className="order-1 lg:order-none lg:col-span-1 bg-white rounded-2xl p-5 shadow-card border border-gray-50 sticky top-6"
                    >
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
                            <h2 className="font-bold text-gray-800">اتخاذ قرار بشأن الطلب</h2>
                            <button
                                onClick={() => setShowReview(false)}
                                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                إلغاء ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5">القرار النهائي</label>
                                <select
                                    value={action}
                                    onChange={(e) => setAction(e.target.value as typeof action)}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary bg-gray-50/50"
                                >
                                    <option value="approve">موافقة ✓</option>
                                    <option value="reject">رفض ✗</option>
                                    <option value="re_approve_requested">طلب إعادة تقديم ↩</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5">ملاحظات الإدارة</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={4}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary resize-none placeholder:text-gray-300"
                                    placeholder="اكتب توجيهاتك أو سبب الرفض هنا..."
                                />
                            </div>

                            <div className="flex flex-col gap-2 pt-2">
                                <button
                                    onClick={handleReview}
                                    disabled={isPending}
                                    className="w-full bg-primary text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
                                >
                                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                    تأكيد القرار
                                </button>
                                <button
                                    onClick={() => setShowReview(false)}
                                    className="w-full py-2.5 text-sm text-gray-500 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    تراجع
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image preview overlay modal code remains down here if needed */}
            {previewFile && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewFile(null)}>
                    <div className="relative max-w-3xl max-h-[80vh] w-full" style={{ aspectRatio: '4/3' }}>
                        <Image src={previewFile} alt="" fill className="object-contain" sizes="800px" />
                    </div>
                </div>
            )}
        </motion.div>
    );
}
