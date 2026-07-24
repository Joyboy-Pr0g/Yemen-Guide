import React from 'react';

export default function VerificationDetailsSkeleton() {
  return (
    <div className="max-w-3xl w-full animate-pulse">
      
      {/* Breadcrumbs Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-3"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>

      {/* Main Header Card Skeleton */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            {/* Title */}
            <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
            {/* Meta text */}
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            {/* Badge status */}
            <div className="pt-1">
              <div className="h-5 bg-gray-200 rounded-full w-20"></div>
            </div>
          </div>
          {/* Action Button placeholder */}
          <div className="w-28 h-10 bg-gray-200 rounded-xl shrink-0"></div>
        </div>

        {/* Reason Subsection */}
        <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>

      {/* Documents 2-Column Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            {/* Document Title */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            
            {/* Media Box aspect ratio 4:3 mimic */}
            <div className="relative rounded-xl bg-gray-100 w-full aspect-[4/3]"></div>
            
            {/* Document Action Buttons */}
            <div className="flex gap-2 mt-3">
              <div className="flex-1 h-8 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 h-8 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}