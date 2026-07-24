import type { ReactNode } from 'react'

interface LegalPageLayoutProps {
    title: string
    lastUpdated: string
    children: ReactNode
}

export default function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
    return (
        <div>
            <div className="bg-primary text-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                    <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
                    <p className="text-white/60 text-sm mt-2">آخر تحديث: {lastUpdated}</p>
                </div>
            </div>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8 space-y-8">
                    {children}
                </div>
            </div>
        </div>
    )
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
            <div className="text-gray-600 text-sm sm:text-[15px] leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:pr-5 [&_ul]:space-y-1">
                {children}
            </div>
        </section>
    )
}
