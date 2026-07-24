'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Loader2 } from 'lucide-react'

export function RejectModal({ open, onConfirm, onCancel, loading }: { open: boolean; onConfirm: (reason: string) => void; onCancel: () => void; loading: boolean }) {
    const [reason, setReason] = useState('')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!open) setReason('')
    }, [open])

    useEffect(() => {
        if (!open) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel()
        }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [open, onCancel])

    if (!open || !mounted) return null

    return createPortal(
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
                <h2 className="text-lg font-bold text-gray-900">رفض المشروع</h2>
                <p className="text-sm text-gray-500">يمكنك إضافة سبب الرفض ليتمكن التاجر من مراجعته (اختياري)</p>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder="سبب الرفض..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                />
                <div className="flex gap-3 pt-1">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                    >
                        إلغاء
                    </button>
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => onConfirm(reason)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        رفض المشروع
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    )
}
