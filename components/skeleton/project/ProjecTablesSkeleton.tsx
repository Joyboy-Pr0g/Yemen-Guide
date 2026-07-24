import React from 'react';

interface ProjectTablesSkeletonProps {
    isAdmin?: boolean;
}

export default function ProjectTablesSkeleton({ isAdmin = false }: ProjectTablesSkeletonProps) {
    // Generate a mock range of table rows (e.g., 5 rows)
    const skeletonRows = Array.from({ length: 5 });

    return (
        <>
            {skeletonRows.map((_, index) => (
                <tr key={index} className="border-b border-gray-50 animate-pulse">

                    {/* Column 1: Project Identity info */}
                    <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                            {/* Thumbnail Frame */}
                            <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0" />
                            {/* Double Lines text block */}
                            <div className="space-y-1.5 w-full">
                                <div className={`h-3.5 bg-gray-200 rounded ${index % 2 === 0 ? 'w-28' : 'w-36'}`} />
                                <div className="h-2.5 bg-gray-200 rounded w-16" />
                            </div>
                        </div>
                    </td>

                    {/* Column 2: Status Badge */}
                    <td className="px-4 py-3">
                        <div className="h-5 bg-gray-200 rounded-full w-14" />
                    </td>

                    {/* Column 3: Verification Badge */}
                    <td className="px-4 py-3">
                        <div className="h-5 bg-gray-200 rounded-full w-16" />
                    </td>

                    {/* Column 4: Views Counter Metric */}
                    <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 bg-gray-200 rounded-sm" />
                            <div className="h-3.5 bg-gray-200 rounded w-8" />
                        </div>
                    </td>

                    {/* Column 5: Action Button Triggers */}
                    <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                            {isAdmin ? (
                                /* Admin-specific Actions Group Placeholders */
                                <>
                                    <div className="h-7 w-9 bg-gray-100 border border-gray-50 rounded-xl" />
                                    <div className="h-7 w-16 bg-gray-100 border border-gray-50 rounded-xl" />
                                    <div className="h-7 w-9 bg-gray-100 border border-gray-50 rounded-xl" />
                                </>
                            ) : (
                                /* Regular User Actions Group Placeholders */
                                <>
                                    <div className="h-7 w-9 bg-gray-100 border border-gray-50 rounded-xl" />
                                    <div className="h-7 w-16 bg-gray-100/70 border border-gray-50 rounded-xl" />
                                    <div className="h-7 w-16 bg-gray-100/70 border border-gray-50 rounded-xl" />
                                </>
                            )}
                        </div>
                    </td>

                </tr>
            ))}
        </>
    );
}