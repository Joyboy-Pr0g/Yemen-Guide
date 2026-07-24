import { Skeleton } from "@/components/ui/skeleton"
import ProjectCardSkeleton from "./project/ProjectCardSkeleton"

export function HomePageSkeleton() {
    return (
        <div className="bg-background animate-pulse">
            {/* Hero */}
            <section className="relative overflow-hidden min-h-[520px] bg-muted">
                <div className="max-w-4xl mx-auto px-4 pt-16 pb-28 text-center">
                    <Skeleton className="h-8 w-64 mx-auto rounded-full mb-8" />

                    <Skeleton className="h-12 w-[500px] max-w-full mx-auto mb-4" />
                    <Skeleton className="h-12 w-[350px] max-w-full mx-auto mb-6" />

                    <Skeleton className="h-5 w-[500px] max-w-full mx-auto mb-2" />
                    <Skeleton className="h-5 w-[350px] max-w-full mx-auto mb-10" />

                    {/* Search */}
                    <div className="max-w-3xl mx-auto">
                        <Skeleton className="h-16 w-full rounded-2xl" />
                    </div>

                    {/* Quick links */}
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-20 rounded-full" />
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden sm:block">
                    <Skeleton className="h-20 w-[700px] rounded-2xl" />
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Ads */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-xl" />
                    ))}
                </div>

                {/* Categories */}
                <section className="mt-14">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <Skeleton className="h-7 w-48 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-5 w-16" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={i}
                                className="border rounded-xl p-4 space-y-3"
                            >
                                <Skeleton className="h-12 w-12 rounded-lg mx-auto" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Featured */}
                <section className="mt-14">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <Skeleton className="h-7 w-40 mb-2" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-5 w-16" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <ProjectCardSkeleton key={i} count={3} />
                        ))}
                    </div>
                </section>

                {/* Cities */}
                <section className="mt-14 mb-16">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <Skeleton className="h-7 w-52 mb-2" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <Skeleton className="h-5 w-16" />
                    </div>

                    {Array.from({ length: 3 }).map((_, city) => (
                        <div key={city} className="mb-12">
                            <div className="flex justify-between items-center mb-4">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-5 w-24" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <ProjectCardSkeleton key={i} count={4} />
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    )
}