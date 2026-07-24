'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Trash2, ShieldOff, CheckCircle, Smartphone, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ModalVariant = 'danger' | 'warning' | 'success' | 'app'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ModalVariant
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    btnClass: 'bg-red-600 hover:bg-red-700 text-white',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    btnClass: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    btnClass: 'bg-primary hover:bg-primary/90 text-white',
  },
  app: {
    icon: Smartphone,
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    btnClass: 'bg-accent hover:bg-accent/90 text-white',
  },
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onCancel()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onCancel])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="bg-white rounded-2xl shadow-modal w-full max-w-sm p-6"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', config.iconBg)}>
                <Icon className={cn('w-5 h-5', config.iconColor)} />
              </div>
              <div className="flex-1 pt-0.5">
                <h3 className="font-bold text-gray-900 text-base mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
              </div>
              <button
                onClick={onCancel}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={onConfirm}
                disabled={loading}
                className={cn(
                  'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60',
                  config.btnClass
                )}
              >
                {loading ? '...' : confirmLabel}
              </button>
              <button
                onClick={onCancel}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                {cancelLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
