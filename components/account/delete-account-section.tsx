'use client'

import { useState } from 'react'
import { UserX } from 'lucide-react'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { useRequestAccountDeletion } from '@/hooks/use-request-account-deletion'

const DELETE_MESSAGE =
  'سيتم تعطيل حسابك لمدة 20 يوماً. إذا سجّلت الدخول مجدداً خلال هذه المدة فسيتم إلغاء الحذف واستعادة حسابك. بعد انتهاء الـ 20 يوماً بدون تسجيل دخول، يُحذف الحساب نهائياً ولا يمكن استرجاعه.'

export function DeleteAccountSection() {
  const [open, setOpen] = useState(false)
  const { mutate: requestDeletion, isPending } = useRequestAccountDeletion()

  const handleConfirm = () => {
    requestDeletion(undefined, {
      onSettled: () => setOpen(false),
    })
  }

  return (
    <>
      <div className="w-full rounded-2xl border border-red-100 bg-red-50/50 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <UserX className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-gray-900">حذف الحساب</h2>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              يمكنك طلب حذف حسابك. ستُمنح مهلة 20 يوماً لاستعادته بتسجيل الدخول قبل الحذف النهائي.
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-red-200 text-red-700 bg-white hover:bg-red-50 transition-colors"
            >
              طلب حذف الحساب
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={open}
        title="تأكيد حذف الحساب"
        message={DELETE_MESSAGE}
        confirmLabel="تأكيد الحذف"
        cancelLabel="إلغاء"
        variant="danger"
        loading={isPending}
        onConfirm={handleConfirm}
        onCancel={() => !isPending && setOpen(false)}
      />
    </>
  )
}

export function DeleteAccountSectionPending({ willDeleteAt }: { willDeleteAt: string }) {
  const date = new Date(willDeleteAt).toLocaleDateString('ar-SY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="w-full rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center">
      <p className="text-sm font-semibold text-amber-900">حذف الحساب مجدول</p>
      <p className="text-xs text-amber-800 mt-1">
        سيتم حذف حسابك نهائياً في {date} ما لم تسجّل الدخول قبل ذلك لاستعادته.
      </p>
    </div>
  )
}
