import React from 'react';

export function ProjectDetailsSkeleton() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-pulse" dir="rtl">
            {/* Breadcrumb Skeleton */}
            <div className="h-4 bg-gray-200 rounded-md w-32 mb-6" />

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Column (Left in LTR / Right in RTL) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Hero Image Block Skeleton */}
                    <div className="aspect-video bg-gray-200 rounded-2xl w-full" />

                    {/* Title & Identity Card Skeleton */}
                    <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
                        <div className="flex items-start gap-4">
                            {/* Logo Circle */}
                            <div className="w-16 h-16 bg-gray-200 rounded-full shrink-0" />

                            {/* Text lines */}
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <div className="h-6 bg-gray-200 rounded-lg w-1/2" />
                                    <div className="w-5 h-5 bg-gray-200 rounded-full" />
                                </div>

                                <div className="flex items-center gap-3 pt-1">
                                    <div className="h-5 bg-gray-200 rounded-full w-20" />
                                    <div className="h-4 bg-gray-200 rounded-md w-12" />
                                    <div className="h-4 bg-gray-200 rounded-md w-24" />
                                </div>

                                {/* Save + Share Buttons */}
                                <div className="flex items-center gap-2 pt-2">
                                    <div className="h-9 bg-gray-200 rounded-xl w-24" />
                                    <div className="h-9 bg-gray-200 rounded-xl w-24" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Card Skeleton */}
                    <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50 space-y-3">
                        <div className="h-5 bg-gray-200 rounded-lg w-28" />
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded-md w-full" />
                            <div className="h-4 bg-gray-200 rounded-md w-11/12" />
                            <div className="h-4 bg-gray-200 rounded-md w-4/5" />
                        </div>
                    </div>

                    {/* Embedded Map Block Skeleton */}
                    <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 space-y-4">
                        <div className="h-5 bg-gray-200 rounded-lg w-36" />
                        <div className="rounded-xl bg-gray-200 h-72 w-full" />
                        <div className="h-10 bg-gray-200 rounded-xl w-full" />
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-4">

                    {/* Contact Channels Card */}
                    <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 space-y-4">
                        <div className="h-5 bg-gray-200 rounded-lg w-32 mb-1" />

                        {/* Phone Row */}
                        <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
                            <div className="w-9 h-9 bg-gray-200 rounded-lg shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <div className="h-3 bg-gray-200 rounded-md w-16" />
                                <div className="h-4 bg-gray-200 rounded-md w-28" />
                            </div>
                        </div>

                        {/* WhatsApp Row */}
                        <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
                            <div className="w-9 h-9 bg-gray-200 rounded-lg shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <div className="h-3 bg-gray-200 rounded-md w-12" />
                                <div className="h-4 bg-gray-200 rounded-md w-32" />
                            </div>
                        </div>
                    </div>

                    {/* Location Metadata Card */}
                    <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 space-y-3">
                        <div className="h-5 bg-gray-200 rounded-lg w-20" />
                        <div className="flex items-start gap-2.5">
                            <div className="w-4 h-4 bg-gray-200 rounded-md shrink-0 mt-0.5" />
                            <div className="space-y-2 flex-1">
                                <div className="h-4 bg-gray-200 rounded-md w-full" />
                                <div className="h-4 bg-gray-200 rounded-md w-2/3" />
                            </div>
                        </div>
                    </div>

                    {/* Ratings Card Placeholder */}
                    <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 space-y-4">
                        <div className="h-5 bg-gray-200 rounded-lg w-24" />
                        <div className="flex items-center gap-2">
                            <div className="h-8 bg-gray-200 rounded-lg w-12" />
                            <div className="h-4 bg-gray-200 rounded-md w-20" />
                        </div>
                        <div className="space-y-2 pt-2">
                            <div className="h-2 bg-gray-200 rounded-full w-full" />
                            <div className="h-2 bg-gray-200 rounded-full w-full" />
                            <div className="h-2 bg-gray-200 rounded-full w-4/5" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}