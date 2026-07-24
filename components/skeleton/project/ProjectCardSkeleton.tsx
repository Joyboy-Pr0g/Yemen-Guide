import React from 'react'

type SkeletonVariant = 'public' | 'admin'

export function ProjectCardSkeletonItem({ variant = 'admin' }: { variant?: SkeletonVariant }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-gray-50/50 w-full animate-pulse">
            <div className="relative aspect-video bg-gray-200">
                <div className="absolute top-3 end-3 flex flex-col items-end gap-1.5">
                    <div className="bg-gray-300 h-5 w-14 rounded-full" />
                    <div className="bg-gray-300 h-5 w-20 rounded-full" />
                </div>
            </div>

            <div className="p-4 space-y-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>

                <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 bg-gray-200 rounded-sm" />
                    <div className="h-3.5 bg-gray-200 rounded w-8" />
                </div>

                <div className="flex items-center gap-1.5 pt-0.5">
                    <div className="w-3.5 h-3.5 bg-gray-200 rounded-sm shrink-0" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>

                {variant === 'admin' && (
                    <div className="grid grid-cols-3 gap-2 pt-1">
                        <div className="h-9 bg-gray-100 rounded-xl border border-gray-50" />
                        <div className="h-9 bg-gray-100 rounded-xl border border-gray-50" />
                        <div className="h-9 bg-gray-100 rounded-xl border border-gray-50" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default function ProjectCardSkeleton({
    count,
    variant = 'admin',
}: {
    count: number
    variant?: SkeletonVariant
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: count }).map((_, index) => (
                <ProjectCardSkeletonItem key={index} variant={variant} />
            ))}
        </div>
    )
}
