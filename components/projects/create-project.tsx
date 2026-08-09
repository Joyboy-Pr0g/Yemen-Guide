'use client'

import React, { useEffect, useState } from 'react'
import type { Category, City, User, Project } from '@/types'
import { X, Store, Upload, ImageIcon, Trash2, Pencil } from 'lucide-react'
import type { PaginatedMeta } from '@/types'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { useDebounce } from '@/hooks/use-debounce'
import { useInfiniteUsers } from '@/hooks/use-admin'
import { getImageUrl } from '@/lib/utils'
import { formatYemenPhoneInput, normalizeYemenPhone } from '@/lib/yemen-phone'

const MAX_FEATURED_IMAGES = 4

export interface ProjectModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (data: FormData) => void
    loading: boolean
    errors?: Record<string, string[]>
    categories: Category[]
    cities: City[]
    traders?: { users: User[], meta: PaginatedMeta } | null
    isAdmin: boolean
    mode?: 'create' | 'edit'
    project?: Project
}

interface FormFields {
    name: string
    description: string
    address_details: string
    latitude: number | null
    longitude: number | null
    phone_number: string
    whatsapp_number: string | null
    category_id: number
    sub_category_id: number
    city_id: number
    neighborhood_id: number
    user_id: number
}

const emptyForm = (): FormFields => ({
    name: '',
    description: '',
    address_details: '',
    latitude: null,
    longitude: null,
    phone_number: '',
    whatsapp_number: null,
    category_id: 0,
    sub_category_id: 0,
    city_id: 0,
    neighborhood_id: 0,
    user_id: 0,
})

export function ProjectFormModal({
    open,
    onClose,
    onSubmit,
    loading,
    errors = {},
    categories = [],
    cities = [],
    traders,
    isAdmin = false,
    mode = 'create',
    project,
}: ProjectModalProps) {
    const isEdit = mode === 'edit'
    const [formData, setFormData] = useState<FormFields>(emptyForm)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [featuredImages, setFeaturedImages] = useState<{ file: File; preview: string }[]>([])
    const [imageError, setImageError] = useState('')
    const [phoneError, setPhoneError] = useState('')
    const [tradersSearch, setTradersSearch] = useState('')
    const debouncedTradersSearch = useDebounce(tradersSearch, 300)
    const {
        data: tradersData,
        isFetchingNextPage,
        isFetching: isFetchingTraders,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteUsers(traders ?? { users: [], meta: { current_page: 1, last_page: 1, total: 0, hasMorePages: false } }, debouncedTradersSearch)
    const traderOptions = (tradersData?.pages.flatMap((page) => page.users) ?? []).map((trader) => ({
        value: trader.id,
        label: trader.name,
    }))

    const activeSubCategories = categories.find(c => c.id === formData.category_id)?.sub_categories || []
    const activeNeighborhoods = cities.find(c => c.id === formData.city_id)?.neighborhoods || []

    useEffect(() => {
        if (!open) return

        if (isEdit && project) {
            setFormData({
                name: project.name,
                description: project.description,
                address_details: project.address_details,
                latitude: project.latitude,
                longitude: project.longitude,
                phone_number: project.phone_number,
                whatsapp_number: project.whatsapp_number,
                category_id: project.sub_category?.category_id ?? 0,
                sub_category_id: project.sub_category?.id ?? 0,
                city_id: project.city?.id ?? 0,
                neighborhood_id: project.neighborhood?.id ?? 0,
                user_id: 0,
            })
            setImagePreview(getImageUrl(project.image))
            setLogoPreview(project.logo ? getImageUrl(project.logo) : null)
        } else {
            setFormData(emptyForm())
            setImagePreview(null)
            setLogoPreview(null)
        }

        setImageFile(null)
        setLogoFile(null)
        setFeaturedImages([])
        setImageError('')
        setPhoneError('')
    }, [open, isEdit, project])

    const resetForm = () => {
        setFormData(emptyForm())
        setImageFile(null)
        setImagePreview(null)
        setLogoFile(null)
        setLogoPreview(null)
        setFeaturedImages([])
        setImageError('')
        setPhoneError('')
    }

    const handleLogoChange = (file: File | null) => {
        if (!file) return
        setLogoFile(file)
        const reader = new FileReader()
        reader.onload = (e) => setLogoPreview(e.target?.result as string)
        reader.readAsDataURL(file)
    }

    const handleMainImageChange = (file: File | null) => {
        if (!file) return
        setImageFile(file)
        setImageError('')
        const reader = new FileReader()
        reader.onload = (e) => setImagePreview(e.target?.result as string)
        reader.readAsDataURL(file)
    }

    const handleFeaturedImagesChange = (files: FileList | null) => {
        if (!files?.length) return

        const remaining = MAX_FEATURED_IMAGES - featuredImages.length
        const selected = Array.from(files).slice(0, remaining)

        selected.forEach((file) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                setFeaturedImages((prev) => {
                    if (prev.length >= MAX_FEATURED_IMAGES) return prev
                    return [...prev, { file, preview: e.target?.result as string }]
                })
            }
            reader.readAsDataURL(file)
        })
    }

    const removeFeaturedImage = (index: number) => {
        setFeaturedImages((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!isEdit && !imageFile) {
            setImageError('الصورة الرئيسية مطلوبة.')
            return
        }

        const phone = normalizeYemenPhone(formData.phone_number)
        if (!phone) {
            setPhoneError('رقم الهاتف يجب أن يكون رقماً يمنياً صالحاً (مثال: 770 838 513).')
            return
        }

        let whatsapp: string | null = null
        if (formData.whatsapp_number?.trim()) {
            whatsapp = normalizeYemenPhone(formData.whatsapp_number)
            if (!whatsapp) {
                setPhoneError('رقم الواتساب يجب أن يكون رقماً يمنياً صالحاً (مثال: 770 838 513).')
                return
            }
        }

        setPhoneError('')

        const payload = new FormData()
        if (isAdmin) payload.append('user_id', String(formData.user_id))
        payload.append('name', formData.name)
        payload.append('description', formData.description)
        payload.append('address_details', formData.address_details)
        payload.append('sub_category_id', String(formData.sub_category_id))
        payload.append('city_id', String(formData.city_id))
        payload.append('neighborhood_id', String(formData.neighborhood_id))
        payload.append('phone_number', phone)
        if (whatsapp) payload.append('whatsapp_number', whatsapp)
        if (formData.latitude !== null) payload.append('latitude', String(formData.latitude))
        if (formData.longitude !== null) payload.append('longitude', String(formData.longitude))
        if (imageFile) payload.append('image', imageFile)
        if (!isAdmin && logoFile) payload.append('logo', logoFile)
        featuredImages.forEach(({ file }) => payload.append('featured_images[]', file))

        onSubmit(payload)
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" dir="rtl">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                <div className="h-2 bg-gradient-to-r from-primary/40 to-primary shrink-0" />

                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            {isEdit ? <Pencil className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">
                                {isEdit ? 'تعديل المشروع' : 'إنشاء مشروع جديد'}
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {isEdit ? 'قم بتحديث تفاصيل وموقع النشاط التجاري' : 'أدخل تفاصيل وموقع النشاط التجاري لتسجيله بالنظام'}
                            </p>
                        </div>
                    </div>
                    <button type="button" onClick={() => { onClose(); resetForm() }} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-primary tracking-wider border-b border-gray-50 pb-1.5 uppercase">البيانات الأساسية</h3>
                        {isAdmin && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 block">التاجر</label>
                            <SearchableSelect
                                options={traderOptions}
                                value={String(formData.user_id)}
                                onChange={(user_id) => setFormData({ ...formData, user_id: Number(user_id) })}
                                placeholder="كل التجار"
                                remoteSearch
                                onSearchChange={setTradersSearch}
                                hasMore={!!hasNextPage}
                                isLoadingMore={isFetchingNextPage || isFetchingTraders}
                                onLoadMore={() => fetchNextPage()}
                            />
                            {errors.user_id && <p className="text-xs text-red-600 font-medium mt-1 pr-1">{errors.user_id[0]}</p>}
                        </div>
                        )}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 block">إسم المشروع/النشاط</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 pointer-events-none"><Store className="w-4 h-4" /></span>
                                <input
                                    type="text" required value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full text-sm bg-gray-50/50 text-gray-800 pr-10 pl-4 py-2.5 rounded-xl border transition-all outline-none ${errors.name ? 'border-red-400' : 'border-gray-200 focus:border-primary'}`}
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-600 font-medium mt-1 pr-1">{errors.name[0]}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 block">وصف تفصيلي عن النشاط</label>
                            <textarea
                                required rows={3} value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className={`w-full text-sm bg-gray-50/50 text-gray-800 px-4 py-2.5 rounded-xl border transition-all outline-none resize-none ${errors.description ? 'border-red-400' : 'border-gray-200 focus:border-primary'}`}
                            />
                            {errors.description && <p className="text-xs text-red-600 font-medium mt-1 pr-1">{errors.description[0]}</p>}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-primary tracking-wider border-b border-gray-50 pb-1.5 uppercase">الصور</h3>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 block">
                                الصورة الرئيسية {isEdit ? '(اختياري)' : '*'}
                            </label>
                            <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors overflow-hidden">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-4">
                                        <Upload className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                                        <p className="text-xs text-gray-400">اختر الصورة الرئيسية (≤5MB)</p>
                                    </div>
                                )}
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleMainImageChange(e.target.files?.[0] || null)} />
                            </label>
                            {(imageError || errors.image) && (
                                <p className="text-xs text-red-600 font-medium mt-1 pr-1">{imageError || errors.image?.[0]}</p>
                            )}
                        </div>

                        {!isAdmin && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 block">شعار المشروع (اختياري)</label>
                                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-200 rounded-full cursor-pointer hover:border-primary transition-colors overflow-hidden mx-auto">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center p-3">
                                            <Upload className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                                            <p className="text-[10px] text-gray-400">≤2MB</p>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoChange(e.target.files?.[0] || null)} />
                                </label>
                                {errors.logo && (
                                    <p className="text-xs text-red-600 font-medium mt-1 pr-1 text-center">{errors.logo[0]}</p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-gray-500 block">الصور المميزة (حتى {MAX_FEATURED_IMAGES})</label>
                                <span className="text-[11px] text-gray-400">{featuredImages.length}/{MAX_FEATURED_IMAGES}</span>
                            </div>

                            {featuredImages.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {featuredImages.map((item, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100">
                                            <img src={item.preview} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeFeaturedImage(index)}
                                                className="absolute top-1 left-1 p-1 bg-black/50 text-white rounded-md hover:bg-black/70"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {featuredImages.length < MAX_FEATURED_IMAGES && (
                                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-4 cursor-pointer hover:border-primary transition-colors">
                                    <ImageIcon className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs text-gray-500">إضافة صور مميزة</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => handleFeaturedImagesChange(e.target.files)}
                                    />
                                </label>
                            )}
                            {errors['featured_images.0'] && (
                                <p className="text-xs text-red-600 font-medium mt-1 pr-1">{errors['featured_images.0'][0]}</p>
                            )}
                            {errors.featured_images && (
                                <p className="text-xs text-red-600 font-medium mt-1 pr-1">{errors.featured_images[0]}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-primary tracking-wider border-b border-gray-50 pb-1.5 uppercase">التصنيف والنوع</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 block">التصنيف الرئيسي</label>
                                <select
                                    required
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value), sub_category_id: 0 })}
                                    className="w-full text-sm bg-gray-50/50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-primary"
                                >
                                    <option value={0}>اختر التصنيف الرئيسي...</option>
                                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 block">التصنيف الفرعي</label>
                                <select
                                    required
                                    disabled={formData.category_id === 0}
                                    value={formData.sub_category_id}
                                    onChange={(e) => setFormData({ ...formData, sub_category_id: Number(e.target.value) })}
                                    className="w-full text-sm bg-gray-50/50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-primary disabled:opacity-60"
                                >
                                    <option value={0}>اختر التصنيف الفرعي...</option>
                                    {activeSubCategories.map((sub) => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                                </select>
                                {errors.sub_category_id && <p className="text-xs text-red-600 font-medium mt-1 pr-1">{errors.sub_category_id[0]}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-primary tracking-wider border-b border-gray-50 pb-1.5 uppercase">معلومات الاتصال بالعملاء</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 block">رقم الهاتف الأساسي</label>
                                <input
                                    type="tel" required placeholder="770 838 513" dir="ltr" value={formData.phone_number}
                                    onChange={(e) => {
                                        setPhoneError('')
                                        setFormData({ ...formData, phone_number: formatYemenPhoneInput(e.target.value) })
                                    }}
                                    className="w-full text-sm bg-gray-50/50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-200 text-right outline-none focus:border-primary"
                                />
                                {(phoneError || errors.phone_number) && (
                                    <p className="text-xs text-red-600 font-medium mt-1 pr-1">
                                        {phoneError || errors.phone_number?.[0]}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 block">رقم الواتساب (اختياري)</label>
                                <input
                                    type="tel" placeholder="770 838 513" dir="ltr" value={formData.whatsapp_number || ''}
                                    onChange={(e) => {
                                        setPhoneError('')
                                        setFormData({
                                            ...formData,
                                            whatsapp_number: e.target.value
                                                ? formatYemenPhoneInput(e.target.value)
                                                : null,
                                        })
                                    }}
                                    className="w-full text-sm bg-gray-50/50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-200 text-right outline-none focus:border-primary"
                                />
                                {errors.whatsapp_number && (
                                    <p className="text-xs text-red-600 font-medium mt-1 pr-1">{errors.whatsapp_number[0]}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-primary tracking-wider border-b border-gray-50 pb-1.5 uppercase">الموقع الجغرافي والعنوان</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 block">المدينة</label>
                                <select
                                    required
                                    value={formData.city_id}
                                    onChange={(e) => setFormData({ ...formData, city_id: Number(e.target.value), neighborhood_id: 0 })}
                                    className="w-full text-sm bg-gray-50/50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-primary"
                                >
                                    <option value={0}>اختر المدينة...</option>
                                    {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 block">المنطقة / الحي</label>
                                <select
                                    required
                                    disabled={formData.city_id === 0}
                                    value={formData.neighborhood_id}
                                    onChange={(e) => setFormData({ ...formData, neighborhood_id: Number(e.target.value) })}
                                    className="w-full text-sm bg-gray-50/50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-primary disabled:opacity-60"
                                >
                                    <option value={0}>اختر الحي...</option>
                                    {activeNeighborhoods.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 block">تفاصيل العنوان الشارع / علامات مميزة</label>
                            <input
                                type="text" required value={formData.address_details}
                                onChange={(e) => setFormData({ ...formData, address_details: e.target.value })}
                                className="w-full text-sm bg-gray-50/50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-primary"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-400 block">خط العرض (Latitude)</label>
                                <input
                                    type="number" step="any" placeholder="15.369" dir="ltr" value={formData.latitude ?? ''}
                                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value ? Number(e.target.value) : null })}
                                    className="w-full text-xs bg-white text-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-400 block">خط الطول (Longitude)</label>
                                <input
                                    type="number" step="any" placeholder="44.191" dir="ltr" value={formData.longitude ?? ''}
                                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value ? Number(e.target.value) : null })}
                                    className="w-full text-xs bg-white text-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </form>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
                    <button
                        type="button" onClick={() => { onClose(); resetForm() }} disabled={loading}
                        className="px-4 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
                    >
                        إلغاء
                    </button>
                    <button
                        type="submit" onClick={handleSubmit} disabled={loading}
                        className="px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 disabled:bg-primary/50 shadow-sm rounded-xl transition-all flex items-center gap-2"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : isEdit ? (
                            <Pencil className="w-4 h-4" />
                        ) : (
                            <Upload className="w-4 h-4" />
                        )}
                        {isEdit ? 'حفظ التعديلات' : 'حفظ وإنشاء المشروع'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export function CreateProjectModal(props: Omit<ProjectModalProps, 'mode'>) {
    return <ProjectFormModal {...props} mode="create" />
}
