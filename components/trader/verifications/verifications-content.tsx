'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ShieldCheck, Plus, Loader2, Upload, RefreshCw, FileText } from 'lucide-react'
import { useTraderVerifications, useSubmitVerification, useTraderProjects } from '@/hooks/use-trader'
import { Skeleton } from '@/components/ui/skeleton'
import { getStatusLabel, getStatusColor, useDebounce } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { PaginatedMeta, Project, VerificationApplication } from '@/types'
import { useInfiniteTraderProjects } from '@/hooks/use-trader'
import { SearchableSelect } from '@/components/ui/searchable-select'

const schema = z.object({
    project_id: z.string().min(1, 'اختر المشروع'),
    reason_for_verification: z.string().min(20, 'يجب أن يكون الوصف 20 حرفاً على الأقل').max(1000),
})

type FormData = z.infer<typeof schema>

export default function VerificationsContent(
    { initialVerificationData, initialProjectsData }:
        {
            initialVerificationData: { applications: VerificationApplication[]; meta: PaginatedMeta },
            initialProjectsData: { projects: Project[]; meta: PaginatedMeta }
            }
        ) {
    const { data, isLoading } = useTraderVerifications(initialVerificationData)
    const { mutate: submitVerification, isPending } = useSubmitVerification()
    const [showForm, setShowForm] = useState(false)
    const [projectsSearch, setProjectsSearch] = useState('')
    const debouncedProjectsSearch = useDebounce(projectsSearch, 300)
    const [identityFile, setIdentityFile] = useState<File | null>(null)
    const [identityPreview, setIdentityPreview] = useState<string | null>(null)
    const [ownershipFile, setOwnershipFile] = useState<File | null>(null)
    const [ownershipPreview, setOwnershipPreview] = useState<string | null>(null)

    const {
        data: projectsData,
        isFetching: isFetchingProjects,
        hasNextPage, fetchNextPage,
        isFetchingNextPage
    } = useInfiniteTraderProjects(initialProjectsData, { search: debouncedProjectsSearch },{})

    const applications = data?.applications ?? []


    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            project_id: '',
            reason_for_verification: '',
        },
    })

    const selectedProjectId = watch('project_id')

    const openForm = (projectId?: string) => {
        reset()
        setIdentityFile(null)
        setIdentityPreview(null)
        setOwnershipFile(null)
        setOwnershipPreview(null)
        if (projectId) {
            setValue('project_id', projectId, { shouldValidate: true })
        } else {
            setValue('project_id', '')
        }
        setShowForm(true)
    }

    const onSubmit = (data: FormData) => {
        if (!identityFile || !ownershipFile) {
            toast.error('يرجى رفع ملفي الهوية والملكية')
            return
        }
        const formData = new FormData()
        formData.append('project_id', data.project_id)
        formData.append('reason_for_verification', data.reason_for_verification)
        formData.append('identity_file', identityFile)
        formData.append('ownership_file', ownershipFile)
        submitVerification(formData, {
            onSuccess: () => {
                setShowForm(false)
                reset()
                setIdentityFile(null)
                setIdentityPreview(null)
                setOwnershipFile(null)
                setOwnershipPreview(null)
            }
        })
    }

    const handleFileChange = (
        file: File | null,
        setter: (f: File | null) => void,
        previewSetter: (s: string | null) => void
    ) => {
        if (!file) return
        setter(file)
        if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => previewSetter(e.target?.result as string)
            reader.readAsDataURL(file)
        } else {
            previewSetter(null)
        }
    }

    const projectOptions = projectsData?.pages.flatMap((page) => page.projects).map((project) => ({
        value: String(project.id),
        label: project.name,
    })) || []

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-gray-900">طلبات التوثيق</h1>
                <button
                    onClick={() => openForm()}
                    className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    طلب توثيق جديد
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-5 shadow-card mb-6 space-y-4">
                    <h2 className="font-semibold text-gray-800">تقديم طلب توثيق</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">المشروع *</label>
                        <SearchableSelect
                            options={projectOptions}
                            value={selectedProjectId}
                            onChange={(project_id) => setValue('project_id', project_id, { shouldValidate: true, shouldDirty: true })}
                            placeholder="بحث عن مشروع"
                            remoteSearch
                            onSearchChange={setProjectsSearch}
                            hasMore={!!hasNextPage}
                            isLoadingMore={isFetchingNextPage || isFetchingProjects}
                            onLoadMore={() => fetchNextPage()}
                        />
                        {errors.project_id && <p className="text-red-500 text-xs mt-1">{errors.project_id.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">سبب طلب التوثيق *</label>
                        <textarea {...register('reason_for_verification')} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" placeholder="اشرح لماذا تريد توثيق نشاطك التجاري (20 حرف على الأقل)..." />
                        {errors.reason_for_verification && <p className="text-red-500 text-xs mt-1">{errors.reason_for_verification.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FileUploadWithPreview
                            label="ملف الهوية *"
                            accept=".pdf,.jpg,.jpeg,.png"
                            file={identityFile}
                            preview={identityPreview}
                            onChange={(f) => handleFileChange(f, setIdentityFile, setIdentityPreview)}
                        />
                        <FileUploadWithPreview
                            label="ملف الملكية *"
                            accept=".pdf,.jpg,.jpeg,.png"
                            file={ownershipFile}
                            preview={ownershipPreview}
                            onChange={(f) => handleFileChange(f, setOwnershipFile, setOwnershipPreview)}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" disabled={isPending} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-70">
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            تقديم الطلب
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">
                            إلغاء
                        </button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
            ) : applications?.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl">
                    <ShieldCheck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400">لا توجد طلبات توثيق بعد</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {applications?.map((app) => (
                        <div key={app.id} className="bg-white rounded-xl p-4 shadow-card">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 text-sm">{app.project?.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{new Date(app.created_at).toLocaleDateString('ar-SY')}</p>
                                    {app.admin_notes && (
                                        <p className="text-sm text-gray-500 mt-2 pt-2 border-t border-gray-50">
                                            <span className="font-medium text-gray-700">ملاحظات المشرف:</span> {app.admin_notes}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(app.status)}`}>
                                        {getStatusLabel(app.status)}
                                    </span>
                                    {(app.status === 'rejected' || app.status === 're_approve_requested') && (
                                        <button
                                            onClick={() => openForm(String(app.project?.id))}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary px-3 py-1.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                                        >
                                            <RefreshCw className="w-3 h-3" />
                                            إعادة التقديم
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function FileUploadWithPreview({
    label,
    accept,
    onChange,
    file,
    preview,
}: {
    label: string
    accept: string
    onChange: (f: File | null) => void
    file: File | null
    preview: string | null
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <label className="relative flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors overflow-hidden">
                {preview ? (
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                ) : file ? (
                    <div className="flex flex-col items-center gap-1">
                        <FileText className="w-6 h-6 text-primary" />
                        <p className="text-xs text-primary font-medium px-2 text-center truncate max-w-full">{file.name}</p>
                    </div>
                ) : (
                    <>
                        <Upload className="w-5 h-5 text-gray-300 mb-1" />
                        <p className="text-xs text-gray-400">رفع ملف (≤10MB)</p>
                    </>
                )}
                <input type="file" accept={accept} className="hidden" onChange={(e) => onChange(e.target.files?.[0] || null)} />
            </label>
        </div>
    )
}
