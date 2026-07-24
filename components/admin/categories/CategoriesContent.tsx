'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, Loader2, Check, X } from 'lucide-react'
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, useCreateSubCategory, useUpdateSubCategory, useDeleteSubCategory } from '@/hooks/use-admin'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { FaIcon } from '@/components/ui/fa-icon'
import { IconPicker } from '@/components/admin/icon-picker'
import type { Category, SubCategory } from '@/types'

export default function CategoriesContent({ initialCategories }: { initialCategories: Category[] }) {
    const { data: categories, isLoading } = useAdminCategories(initialCategories)
    const { mutate: createCat, isPending: creating } = useCreateCategory()
    const { mutate: updateCat, isPending: updating } = useUpdateCategory()
    const { mutate: deleteCat, isPending: deleting } = useDeleteCategory()
    const { mutate: createSub } = useCreateSubCategory()
    const { mutate: updateSub } = useUpdateSubCategory()
    const { mutate: deleteSub } = useDeleteSubCategory()

    const [expandedCat, setExpandedCat] = useState<number | null>(null)
    const [editingCat, setEditingCat] = useState<Category | null>(null)
    const [showCatForm, setShowCatForm] = useState(false)
    const [catName, setCatName] = useState('')
    const [catSlug, setCatSlug] = useState('')
    const [catIcon, setCatIcon] = useState('')
    const [subName, setSubName] = useState<Record<number, string>>({})
    const [subSlug, setSubSlug] = useState<Record<number, string>>({})
    const [editingSub, setEditingSub] = useState<SubCategory | null>(null)
    const [editSubName, setEditSubName] = useState('')
    const [editSubSlug, setEditSubSlug] = useState('')
    const [confirmDelete, setConfirmDelete] = useState<{ type: 'cat' | 'sub'; id: number; name: string } | null>(null)

    const handleCreateCat = () => {
        if (!catName.trim() || !catSlug.trim()) return
        createCat({ name: catName, slug: catSlug, icon: catIcon }, {
            onSuccess: () => { setCatName(''); setCatSlug(''); setCatIcon(''); setShowCatForm(false) }
        })
    }

    const handleUpdateCat = () => {
        if (!editingCat) return
        updateCat({ id: editingCat.id, name: catName || editingCat.name, slug: catSlug || editingCat.slug, icon: catIcon || editingCat.icon || '' }, {
            onSuccess: () => { setEditingCat(null); setShowCatForm(false) }
        })
    }

    const handleAddSub = (catId: number) => {
        const name = subName[catId]?.trim()
        const slug = subSlug[catId]?.trim()
        if (!name || !slug) return
        createSub({ category_id: catId, name, slug }, {
            onSuccess: () => { setSubName((p) => ({ ...p, [catId]: '' })); setSubSlug((p) => ({ ...p, [catId]: '' })) }
        })
    }

    const handleUpdateSub = () => {
        if (!editingSub || !editSubName.trim() || !editSubSlug.trim()) return
        updateSub({ id: editingSub.id, name: editSubName, slug: editSubSlug }, {
            onSuccess: () => setEditingSub(null)
        })
    }

    const handleConfirmDelete = () => {
        if (!confirmDelete) return
        if (confirmDelete.type === 'cat') deleteCat(confirmDelete.id, { onSettled: () => setConfirmDelete(null) })
        else deleteSub(confirmDelete.id, { onSettled: () => setConfirmDelete(null) })
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-gray-900">التصنيفات</h1>
                <button
                    onClick={() => { setShowCatForm(true); setCatName(''); setCatSlug(''); setCatIcon(''); setEditingCat(null) }}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90"
                >
                    <Plus className="w-4 h-4" />
                    تصنيف جديد
                </button>
            </div>

            {showCatForm && (
                <div className="bg-white rounded-2xl p-5 shadow-card mb-5 space-y-3">
                    <h2 className="font-semibold text-gray-800">{editingCat ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}</h2>
                    <div className="grid grid-cols-3 gap-3">
                        <input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="الاسم *" className={inputCls} />
                        <input value={catSlug} onChange={(e) => setCatSlug(e.target.value)} placeholder="slug *" className={inputCls} dir="ltr" />
                        <IconPicker value={catIcon} onChange={setCatIcon} className="w-full" />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={editingCat ? handleUpdateCat : handleCreateCat}
                            disabled={creating || updating}
                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 disabled:opacity-70"
                        >
                            {(creating || updating) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            {editingCat ? 'حفظ التعديلات' : 'إضافة'}
                        </button>
                        <button onClick={() => { setShowCatForm(false); setEditingCat(null) }} className="px-4 py-2 rounded-lg text-sm border border-gray-200 text-gray-600">إلغاء</button>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
            ) : (
                <div className="space-y-3">
                    {categories?.map((cat) => (
                        <div key={cat.id} className="bg-white rounded-xl shadow-card overflow-hidden">
                            <div
                                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50/50"
                                onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                            >
                                {cat.icon && (
                                    <div className="w-8 h-8 bg-primary/8 rounded-lg flex items-center justify-center shrink-0">
                                        <FaIcon icon={cat.icon} className="w-4 h-4 text-primary" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{cat.name}</p>
                                    <p className="text-xs text-gray-400" dir="ltr">{cat.slug} — {cat.sub_categories?.length || 0} فئة فرعية</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setEditingCat(cat); setCatName(cat.name); setCatSlug(cat.slug); setCatIcon(cat.icon || ''); setShowCatForm(true) }}
                                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setConfirmDelete({ type: 'cat', id: cat.id, name: cat.name }) }}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    {expandedCat === cat.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                </div>
                            </div>

                            {expandedCat === cat.id && (
                                <div className="border-t border-slate-100 bg-slate-50/30 p-5 space-y-4">
                                    {/* Subcategories Container */}
                                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5">
                                        {cat.sub_categories?.map((sub) => (
                                            <div key={sub.id} className="transition-all duration-200">
                                                {editingSub?.id === sub.id ? (
                                                    /* Enhanced Inline Editing Form Mode */
                                                    <div className="flex flex-wrap items-center gap-2 bg-white border border-primary/30 shadow-sm p-2 rounded-xl">
                                                        <input
                                                            value={editSubName}
                                                            onChange={(e) => setEditSubName(e.target.value)}
                                                            className={`${inputCls} !py-1.5 text-sm`}
                                                            placeholder="الاسم"
                                                        />
                                                        <input
                                                            value={editSubSlug}
                                                            onChange={(e) => setEditSubSlug(e.target.value)}
                                                            className={`${inputCls} !py-1.5 max-w-[100px] text-sm`}
                                                            dir="ltr"
                                                            placeholder="slug"
                                                        />
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={handleUpdateSub}
                                                                className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                                                                title="حفظ"
                                                            >
                                                                <Check className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingSub(null)}
                                                                className="p-2 border border-slate-200 text-slate-500 bg-white rounded-lg hover:bg-slate-50 transition-colors"
                                                                title="إلغاء"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* Enhanced Subcategory Badge Row */
                                                    <div className="flex items-center justify-between gap-4 py-1.5 px-3 bg-white border border-slate-100 shadow-sm rounded-xl group hover:border-slate-200 hover:shadow transition-all duration-150">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-slate-700">{sub.name}</span>
                                                            <span className="text-[11px] font-mono bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded" dir="ltr">
                                                                /{sub.slug}
                                                            </span>
                                                        </div>

                                                        {/* Subtle Actions Group */}
                                                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                                            <button
                                                                onClick={() => { setEditingSub(sub); setEditSubName(sub.name); setEditSubSlug(sub.slug) }}
                                                                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirmDelete({ type: 'sub', id: sub.id, name: sub.name })}
                                                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Enhanced "Add New Subcategory" Block */}
                                    <div className="pt-3 border-t border-dashed border-slate-200">
                                        <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl">
                                            <input
                                                value={subName[cat.id] || ''}
                                                onChange={(e) => setSubName((p) => ({ ...p, [cat.id]: e.target.value }))}
                                                placeholder="اسم الفئة الفرعية الجديدة..."
                                                className={`${inputCls} !border-transparent bg-slate-50 focus:bg-white text-sm`}
                                            />
                                            <input
                                                value={subSlug[cat.id] || ''}
                                                onChange={(e) => setSubSlug((p) => ({ ...p, [cat.id]: e.target.value }))}
                                                placeholder="slug *"
                                                className={`${inputCls} !border-transparent bg-slate-50 focus:bg-white max-w-full sm:max-w-[120px] text-sm`}
                                                dir="ltr"
                                            />
                                            <button
                                                onClick={() => handleAddSub(cat.id)}
                                                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/10 shrink-0"
                                            >
                                                إضافة الفئة
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <ConfirmModal
                open={!!confirmDelete}
                title={confirmDelete?.type === 'cat' ? 'حذف التصنيف' : 'حذف الفئة الفرعية'}
                message={`هل أنت متأكد من حذف "${confirmDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
                confirmLabel="حذف"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete(null)}
                loading={deleting}
            />
        </div>
    )
}

const inputCls = 'flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary'
