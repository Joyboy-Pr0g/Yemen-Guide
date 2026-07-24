'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Trash2, Upload, Loader2, Edit2 } from 'lucide-react'
import { useAdminAds, useCreateAd, useUpdateAd, useDeleteAd } from '@/hooks/use-admin'
import { Pagination } from '@/components/ui/pagination'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { getImageUrl } from '@/lib/utils'
import type { Ad, AdPosition, PaginatedMeta } from '@/types'
import AdsSkeleton from '@/components/skeleton/ads/AdsSkeleton'

const POSITIONS: { value: AdPosition; label: string }[] = [
  { value: 'home_page', label: 'الصفحة الرئيسية' },
  { value: 'under_search', label: 'تحت البحث' },
  { value: 'sidebar', label: 'الشريط الجانبي' },
  { value: 'footer', label: 'الفوتر' },
]

const emptyForm = { title: '', link_url: '', position: 'home_page' as AdPosition, grid_cols: '2', end_date: '', is_active: true }

export default function AdsContent({ initialData }: { initialData: { ads: Ad[], meta: PaginatedMeta } }) {
  const [page, setPage] = useState(1)
  const { data, isFetching } = useAdminAds(page, initialData)
  const { mutate: createAd, isPending: creating } = useCreateAd()
  const { mutate: updateAd, isPending: updatingAd } = useUpdateAd()
  const { mutate: deleteAd } = useDeleteAd()
  const [showForm, setShowForm] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Ad | null>(null)

  const handleImageChange = (file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => { setImageFile(file); setImagePreview(e.target?.result as string) }
    reader.readAsDataURL(file)
  }

  const openCreate = () => {
    setEditingAd(null)
    setForm(emptyForm)
    setImageFile(null)
    setImagePreview(null)
    setShowForm(true)
  }

  const openEdit = (ad: Ad) => {
    setEditingAd(ad)
    setForm({ title: ad.title, link_url: ad.link_url || '', position: ad.position, grid_cols: String(ad.grid_cols), end_date: ad.end_date, is_active: ad.is_active })
    setImageFile(null)
    setImagePreview(null)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!editingAd && !imageFile) return
    if (!form.title || !form.end_date) return
    const fd = new FormData()
    fd.append('title', form.title)
    if (imageFile) fd.append('image', imageFile)
    fd.append('position', form.position)
    fd.append('grid_cols', form.grid_cols)
    fd.append('end_date', form.end_date)
    if (form.link_url) fd.append('link_url', form.link_url)
    fd.append('is_active', form.is_active ? '1' : '0')

    if (editingAd) {
      updateAd({ id: editingAd.id, data: fd }, { onSuccess: () => { setShowForm(false); setEditingAd(null) } })
    } else {
      createAd(fd, { onSuccess: () => { setShowForm(false); setImageFile(null); setImagePreview(null) } })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">الإعلانات</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          إعلان جديد
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-5 shadow-card mb-6 space-y-4">
          <h2 className="font-semibold text-gray-800">{editingAd ? 'تعديل الإعلان' : 'إضافة إعلان'}</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">صورة الإعلان {!editingAd && '*'}</label>
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors overflow-hidden relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                ) : editingAd ? (
                  <Image src={getImageUrl(editingAd.image)} alt="" fill className="object-cover" />
                ) : (
                  <div className="text-center"><Upload className="w-6 h-6 text-gray-300 mx-auto mb-1" /><p className="text-xs text-gray-400">≤5MB</p></div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e.target.files?.[0] || null)} />
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">عنوان الإعلان *</label>
                <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className={inputCls} placeholder="عنوان الإعلان" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">رابط الإعلان</label>
                <input value={form.link_url} onChange={(e) => setForm((p) => ({ ...p, link_url: e.target.value }))} className={inputCls} placeholder="https://..." dir="ltr" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">الموضع</label>
              <select value={form.position} onChange={(e) => setForm((p) => ({ ...p, position: e.target.value as AdPosition }))} className={inputCls}>
                {POSITIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">الحجم (1=ربع, 2=نصف, 3=ثلاثة أرباع, 4=كامل)</label>
              <select value={form.grid_cols} onChange={(e) => setForm((p) => ({ ...p, grid_cols: e.target.value }))} className={inputCls}>
                <option value="1">1 - ربع العرض</option>
                <option value="2">2 - نصف العرض</option>
                <option value="3">3 - ثلاثة أرباع</option>
                <option value="4">4 - العرض الكامل</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">تاريخ الانتهاء *</label>
              <input type="date" value={form.end_date} onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))} className={inputCls} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} className="rounded" />
            <label htmlFor="is_active" className="text-sm text-gray-700">نشط</label>
          </div>

          <div className="flex gap-2">
            <button onClick={handleSave} disabled={creating || updatingAd} className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-70">
              {(creating || updatingAd) && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingAd ? 'حفظ التعديلات' : 'إضافة الإعلان'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingAd(null) }} className="px-5 py-2.5 rounded-xl text-sm border border-gray-200 text-gray-600">إلغاء</button>
          </div>
        </div>
      )}

      {isFetching ? (
        <AdsSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.ads.map((ad) => (
            <div key={ad.id} className="bg-white rounded-xl overflow-hidden shadow-card group relative">
              <div className="relative h-32">
                <Image src={getImageUrl(ad.image)} alt={ad.title} fill className="object-cover" />
                <span className={`absolute top-2 end-2 text-xs px-2 py-0.5 rounded-full font-medium ${ad.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {ad.is_active ? 'نشط' : 'غير نشط'}
                </span>
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm text-gray-800 truncate">{ad.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{POSITIONS.find((p) => p.value === ad.position)?.label}</p>
                <p className="text-xs text-gray-400">ينتهي: {new Date(ad.end_date).toLocaleDateString('ar-SY')}</p>
              </div>
              <div className="absolute top-2 start-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(ad)}
                  className="p-1.5 bg-white text-blue-600 rounded-lg shadow-sm hover:bg-blue-50"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(ad)}
                  className="p-1.5 bg-red-500 text-white rounded-lg shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {data && <Pagination currentPage={data.meta.current_page} totalPages={data.meta.last_page} onPageChange={setPage} />}

      <ConfirmModal
        open={!!deleteTarget}
        title="حذف الإعلان"
        message={`هل تريد حذف إعلان "${deleteTarget?.title}"؟`}
        confirmLabel="حذف"
        onConfirm={() => { if (deleteTarget) deleteAd(deleteTarget.id, { onSettled: () => setDeleteTarget(null) }) }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary'
