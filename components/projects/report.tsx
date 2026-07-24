'use client'

import { useState } from 'react'
import { AlertCircleIcon, CheckCircleIcon, Flag, Loader2, Send, X } from 'lucide-react'
import { useCurrentUser } from '@/hooks/use-auth'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { reportProject } from '@/lib/report'
import { ProjectReport } from '@/types'
import { useRouter } from 'next/navigation'

export const Report = ({ slug, reports }: { slug: string, reports: ProjectReport[] }) => {
    const router = useRouter()
    const { data: user } = useCurrentUser()
    const isAuthenticated = !!user
    const isReported = reports.some((report) => report.user_id === user?.id)
    const isAdmin = user?.role === 'admin'
    const [report, setReport] = useState<string>('')
    const [showReport, setShowReport] = useState<boolean>(false)
    const [reportType, setReportType] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    if (isAdmin) {
        return null
    }

    if (isReported) {
        return (
            <div className='flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border transition-all bg-gray-50 text-primary hover:bg-gray-100'>
                <CheckCircleIcon className='w-4 h-4' />
                <span className='text-sm'> لقد سبق وأن بلغت عن مشكلة في هذا المشروع</span>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <button
                onClick={() => router.push(`/auth/login?redirect=${window.location.pathname}`)}
                className='flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border transition-all bg-gray-50 text-primary hover:bg-gray-100'>
                <AlertCircleIcon className='w-4 h-4' />
                <span className='text-sm'>تسجيل الدخول لتبليغ عن مشكلة</span>
            </button>
        )
    }

    const handleReport = async () => {
        setIsLoading(true)
        if (!reportType) {
            toast.error('يرجى إختيار نوع التبليغ')
            return
        }
        if (!report) {
            toast.error('يرجى إدخال المشكلة التي تواجهك في هذا المشروع')
            return
        }
        try {
            const response = await reportProject(slug, reportType, report)
            toast.success(response)
        } catch (error) {
            toast.error('حدث خطأ أثناء تبليغك عن المشروع')
        } finally {
            setIsLoading(false)
            setShowReport(false)
            setReport('')
            setReportType('')
        }
    }

    return (
        <div>
            <button
                onClick={() => setShowReport(true)}
                className='flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border transition-all bg-gray-50 text-primary hover:bg-gray-100'>
                <AlertCircleIcon className='w-4 h-4' />
                <span className='text-sm'>تبليغ عن مشكلة</span>
            </button>
            {showReport && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className='relative w-full max-w-xl bg-white rounded-2xl p-6 shadow-lg'>
                        <button
                            disabled={isLoading}
                            className='absolute top-4 left-4 rounded-full text-gray-400 p-2 hover:bg-gray-100 transition-all cursor-pointer hover:text-gray-600
                            disabled:opacity-50 disabled:cursor-not-allowed'
                            onClick={() => setShowReport(false)}
                        >
                            <X className='w-4 h-4' />
                        </button>

                        <div className='flex items-center gap-4 mb-6'>
                            <div className='flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10'>
                                <Flag className='w-6 h-6 text-red-600' />
                            </div>

                            <div>
                                <h2 className='text-lg font-bold text-gray-900'>
                                    تبليغ عن مشكلة
                                </h2>
                                <p className='mt-1text-sm text-gray-500'>
                                    يرجى إدخال المشكلة التي تواجهك في هذا المشروع.
                                </p>
                            </div>
                        </div>
                        <div className='mb-2'>
                            <div className='flex flex-wrap items-center gap-2'>
                                <ReportOption
                                    label="محتوى حساس"
                                    value="sensitive_content"
                                    checked={reportType === 'sensitive_content'}
                                    onChange={(value) => setReportType(value)}
                                />

                                <ReportOption
                                    label="صورة غير مناسبة"
                                    value="inappropriate_image"
                                    checked={reportType === 'inappropriate_image'}
                                    onChange={(value) => setReportType(value)}
                                />

                                <ReportOption
                                    label="محتوى خاطئ"
                                    value="wrong_content"
                                    checked={reportType === 'wrong_content'}
                                    onChange={(value) => setReportType(value)}
                                />

                                <ReportOption
                                    label="يتبع لجهة أو كيان مختلف"
                                    value="different_entity"
                                    checked={reportType === 'different_entity'}
                                    onChange={(value) => setReportType(value)}
                                />
                            </div>
                        </div>
                        <div className='space-y-6'>
                            <div>
                                <textarea
                                    value={report}
                                    onChange={(e) => setReport(e.target.value)}
                                    placeholder='أدخل المشكلة التي تواجهك في هذا المشروع...'
                                    rows={6}
                                    maxLength={500}
                                    className='
                            w-full outline-none resize-none bg-gray-50
                            border border-gray-200 rounded-lg p-3
                            focus:border-primary focus:ring-primary/20 focus:ring-2 focus:bg-white
                            text-sm text-gray-700 placeholder:text-gray-400
                            '
                                />

                                <div className='text-left text-sm text-gray-500'>
                                    500 / {report.length}
                                </div>
                            </div>

                            <div className='flex items-center gap-4'>
                                <button
                                    onClick={handleReport}
                                    disabled={isLoading || !report.trim()}
                                    className='
                                    flex-1
                                    flex items-center justify-center gap-1.5 px-4 py-2
                                    rounded-lg border transition-all
                                    bg-primary text-white hover:bg-primary/80 cursor-pointer hover:scale-105
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                '
                                >
                                    {isLoading ?
                                        <div className='flex items-center justify-center gap-1.5'>
                                            <Loader2 className='w-4 h-4 animate-spin' />
                                            <span className='text-sm'>جاري التبليغ...</span>
                                        </div> :
                                        <>
                                            <Send className='w-4 h-4' />
                                            <span className='text-sm'>إرسال</span>
                                        </>}
                                </button>

                                <button
                                    onClick={() => setShowReport(false)}
                                    disabled={isLoading}
                                    className='
                                    flex-1
                                    px-4 py-2
                                    rounded-lg border transition-all
                                    bg-gray-50 text-gray-600 hover:bg-gray-100 cursor-pointer hover:scale-105
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                '
                                >
                                    <span className='text-sm'>إلغاء</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                </div>
            )}
        </div>
    )
}

const ReportOption = ({ label, value, checked, onChange }: { label: string, value: string, checked: boolean, onChange: (value: string) => void }) => {
    return (
        <label
            htmlFor={value}
            className="
            flex items-center gap-3 cursor-pointer rounded-xl border border-gray-200
          bg-white p-2 transition-all duration-200 hover:border-red-400 hover:bg-red-50 has-[:checked]:border-red-500
          has-[:checked]:bg-red-50
            has-[:checked]:shadow-sm
            "
        >
            <input
                id={value}
                type="radio"
                name="reportType"
                className="peer sr-only"
                checked={checked}
                onChange={() => { onChange(value); console.log(value) }}
            />

            <div
                className="
                flex h-5 w-5 items-center justify-center
                rounded-full
                border-2 border-gray-300
                transition-all
              peer-checked:border-red-500
                "
            >
                <div
                    className="
                    h-2.5 w-2.5 rounded-full bg-red-500 scale-0 transition-transform peer-checked:scale-100"
                />
            </div>

            <p className="font-medium text-gray-800">{label}</p>

        </label>
    )
}