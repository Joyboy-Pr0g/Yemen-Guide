'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ExternalLink, Flag, Inbox, RotateCcw, Search, SlidersHorizontal } from 'lucide-react'
import { useAdminReports } from '@/hooks/use-admin'
import { useDebounce } from '@/hooks/use-debounce'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { getImageUrl, getReportTypeLabel, getStatusColor, getStatusLabel } from '@/lib/utils'
import type { PaginatedMeta, ProjectReport, ReportFilters } from '@/types'
import { toast } from 'react-hot-toast'

interface ReportsContentProps {
    initialData: { reports: ProjectReport[]; meta: PaginatedMeta }
}

const REPORT_TYPE_OPTIONS = [
    { value: '', label: 'كل الأنواع' },
    { value: 'sensitive_content', label: 'محتوى حساس' },
    { value: 'inappropriate_image', label: 'صورة غير مناسبة' },
    { value: 'wrong_content', label: 'محتوى خاطئ' },
    { value: 'different_entity', label: 'يتبع لجهة أو كيان مختلف' },
] as const

const STATUS_OPTIONS = [
    { value: '', label: 'كل الحالات' },
    { value: 'pending', label: 'قيد المراجعة' },
    { value: 'reviewed', label: 'تمت المراجعة' },
    { value: 'dismissed', label: 'مغلق' },
] as const

export default function ReportsContent({ initialData }: ReportsContentProps) {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState<ReportFilters>({ status: '', report_type: '' })
    const debouncedSearch = useDebounce(search, 300)

    const { data, isFetching } = useAdminReports(page, debouncedSearch, filters, initialData)

    useEffect(() => {
        setPage(1)
    }, [debouncedSearch, filters])

    const resetFilters = () => {
        setFilters({ status: '', report_type: '' })
        setPage(1)
    }

    const isEmpty = !isFetching && data?.reports.length === 0
    const hasFilters = debouncedSearch.trim().length > 0 || Boolean(filters.status) || Boolean(filters.report_type)

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 border border-red-100">
                        <Flag className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">تبليغات المشاريع</h1>
                        <p className="text-sm text-gray-400 mt-0.5">مراجعة البلاغات المقدّمة من الزوار والتجار</p>
                    </div>
                </div>
                {data && (
                    <span className="text-sm font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
                        {data.meta.total} تبليغ
                    </span>
                )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 w-full sm:max-w-[600px]">
                    <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="البحث باسم المشروع أو نص التبليغ..."
                        className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-2.5 text-sm outline-none focus:border-primary bg-white"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 border w-full sm:w-auto border-gray-200 rounded-xl px-4 py-2 hover:border-primary hover:text-primary transition-colors"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        {showFilters ? 'إغلاق الفلاتر' : 'الفلاتر'}
                    </button>
                    {showFilters && (
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2 hover:border-primary hover:text-primary transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            إعادة الفلاتر
                        </button>
                    )}
                </div>
            </div>

            {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">حالة التبليغ</label>
                        <select
                            value={filters.status ?? ''}
                            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary bg-gray-50"
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">نوع التبليغ</label>
                        <select
                            value={filters.report_type ?? ''}
                            onChange={(e) => setFilters((prev) => ({ ...prev, report_type: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary bg-gray-50"
                        >
                            {REPORT_TYPE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <div className="xl:hidden space-y-4">
                {isFetching ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
                            <Skeleton className="h-5 w-2/3" />
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    ))
                ) : isEmpty ? (
                    <EmptyState hasFilters={hasFilters} />
                ) : (
                    data?.reports.map((report) => <ReportCard key={report.id} report={report} />)
                )}
            </div>

            <div className="hidden xl:block bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-50 bg-gray-50/50">
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">المشروع</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">المُبلّغ</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">نوع التبليغ</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">التفاصيل</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">الحالة</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">التاريخ</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isFetching ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="border-b border-gray-50">
                                        <td className="px-4 py-3"><div className="flex gap-3"><Skeleton className="w-10 h-10 rounded-lg" /><Skeleton className="h-4 w-32 my-auto" /></div></td>
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-8 w-24 rounded-lg" /></td>
                                    </tr>
                                ))
                            ) : isEmpty ? (
                                <tr>
                                    <td colSpan={7}>
                                        <EmptyState hasFilters={hasFilters} />
                                    </td>
                                </tr>
                            ) : (
                                data?.reports.map((report) => (
                                    <tr key={report.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 relative shrink-0">
                                                    {report.project?.image && (
                                                        <Image
                                                            src={getImageUrl(report.project.image)}
                                                            alt={report.project.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{report.project?.name || '—'}</p>
                                                    {report.project?.city && (
                                                        <p className="text-xs text-gray-400">{report.project.city.name}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-700">{report.user?.name || '—'}</p>
                                            <p className="text-xs text-gray-400">{report.user?.email}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-50 text-red-700">
                                                {getReportTypeLabel(report.report_type)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p 
                                            onClick={() => toast.success(report.report)}
                                            className="text-gray-600 max-w-[260px] truncate cursor-pointer" title={report.report}>
                                                {report.report}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(report.status || 'pending')}`}>
                                                {getStatusLabel(report.status || 'pending')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                            {new Date(report.created_at).toLocaleDateString('ar-SY')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {report.project && (
                                                    <>
                                                        <Link
                                                            href={`/dashboard/admin/projects/${report.project.id}`}
                                                            className="text-xs font-medium text-primary hover:underline"
                                                        >
                                                            عرض المشروع
                                                        </Link>
                                                        <a
                                                            href={`/projects/${report.project.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-gray-400 hover:text-primary"
                                                            title="فتح الصفحة العامة"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {data && data.meta.last_page > 1 && (
                <Pagination
                    currentPage={data.meta.current_page}
                    totalPages={data.meta.last_page}
                    onPageChange={setPage}
                />
            )}
        </motion.div>
    )
}

function ReportCard({ report }: { report: ProjectReport }) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 relative shrink-0">
                        {report.project?.image && (
                            <Image
                                src={getImageUrl(report.project.image)}
                                alt={report.project.name}
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{report.project?.name || 'مشروع غير معروف'}</h3>
                        <p className="text-xs text-gray-400">بواسطة: {report.user?.name}</p>
                    </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${getStatusColor(report.status || 'pending')}`}>
                    {getStatusLabel(report.status || 'pending')}
                </span>
            </div>

            <div className="mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-50 text-red-700">
                    {getReportTypeLabel(report.report_type)}
                </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{report.report}</p>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-400">
                    {new Date(report.created_at).toLocaleDateString('ar-SY')}
                </span>
                {report.project && (
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/dashboard/admin/projects/${report.project.id}`}
                            className="text-xs font-semibold text-primary hover:underline"
                        >
                            عرض المشروع
                        </Link>
                        <a
                            href={`/${report.project.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-500 hover:text-primary flex items-center gap-1"
                        >
                            <ExternalLink className="w-3 h-3" />
                            الصفحة العامة
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
    return (
        <div className="text-center py-20 text-gray-400">
            <Inbox className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            {hasFilters ? (
                <>
                    <p className="text-lg font-medium text-gray-500">لا توجد نتائج</p>
                    <p className="text-sm mt-1">جرّب تغيير معايير البحث أو الفلاتر</p>
                </>
            ) : (
                <>
                    <p className="text-lg font-medium text-gray-500">لا توجد تبليغات</p>
                    <p className="text-sm mt-1">لم يُبلّغ عن أي مشروع بعد</p>
                </>
            )}
        </div>
    )
}
