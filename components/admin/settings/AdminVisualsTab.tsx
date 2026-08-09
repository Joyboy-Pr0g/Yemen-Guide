'use client'

import { useState } from 'react'
import { Plus, Trash2, Upload, Loader2, Edit2, Video } from 'lucide-react'
import { useAdminVisuals, useCreateVisual, useUpdateVisual, useDeleteVisual } from '@/hooks/use-admin'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import type { Visual, VisualKey } from '@/types'
import toast from 'react-hot-toast'

const MAX_VIDEO_BYTES = 120 * 1024 * 1024

const VISUAL_KEYS: { value: VisualKey; label: string; description: string }[] = [
  {
    value: 'trader_create_project',
    label: 'إنشاء مشروع',
    description: 'يظهر للتاجر في صفحة المشاريع',
  },
  {
    value: 'trader_verification',
    label: 'طلب التوثيق',
    description: 'يظهر للتاجر في صفحة طلبات التوثيق',
  },
]

const KEY_LABELS = Object.fromEntries(VISUAL_KEYS.map((k) => [k.value, k.label])) as Record<VisualKey, string>

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary bg-gray-50/30 focus:bg-white'

export default function AdminVisualsTab() {
  const { data: visuals = [], isFetching } = useAdminVisuals()
  const { mutate: createVisual, isPending: creating } = useCreateVisual()
  const { mutate: updateVisual, isPending: updating } = useUpdateVisual()
  const { mutate: deleteVisual } = useDeleteVisual()

  const [showForm, setShowForm] = useState(false)
  const [editingVisual, setEditingVisual] = useState<Visual | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [form, setForm] = useState({ key: '' as VisualKey | '', name: '' })
  const [deleteTarget, setDeleteTarget] = useState<Visual | null>(null)

  const usedKeys = new Set(visuals.map((v) => v.key))
  const availableKeys = VISUAL_KEYS.filter((k) => !usedKeys.has(k.value) || editingVisual?.key === k.value)

  const openCreate = () => {
    setEditingVisual(null)
    setForm({ key: availableKeys[0]?.value ?? '', name: '' })
    setVideoFile(null)
    setShowForm(true)
  }

  const openEdit = (visual: Visual) => {
    setEditingVisual(visual)
    setForm({ key: visual.key, name: visual.name })
    setVideoFile(null)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.key || !form.name) return
    if (!editingVisual && !videoFile) return
    if (videoFile && videoFile.size > MAX_VIDEO_BYTES) {
      toast.error('حجم الفيديو يجب ألا يتجاوز 120 ميجابايت')
      return
    }

    const fd = new FormData()
    fd.append('key', form.key)
    fd.append('name', form.name)
    if (videoFile) fd.append('video', videoFile)

    if (editingVisual) {
      updateVisual({ id: editingVisual.id, data: fd }, {
        onSuccess: () => {
          setShowForm(false)
          setEditingVisual(null)
        },
      })
    } else {
      createVisual(fd, {
        onSuccess: () => {
          setShowForm(false)
          setVideoFile(null)
        },
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-sm text-gray-800">فيديوهات إرشادية</h2>
          <p className="text-xs text-gray-400 mt-0.5">رفع فيديوهات تعليمية للتجار (إنشاء مشروع وطلب التوثيق).</p>
        </div>
        {availableKeys.length > 0 && (
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            إضافة فيديو
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm">{editingVisual ? 'تعديل الفيديو' : 'إضافة فيديو جديد'}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">الموقع *</label>
              <select
                value={form.key}
                disabled={!!editingVisual}
                onChange={(e) => setForm((p) => ({ ...p, key: e.target.value as VisualKey }))}
                className={inputCls}
              >
                {availableKeys.map((k) => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
              {form.key && (
                <p className="text-[11px] text-gray-400 mt-1">
                  {VISUAL_KEYS.find((k) => k.value === form.key)?.description}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">اسم الفيديو *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className={inputCls}
                placeholder="مثال: كيفية إنشاء مشروع"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              ملف الفيديو {!editingVisual && '*'}
            </label>
            <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors bg-white">
              {videoFile ? (
                <div className="text-center px-4">
                  <Video className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-primary font-medium truncate max-w-full">{videoFile.name}</p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                  <p className="text-xs text-gray-400">mp4, webm, mov — حتى 120MB</p>
                </div>
              )}
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  if (file && file.size > MAX_VIDEO_BYTES) {
                    toast.error('حجم الفيديو يجب ألا يتجاوز 120 ميجابايت')
                    e.target.value = ''
                    return
                  }
                  setVideoFile(file)
                }}
              />
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={creating || updating}
              onClick={handleSave}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-70"
            >
              {(creating || updating) && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingVisual ? 'حفظ التعديلات' : 'إضافة'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingVisual(null) }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {isFetching ? (
        <div className="text-sm text-gray-400 py-8 text-center">جاري التحميل...</div>
      ) : visuals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <Video className="w-10 h-10 text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">لا توجد فيديوهات بعد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visuals.map((visual) => (
            <div key={visual.id} className="flex items-center justify-between gap-4 bg-gray-50/80 rounded-xl p-4 border border-gray-100">
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{visual.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{KEY_LABELS[visual.key]}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(visual)}
                  className="p-2 rounded-lg hover:bg-white text-gray-500 border border-transparent hover:border-gray-200"
                  title="تعديل"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(visual)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="حذف الفيديو"
        message={`هل تريد حذف "${deleteTarget?.name}"؟`}
        confirmLabel="حذف"
        variant="danger"
        onConfirm={() => {
          if (deleteTarget) {
            deleteVisual(deleteTarget.id, { onSettled: () => setDeleteTarget(null) })
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
